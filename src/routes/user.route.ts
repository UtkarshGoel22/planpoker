import express from 'express';

import { createGroupValidation } from '../middlewares/group.middleware';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  reverifyUser,
  updateUser,
  verifyUser,
} from '../controllers/user.controller.registration';
import {
  loginUserValidation,
  registerUserValidation,
  reverifyUserValidation,
  tokenValidation,
  updateUserValidation,
  verifyUserValidation,
} from '../middlewares/user.middleware';
import { createUserGroup } from '../controllers/group.controller';

const router: express.Router = express.Router();

router.post('/signup', registerUserValidation, registerUser);

router.get('/verify', verifyUserValidation, verifyUser);

router.post('/verify', reverifyUserValidation, reverifyUser);

router.post('/login', loginUserValidation, loginUser);

router.post('/logout', tokenValidation, logoutUser);

router.get('/', tokenValidation, getUser);

router.patch('/', tokenValidation, updateUserValidation, updateUser);

router.post('/group', tokenValidation, createGroupValidation, createUserGroup);

export default router;
