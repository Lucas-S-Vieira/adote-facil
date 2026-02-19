import { Request, Response } from 'express'
import {
  GetUserAnimalsService,
  getUserAnimalsServiceInstance,
} from '../../services/animal/get-user.js'

class GetUserAnimalsController {
  constructor(private readonly getUserAnimals: GetUserAnimalsService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { user } = request

    try {
      const result = await this.getUserAnimals.execute({
        userId: user?.id || '',
      })

      const statusCode = result.isFailure() ? 400 : 200

      return response.status(statusCode).json(result.value)
    } catch (err) {
      const error = err as Error
      console.error('Error creating animal:', error)
      return response.status(500).json({ error: error.message })
    }
  }
}

export const getUserAnimalsControllerInstance = new GetUserAnimalsController(
  getUserAnimalsServiceInstance,
)
