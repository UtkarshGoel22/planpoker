import express from 'express';

import { registerUser, verifyUser } from '../controllers/user.controller.registration';
import { registerUserValidation, verifyUserValidation } from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.post('/signup', registerUserValidation, registerUser);

router.get('/verify', verifyUserValidation, verifyUser);

export default router;
