import build from './app'
import CORSConfig from '@fastify/cors'
import { FastifyInstance } from 'fastify'

const server: FastifyInstance = build({
  logger: {
    level: 'error',
  },
})

server.register(CORSConfig, {
  origin: [
    'https://vial-assignemnt-frontend.vercel.app', // Production
    'http://localhost:3000', // Development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
})

server
  .listen({ port: 8080, host: '0.0.0.0' })
  .then(address => {
    console.log(`Server listening at ${address}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
