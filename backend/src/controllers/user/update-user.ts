import { Request, Response } from 'express'
import {
  UpdateUserService,
  updateUserServiceInstance,
} from '../../services/user/update-user.js'

class UpdateUserController {
  constructor(private readonly updateUser: UpdateUserService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { name, email, password } = request.body
    const { user } = request

    try {
      const result = await this.updateUser.execute({
        id: user?.id || '',
        data: { name, email, password },
      })

      const statusCode = result.isFailure() ? 400 : 200

      return response.status(statusCode).json(result.value)
    } catch (err) {
      const error = err as Error
      console.log({ error })
      return response.status(500).json({ error: error.message })
    }
  }
}

export const updateUserControllerInstance = new UpdateUserController(
  updateUserServiceInstance,
)
