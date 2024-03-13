import { Router } from 'express'
import { peopleRoutes } from './people.routes'
import { redisCachingMiddleware } from '../middlewares/redis'

const router = Router()

router.use(redisCachingMiddleware())

router.use('/', peopleRoutes)

export { router }
