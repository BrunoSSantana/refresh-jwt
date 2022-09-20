import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'
import { User } from "../repositories/userRepositories"
import { refreshTokenDB } from '../routes/handlers'

export const createRefreshToken = (user: User) => {
  // cria um token menor com infos não importantes do usuário para ser argazenada no cookie
  const token = jwt.sign({ sub: user.username }, process.env.ACCESS_TOKEN_SECRET!, {
    audience: 'urn:jwt:type:refresh',
    issuer: 'urn:system:token-issuer:type:refresh',
    expiresIn: `${process.env.REFRESH_TOKEN_DURATION_MINUTES}m`
  })

  // cria um hash para o token para ser usado como chave no banco
  const tokenHash = createHmac('sha512', process.env.REFRESH_TOKEN_SECRET!).update(token).digest('hex')

  //  guarda o token e o hash no banco
  refreshTokenDB.set(tokenHash, user.username)

  // após 5 minutos, o token é removido do banco
  setTimeout(() => {
    refreshTokenDB.delete(tokenHash)
    console.log(`Refresh token ${tokenHash} expired`)
    console.table(refreshTokenDB.entries())
  }, 5 * 60 * 1000)

  console.table(refreshTokenDB.entries())
  // retorna o token
  return token
}