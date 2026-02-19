import { Request, Response } from 'express'
import {
  GetUserChatService,
  getUserChatServiceInstance,
} from '../../services/chat/get-user-chat.js'

class GetUserChatController {
  constructor(private readonly getUserChat: GetUserChatService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { chatId } = request.params

    const { user } = request

    try {
      const result = await this.getUserChat.execute({
        userId: user?.id || '',
        chatId,
      })

      return response.status(200).json(result)
    } catch (err) {
      const error = err as Error
      console.log({ error })
      return response.status(500).json({ error: error.message })
    }
  }
}

export const getUserChatControllerInstance = new GetUserChatController(
  getUserChatServiceInstance,
)
