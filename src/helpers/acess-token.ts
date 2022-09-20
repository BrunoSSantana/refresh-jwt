import jwt from 'jsonwebtoken'
import { User } from "../repositories/userRepositories"

export const createAccessToken = (user: User) => {
  //  retorna o token para o cliente
  return jwt.sign(
    // adixiona ao payload dados do usuário
    { sub: user.username, name: user.name, age: user.age, social: user.social },
    // chave secreta
    process.env.ACCESS_TOKEN_SECRET!,
    /**
     * O audience é o público que pode usar o token.
     * O issuer é o emissor do token.
     */
    {
      audience: 'urn:jwt:type:access',
      issuer: 'urn:system:token-issuer:type:access',
      expiresIn: `${process.env.ACCESS_TOKEN_DURATION_MINUTES}m`
    }
  )
}