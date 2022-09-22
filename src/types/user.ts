import { Permissions } from "./permissions"
import { Roles } from "./roles"

export type User = {
  username: string
  roles: Roles[]
  permissions: Permissions[]
  name: string
  age: number
  social: string
  password: string
}
