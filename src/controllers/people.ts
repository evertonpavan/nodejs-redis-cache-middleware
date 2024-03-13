import { getAllPeople } from '@/services/api/functions'
import { Request, Response } from 'express'

const PeopleController = {
  getAll: async (req: Request, res: Response) => {
    // simulate the time to retrieve the user list
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const data = await getAllPeople()

    res.send({
      fromCache: false,
      data,
    })
  },
}

export { PeopleController }
