import { Response, Router } from 'express'
import { createAccessToken } from '../helpers/acess-token';
import { createRefreshToken } from '../helpers/refresh-token';
import { setRefreshCookie } from '../helpers/set-refresh-cookie';
import { withAccessAuth } from '../middlewares/acess-token-auth';
import { withRefreshAuth } from '../middlewares/refresh-token-auth';
import { User, users } from '../repositories/userRepositories'

// Extende Interface da response e do jwtPayload para adicionar o user
export interface ExtendedResponse extends Response<any, { user: Partial<User>; refreshHash: string }> { }

// Cria um banco in-memory para exemplificar o uso de um banco de dados real
export const refreshTokenDB = new Map<string, string>()

export const router = Router();

router.post('/login', (req, res: ExtendedResponse) => {
  // rece username e senha do body
  const { username, password } = req.body

  // busca o usuário no banco de dados com msm email e senha
  const user = users.find((user) => user.username === username && user.password === password)

  // se não encontrar o usuário, retorna erro
  if (!user) return res.status(401).send('Unauthorized')

  // se encontrar o usuário, gera o token e refreshToken
  const accessToken = createAccessToken(user)
  const refreshToken = createRefreshToken(user)

  // manda o refreshToken para o cookie
  setRefreshCookie(res, refreshToken)

  // retorna o token para o cliente
  res.json({ accessToken })
})

// PONTO IMPOTRANTE
router.post('/refresh', withRefreshAuth, (_, res: ExtendedResponse) => {
  /**
   * - Verificar se ele existe no nosso banco de dados
   * - Se existir, vamos buscar o usuário com o qual ele está relacionado
   * - Geramos um novo token de acesso e um novo token de refresh
   * - Enviamos o token de refresh via cookie e retornamos o token de acesso
   */

  // busca o username no banco fake a partir do da hash refreshToken
  const username = refreshTokenDB.get(res.locals.refreshHash)

  //  busca usuário a partir do username
  const user = users.find((user) => user.username === username)
  // se não encontrar o usuário e/ou username, retorna erro
  if (!username || !user) return res.status(403).send('Could not find user for this refresh token')

  // cria token e refreshToken
  const accessToken = createAccessToken(user)
  const refreshToken = createRefreshToken(user)

  //  seta o refreshToken no cookie
  setRefreshCookie(res, refreshToken)

  // retorna o token de acesso
  res.json({ accessToken })
})

router.get('/users/:username', withAccessAuth, (req, res) => {
  // busca o usuário no banco de dados com msm username
  const user = users.find((user) => user.username === req.params.username)
  // se não encontrar o usuário, retorna erro
  if (!user) return res.status(404).send('User not found')

  // retorna o usuário
  res.json(user)
})

export const apiRoutes = router