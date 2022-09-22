import { NextFunction, Request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { users } from "../repositories/user-repository"
import { ExtendedResponse } from "../routes/handlers"
import { Permissions } from "../types/permissions"
import { User } from "../types/user"

interface AccessTokenPayload extends JwtPayload, Omit<User, 'username' | 'password'> { }

export const permissionAccessAuth = (...permissions: Permissions[]) =>
  (req: Request, res: ExtendedResponse, next: NextFunction) => {

    // busca o bearer token de acesso
    const token = req.headers['authorization']?.split('Bearer ')[1]

    // se não existir, retorna erro de não autorizado
    if (!token) return res.status(401).json({ statusCode: 401, message: 'Unauthorized' })

    try {
      // verifica se o token é válido e pega os dados do payload
      const { sub, name, age, social } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, {
        // verifica a audience do token
        audience: 'urn:jwt:type:access'
        // faz o casting do payload para o tipo de payload esperado
      }) as AccessTokenPayload

      // busca o user
      const user = users.find((user) => user.username === sub)

      // se não encontrar o usuário, retorna erro
      if (!user) return res.status(404).json({ statusCode: 404, message: 'User not found' })

      // verifica se o user tem permissão para acessar a rota
      const hasPermission = permissions.some((permission) => user.permissions.includes(permission))

      // se não tiver permissão, retorna erro
      if (!hasPermission) return res.status(403).json({ statusCode: 403, message: 'Forbidden! You don\'t permission to access this route' })

      next()
    } catch (error) {
      // se o token estiver inválido, retorna erro de não autorizado
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' })
    }
  }