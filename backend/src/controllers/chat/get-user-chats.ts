import { Request, Response } from 'express'
import {
  GetUserChatsService,
  getUserChatsServiceInstance,
} from '../../services/chat/get-user-chats.js'

class GetUserChatsController {
  constructor(private readonly getUserChats: GetUserChatsService) {}

  handle = async (request: Request, response: Response): Promise<Response> => {
    const { user } = request

    try {
      const result = await this.getUserChats.execute({
        userId: user?.id || '',
      })

      return response.status(200).json(result)
    } catch (err) {
      const error = err as Error
      console.log({ error })
      return response.status(500).json({ error: error.message })
    }
  }
}

export const getUserChatsControllerInstance = new GetUserChatsController(
  getUserChatsServiceInstance,
)
