import { User } from "../types/user";

export const users: User[] = [
  {
    name: 'Lucas Santos',
    age: 27,
    social: 'twitter.lsantos.dev',
    username: 'lsantosdev',
    password: '123456',
    permissions: ['delete', 'read', "share", "upload_files", "upload_files", "write"],
    roles: ['admin'],
  },
  {
    name: 'Bruno Santana',
    age: 25,
    social: 'http://ko.st/wa',
    username: 'brunossantana',
    password: 'Usuario123@',
    permissions: ['read', "share"],
    roles: ['guest'],
  },
  {
    name: 'Russell Spencer',
    age: 66,
    social: 'http://egki.tp/ecbu',
    username: 'russellspencer',
    password: '123456',
    permissions: ['read', "share", "upload_files"],
    roles: ['user'],
  }
];

export const getUsers = (): User[] => {
  return users;
};

export const addUser = (user: User): User => {
  users.push(user);

  return user;
};