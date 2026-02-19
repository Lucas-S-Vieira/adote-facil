import { Request, Response } from 'express'
import {
  UserLoginService,
  userLoginServiceInstance,
} from '../../services/user/user-login.js'

class UserLoginController {
  constructor(private readonly userLogin: UserLoginService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { email, password } = request.body

    try {
      const result = await this.userLogin.execute({ email, password })

      const statusCode = result.isFailure() ? 400 : 201

      return response.status(statusCode).json(result.value)
    } catch (err) {
      const error = err as Error
      console.log({ error })
      return response.status(500).json({ error: error.message })
    }
  }
}

export const userLoginControllerInstance = new UserLoginController(
  userLoginServiceInstance,
)
