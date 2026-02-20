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
  (req, res) => createUserControllerInstance.handle(req, res),
)

router.patch(
  '/users',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => updateUserControllerInstance.handle(req, res),
)

router.post(
  '/users/chats/messages',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => createUserChatMessageControllerInstance.handle(req, res),
)

router.post(
  '/users/chats',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => createUserChatControllerInstance.handle(req, res),
)

router.get(
  '/users/chats',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => getUserChatsControllerInstance.handle(req, res),
)

router.get(
  '/users/chats/:chatId',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => getUserChatControllerInstance.handle(req, res),
)

router.post(
  '/login',
  (req, res) => userLoginControllerInstance.handle(req, res),
)

router.post(
  '/animals',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  upload.array('pictures', 5), // Middleware do multer para upload de até 5 arquivos
  (req, res) => createAnimalControllerInstance.handle(req, res),
)

router.patch(
  '/animals/:id',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => updateAnimalStatusControllerInstance.handle(req, res),
)

router.get(
  '/animals/available',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => getAvailableAnimalsControllerInstance.handle(req, res),
)

router.get(
  '/animals/user',
  (req, res, next) => userAuthMiddlewareInstance.authenticate(req, res, next),
  (req, res) => getUserAnimalsControllerInstance.handle(req, res),
)

export { router }