import express from 'express';

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

const router: express.Router = express.Router();

router.post('/signup', registerUserValidation, registerUser);

router.get('/verify', verifyUserValidation, verifyUser);

router.post('/verify', reverifyUserValidation, reverifyUser);

router.post('/login', loginUserValidation, loginUser);

router.post('/logout', tokenValidation, logoutUser);

router.get('/', tokenValidation, getUser);

router.patch('/', tokenValidation, updateUserValidation, updateUser);

export default router;
