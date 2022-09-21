import jwt from 'jsonwebtoken'
import { User } from "../repositories/user-repository"
import { env } from './env'

export const createAccessToken = (user: User) => {

  const accessTokenSecret = env<string>('ACCESS_TOKEN_SECRET')
  const accessTokenDurationMinutes = env<string>('ACCESS_TOKEN_DURATION_MINUTES')

  //  retorna o token para o cliente
  return jwt.sign(
    // adiciona ao payload dados do usuário
    { sub: user.username, name: user.name, age: user.age, social: user.social },
    // chave secreta
    accessTokenSecret,
    /**
     * O audience é o público que pode usar o token.
     * O issuer é o emissor do token.
     */
    {
      audience: 'urn:jwt:type:access',
      issuer: 'urn:system:token-issuer:type:access',
      expiresIn: `${accessTokenDurationMinutes}m`
    }
  )
}