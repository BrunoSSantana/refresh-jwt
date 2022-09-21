import { Router } from "express";

import { withAccessAuth } from "../middlewares/acess-token-auth";
import { users, User } from "../repositories/user-repository";

export const routerUser = Router();

routerUser.get('/:username', withAccessAuth, (req, res) => {
  // busca o usuário no banco de dados com msm username
  const user = users.find((user) => user.username === req.params.username)
  // se não encontrar o usuário, retorna erro
  if (!user) return res.status(404).send('User not found')

  // retorna o usuário
  res.json(user)
})

routerUser.get('', withAccessAuth, (req, res) => {
  // retorna todos os usuários
  res.json(users)
})

routerUser.post('', withAccessAuth, (req, res) => {
  // retorna todos os usuários

  const { name, username, password, age, social } = req.body

  const user: User = {
    username,
    password,
    age,
    social,
    name
  }

  users.push(user)

  res.json(user)
})

routerUser.delete('/:username', withAccessAuth, (req, res) => {
  // remove usuário

  const userIndex = users.findIndex(
    (user) => user.username === req.params.username
  )

  if (userIndex === -1) return res.status(404).send('User not found')

  users.splice(userIndex, 1)

  res.status(204).send()
})