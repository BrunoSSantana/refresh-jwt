import jwt from 'jsonwebtoken'
import { NextFunction, Request } from "express"
import { ExtendedResponse } from "../routes/handlers"
import { createHmac } from 'crypto'

export const withRefreshAuth = (req: Request, res: ExtendedResponse, next: NextFunction) => {
  const token = req.cookies['refresh-token']
  if (!token) return res.status(401).send('Unauthorized')

  // verifica o token
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, {
      // verifica a audience do token
      audience: 'urn:jwt:type:refresh'
    })

    // gera hash do refresh token e guarda na resposta local para uso posterior
    const tokenHash = createHmac('sha512', process.env.REFRESH_TOKEN_SECRET!).update(token).digest('hex')
    res.locals.refreshHash = tokenHash

    // continua a execução
    next()
  } catch (error) {
    // se o token estiver inválido, retorna erro de não autorizado
    return res.status(401).send('Unauthorized')
  }
}