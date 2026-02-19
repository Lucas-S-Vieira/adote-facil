import { Router } from 'express'
import { createUserControllerInstance } from './controllers/user/create-user.js'
import { userLoginControllerInstance } from './controllers/user/user-login.js'
import { upload } from './config/multer.js'
import { createAnimalControllerInstance } from './controllers/animal/create-animal.js'
import { userAuthMiddlewareInstance } from './middlewares/user-auth.js'
import { getAvailableAnimalsControllerInstance } from './controllers/animal/get-available.js'
import { getUserAnimalsControllerInstance } from './controllers/animal/get-user-animals.js'
import { updateUserControllerInstance } from './controllers/user/update-user.js'
import { updateAnimalStatusControllerInstance } from './controllers/animal/update-animal-status.js'
import { createUserChatMessageControllerInstance } from './controllers/chat/create-user-chat-message.js'
import { getUserChatsControllerInstance } from './controllers/chat/get-user-chats.js'
import { getUserChatControllerInstance } from './controllers/chat/get-user-chat.js'
import { createUserChatControllerInstance } from './controllers/chat/create-user-chat.js'

const router = Router()

router.post(
  '/users',
  createUserControllerInstance.handle,
)

router.patch(
  '/users',
  userAuthMiddlewareInstance.authenticate,
  updateUserControllerInstance.handle,
)

router.post(
  '/users/chats/messages',
  userAuthMiddlewareInstance.authenticate,
  createUserChatMessageControllerInstance.handle,
)

router.post(
  '/users/chats',
  userAuthMiddlewareInstance.authenticate,
  createUserChatControllerInstance.handle,
)

router.get(
  '/users/chats',
  userAuthMiddlewareInstance.authenticate,
  getUserChatsControllerInstance.handle,
)

router.get(
  '/users/chats/:chatId',
  userAuthMiddlewareInstance.authenticate,
  getUserChatControllerInstance.handle,
)

router.post(
  '/login',
  userLoginControllerInstance.handle,
)

router.post(
  '/animals',
  userAuthMiddlewareInstance.authenticate,
  upload.array('pictures', 5), // Middleware do multer para upload de até 5 arquivos
  createAnimalControllerInstance.handle,
)

router.patch(
  '/animals/:id',
  userAuthMiddlewareInstance.authenticate,
  updateAnimalStatusControllerInstance.handle,
)

router.get(
  '/animals/available',
  userAuthMiddlewareInstance.authenticate,
  getAvailableAnimalsControllerInstance.handle,
)

router.get(
  '/animals/user',
  userAuthMiddlewareInstance.authenticate,
  getUserAnimalsControllerInstance.handle,
)

export { router }
