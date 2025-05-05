import { FastifyInstance } from 'fastify'

import prisma from '../db/db_client'
import { Status } from '@prisma/client'
import { serializer } from './middleware/pre_serializer'
import { ApiError } from '../errors'

interface CreateQueryBody {
  title: string
  description?: string
  formDataId: string
}

interface UpdateQueryBody {
  status: Status
}

const querySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    status: { type: 'string', enum: ['OPEN', 'RESOLVED'] },
    formDataId: { type: 'string' },
  },
}

const createQueryBodySchema = {
  type: 'object',
  required: ['title', 'formDataId'],
  properties: {
    title: { type: 'string' },
    description: { type: 'string', nullable: true },
    formDataId: { type: 'string' },
  },
}

const updateQueryBodySchema = {
  type: 'object',
  required: ['status'],
  properties: {
    status: { type: 'string', enum: ['OPEN', 'RESOLVED'] },
  },
}

const errorSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    message: { type: 'string' },
  },
}

const successResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    data: querySchema,
    message: { type: 'string' },
  },
}

const deleteResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'number' },
    data: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    message: { type: 'string' },
  },
}

async function queriesRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'queriesRoutes' })

  app.post<{
    Body: CreateQueryBody
  }>('', {
    schema: {
      tags: ['queries'],
      summary: 'Create a new query',
      description: 'Creates a new query related to form data',
      body: createQueryBodySchema,
      response: {
        200: successResponseSchema,
        400: errorSchema,
        404: errorSchema,
      },
    },
    async handler(req, reply) {
      log.debug('create query')
      try {
        // Check if the form data exists
        const formData = await prisma.formData.findUnique({
          where: { id: req.body.formDataId },
        })
        if (!formData) {
          throw new ApiError('form data not found', 404)
        }

        const query = await prisma.query.create({
          data: {
            title: req.body.title,
            description: req.body.description,
            formDataId: req.body.formDataId,
            status: Status.OPEN,
          },
        })
        reply.send(query)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create query', 400)
      }
    },
  })

  app.patch<{
    Params: { id: string }
    Body: UpdateQueryBody
  }>('/:id', {
    schema: {
      tags: ['queries'],
      summary: 'Update a query',
      description: 'Updates a query status by ID',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'Query ID' },
        },
      },
      body: updateQueryBodySchema,
      response: {
        200: successResponseSchema,
        400: errorSchema,
        404: errorSchema,
      },
    },
    async handler(req, reply) {
      log.debug('update query')
      try {
        const query = await prisma.query.update({
          where: { id: req.params.id },
          data: {
            status: req.body.status,
          },
        })
        reply.send(query)
      } catch (err: any) {
        log.error({ err }, err.message)
        // P2025 is the Prisma error code for not found
        if (err.code === 'P2025') {
          throw new ApiError('query not found', 404)
        }
        throw new ApiError('failed to update query', 400)
      }
    },
  })

  app.delete<{
    Params: { id: string }
  }>('/:id', {
    schema: {
      tags: ['queries'],
      summary: 'Delete a query',
      description: 'Deletes a query by ID',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'Query ID' },
        },
      },
      response: {
        200: deleteResponseSchema,
        400: errorSchema,
        404: errorSchema,
      },
    },
    async handler(req, reply) {
      log.debug('delete query')
      try {
        await prisma.query.delete({
          where: { id: req.params.id },
        })
        reply.send({ message: 'Query deleted successfully' })
      } catch (err: any) {
        log.error({ err }, err.message)
        // P2025 is the Prisma error code for not found
        if (err.code === 'P2025') {
          throw new ApiError('query not found', 404)
        }
        throw new ApiError('failed to delete query', 400)
      }
    },
  })
}

export default queriesRoutes
