import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import formDataRoutes from './routes/form_data'
import queriesRoutes from './routes/queries'
import errorHandler from './errors'

function build(opts = {}) {
  const app = fastify(opts)

  // Generate Swagger docs and UI
  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Query Management API',
        description: 'API documentation for Query Management System',
        version: '1.0.0',
      },
      tags: [
        { name: 'form-data', description: 'Form data related endpoints' },
        { name: 'queries', description: 'Query related endpoints' },
      ],
    },
  })
  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  })

  app.register(formDataRoutes, { prefix: '/form-data' })
  app.register(queriesRoutes, { prefix: '/queries' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
