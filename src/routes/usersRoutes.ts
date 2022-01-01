import express, { Router } from 'express';
import { searchUser } from '../controllers/user.controller';
import { searchValidation } from '../middlewares/user.validation';

const usersRouter: Router = express.Router();

usersRouter.get('/', searchValidation, searchUser);

export default usersRouter;
