import express from 'express';

import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  reverifyUser,
  verifyUser,
} from '../controllers/user.controller.registration';
import {
  loginUserValidation,
  registerUserValidation,
  reverifyUserValidation,
  tokenValidation,
  verifyUserValidation,
} from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.post('/signup', registerUserValidation, registerUser);

router.get('/verify', verifyUserValidation, verifyUser);

router.post('/verify', reverifyUserValidation, reverifyUser);

router.post('/login', loginUserValidation, loginUser);

router.post('/logout', tokenValidation, logoutUser);

router.get('/', tokenValidation, getUser);

export default router;
