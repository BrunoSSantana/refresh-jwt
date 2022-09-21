export type User = {
  username: string
  name: string
  age: number
  social: string
  password: string
}

export const users: User[] = [
  {
    name: 'Lucas Santos',
    age: 27,
    social: 'twitter.lsantos.dev',
    username: 'lsantosdev',
    password: '123456'
  },
  {
    name: 'Bruno Santana',
    age: 25,
    social: 'http://ko.st/wa',
    username: 'brunossantana',
    password: 'Usuario123@'
  },
  {
    name: 'Russell Spencer',
    age: 66,
    social: 'http://egki.tp/ecbu',
    username: 'russellspencer',
    password: '123456'
  }
];

export const getUsers = (): User[] => {
  return users;
};

export const addUser = (user: User): User => {
  users.push(user);

  return user;
};