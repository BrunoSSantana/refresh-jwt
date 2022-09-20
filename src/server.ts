import 'dotenv/config';
import * as E from 'fp-ts/lib/Either'
import express from 'express';
import { getUsers } from './repositories/userRepositories';
import cookieParser from 'cookie-parser';
import { apiRoutes } from './routes/handlers';

const PORT = process.env.PORT || 3333;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes)
app.get('/', (req, res) => {

  const users = getUsers();

  return res.send(users);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));