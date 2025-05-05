import { FastifyInstance } from 'fastify'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ICountedFormData } from './schemas/formData.interface'
import { ApiError } from '../errors'

const formDataSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: { type: 'string' },
    answer: { type: 'string' },
    query: {
      type: 'object',
      nullable: true,
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['OPEN', 'RESOLVED'] },
        formDataId: { type: 'string' },
      },
    },
  },
}

const formDataResponseSchema = {
  type: 'object',
  properties: {
    total: { type: 'number' },
    formData: {
      type: 'array',
      items: formDataSchema,
    },
  },
}

async function formDataRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formDataRoutes' })

  app.get<{
    Reply: ICountedFormData
  }>('', {
    schema: {
      tags: ['form-data'],
      summary: 'Get all form data',
      description:
        'Returns a list of all form data entries with related queries',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            data: formDataResponseSchema,
            message: { type: 'string' },
          },
        },
        400: {
          description: 'Bad Request',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
          },
        },
      },
    },
    async handler(req, reply) {
      log.debug('get form data')
      try {
        const formData = await prisma.formData.findMany({
          include: {
            query: true,
          },
        })
        reply.send({
          total: formData.length,
          formData,
        })
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch form data', 400)
      }
    },
  })
}

export default formDataRoutes
