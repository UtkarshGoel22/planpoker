import express from 'express';

import { registerUser } from '../controllers/user.controller.registration';
import { registerUserValidation } from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.post('/signup', registerUserValidation, registerUser);

export default router;
