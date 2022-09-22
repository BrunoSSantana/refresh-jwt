import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';

import { getUsers } from './repositories/user-repository';
import { apiRoutes } from './routes/handlers';
import { env } from './helpers/env';

const PORT = env<number>('PORT') || 3333;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes)

app.get('/', (req, res) => {

  const users = getUsers();

  return res.json(users);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));