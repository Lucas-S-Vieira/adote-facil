import { Request, Response, NextFunction } from 'express'
import {
  Authenticator,
  authenticatorInstance,
} from '../providers/authenticator.js'

class UserAuthMiddleware {
  constructor(private readonly authenticator: Authenticator) {}

  authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido.' })
    }

    const [, token] = authHeader.split(' ')

    const decoded = this.authenticator.validateToken<{
      id: string
      name: string
      email: string
    }>(token)

    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' })
    }

    // Adiciona o payload decodificado ao objeto `req.user`
    req.user = decoded

    return next()
  }
}

export const userAuthMiddlewareInstance = new UserAuthMiddleware(
  authenticatorInstance,
)
