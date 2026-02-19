import { Request, Response } from 'express'
import {
  UpdateAnimalStatusService,
  updateAnimalStatusServiceInstance,
} from '../../services/animal/update-animal-status.js'

class UpdateAnimalStatusController {
  constructor(private readonly updateAnimalStatus: UpdateAnimalStatusService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { status } = request.body
    const { id } = request.params
    const { user } = request

    try {
      const result = await this.updateAnimalStatus.execute({
        id,
        status,
        userId: user?.id || '',
      })

      const statusCode = result.isFailure() ? 400 : 200

      return response.status(statusCode).json(result.value)
    } catch (err) {
      const error = err as Error
      console.error('Error updating animal:', error)
      return response.status(500).json({ error: error.message })
    }
  }
}

export const updateAnimalStatusControllerInstance =
  new UpdateAnimalStatusController(updateAnimalStatusServiceInstance)
