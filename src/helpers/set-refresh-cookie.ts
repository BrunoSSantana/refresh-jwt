import { ExtendedResponse } from "../routes/handlers"
import { env } from "./env"

export const setRefreshCookie = (res: ExtendedResponse, token: string) => {
  const refreshTokenDurationMinutes = +env<number>('REFRESH_TOKEN_DURATION_MINUTES')

  res.cookie('refresh-token', token, {
    // Impede que o token seja acessível pelo JS
    httpOnly: true,
    // Impede o uso do cookie fora de ambientes HTTPS
    secure: true,
    // Os cookies só podem ser usados no mesmo domínio
    sameSite: 'strict',
    // Data de expiração do token
    expires: new Date(Date.now() + refreshTokenDurationMinutes * 60 * 1000)
  })
}