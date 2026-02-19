import { Request, Response } from 'express'
import {
  CreateUserService,
  createUserServiceInstance,
} from '../../services/user/create-user.js'

class CreateUserController {
  constructor(private readonly createUser: CreateUserService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { name, email, password } = request.body

    try {
      const result = await this.createUser.execute({ name, email, password })

      const statusCode = result.isFailure() ? 400 : 201

      return response.status(statusCode).json(result.value)
    } catch (err) {
      const error = err as Error
      console.log({ error })
      return response.status(500).json({ error: error.message })
    }
  }
}

export const createUserControllerInstance = new CreateUserController(
  createUserServiceInstance,
)
