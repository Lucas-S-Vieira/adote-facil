import { Request, Response } from 'express'
import {
  CreateUserChatService,
  createUserChatServiceInstance,
} from '../../services/chat/create-user-chat.js'

class CreateUserChatController {
  constructor(private readonly createUserChat: CreateUserChatService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { userId } = request.body
    const { user } = request

    try {
      const result = await this.createUserChat.execute({
        user1Id: user?.id || '',
        user2Id: userId,
      })

      const status = result.isFailure() ? 400 : 201

      return response.status(status).json(result.value)
    } catch (err) {
      const error = err as Error
      console.log({ error })
      return response.status(500).json({ error: error.message })
    }
  }
}

export const createUserChatControllerInstance = new CreateUserChatController(
  createUserChatServiceInstance,
)
