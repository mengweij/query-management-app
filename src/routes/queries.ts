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

async function queriesRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'queriesRoutes' })

  app.post<{
    Body: CreateQueryBody
  }>('', {
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
}

export default queriesRoutes
