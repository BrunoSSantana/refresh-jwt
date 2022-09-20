import { NextFunction, Request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { User } from "../repositories/userRepositories"
import { ExtendedResponse } from "../routes/handlers"

interface AccessTokenPayload extends JwtPayload, Omit<User, 'username' | 'password'> {}

export const withAccessAuth = (req: Request, res: ExtendedResponse, next: NextFunction) => {
  // busca o bearer token de acesso
  const token = req.headers['authorization']?.split('Bearer ')[1]

  // se não existir, retorna erro de não autorizado
  if (!token) return res.status(401).send('Unauthorized')


  try {
    // verifica se o token é válido e pega os dados do payload
    const { sub, name, age, social } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, {
      // verifica a audience do token
      audience: 'urn:jwt:type:access'
      // faz o casting do payload para o tipo de payload esperado
    }) as AccessTokenPayload

    // garda os dados do user na response local para uso posterior
    res.locals.user = { username: sub, name, age, social }

    // continua a execução
    next()
  } catch (error) {
    // se o token estiver inválido, retorna erro de não autorizado
    return res.status(401).send('Unauthorized')
  }
}