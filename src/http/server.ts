// import "reflect-metadata";
import express from 'express'
import { router } from './routes'
import cors from 'cors'
import { initializeRedisClient } from './middlewares/redis'
import { env } from '@/env'

async function initializeExpressServer() {
  const app = express()
  app.use(express.json())
  app.use(cors())

  // connect to Redis
  await initializeRedisClient()

  app.use(router)

  app.listen(env.PORT, () => console.log(`Server is running on ${env.PORT}`))
}

initializeExpressServer()
  .then()
  .catch((e) => console.error(e))
