import { Response, Router } from 'express'

import { User } from '../types/user';
import { routerAuth } from './auth.routes';
import { routerUser } from './user.routes';

// Extende Interface da response e do jwtPayload para adicionar o user
export interface ExtendedResponse extends Response<
  any,
  { user: Partial<User>; refreshHash: string }
> {}

export const router = Router();

router.use('/auth', routerAuth)
router.use('/users', routerUser)

export const apiRoutes = router