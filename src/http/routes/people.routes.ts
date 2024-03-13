import { PeopleController } from '@/controllers/people'
import { Router } from 'express'

const peopleRoutes = Router()

peopleRoutes.get('/people', PeopleController.getAll)

export { peopleRoutes }
