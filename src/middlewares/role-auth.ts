import { NextFunction, Request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { users } from "../repositories/user-repository"
import { ExtendedResponse } from "../routes/handlers"
import { Roles } from "../types/roles"
import { User } from "../types/user"

interface AccessTokenPayload extends JwtPayload, Omit<User, 'username' | 'password'> { }

export const roleAccessAuth = (...roles: Roles[]) =>
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
      const hasRole = roles.some((role) => user.roles.includes(role))

      // se não tiver permissão, retorna erro
      if (!hasRole) return res.status(403).json({ statusCode: 403, message: 'Forbidden! You don\'t belong to the route with authorization to access this route' })

      next()
    } catch (error) {
      // se o token estiver inválido, retorna erro de não autorizado
      return res.status(401).json({ statusCode: 401, message: 'Unauthorized' })
    }
  }