import { Router } from "express";

import { withAccessAuth } from "../middlewares/acess-token-auth";
import { permissionAccessAuth } from "../middlewares/permission-auth";
import { roleAccessAuth } from "../middlewares/role-auth";
import { users } from "../repositories/user-repository";
import { User } from "../types/user";

export const routerUser = Router();

routerUser.get('/:username', withAccessAuth, (req, res) => {
  // busca o usuário no banco de dados com msm username
  const user = users.find((user) => user.username === req.params.username)
  // se não encontrar o usuário, retorna erro
  if (!user) return res.status(404).json({ statusCode: 404, message: 'User not found' })

  // retorna o usuário
  res.json(user)
})

routerUser.get('',
  withAccessAuth,
  permissionAccessAuth('read'),
  roleAccessAuth('user'),
  (req, res) => {
    // retorna todos os usuários
    res.json(users)
  }
)

routerUser.post('',
  withAccessAuth,
  permissionAccessAuth('write'),
  roleAccessAuth('user', 'guest', 'admin'),
  (req, res) => {
    // retorna todos os usuários

    const { name, username, password, age, social, permissions, roles } = req.body

    const user: User = {
      username,
      password,
      age,
      social,
      name,
      permissions,
      roles,
    }

    users.push(user)

    res.json(user)
  }
)

routerUser.delete('/:username',
  withAccessAuth,
  roleAccessAuth('admin'),
  (req, res) => {
    // remove usuário
    const userIndex = users.findIndex(
      (user) => user.username === req.params.username
    )

    if (userIndex === -1) return res.status(404).json({ statusCode: 404, message: 'User not found' })

    users.splice(userIndex, 1)

    res.status(204).send()
  }
)