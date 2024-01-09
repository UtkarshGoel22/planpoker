import express from 'express';

import {
  registerUser,
  reverifyUser,
  verifyUser,
} from '../controllers/user.controller.registration';
import {
  registerUserValidation,
  reverifyUserValidation,
  verifyUserValidation,
} from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.post('/signup', registerUserValidation, registerUser);

router.get('/verify', verifyUserValidation, verifyUser);

router.post('/verify', reverifyUserValidation, reverifyUser);

export default router;
