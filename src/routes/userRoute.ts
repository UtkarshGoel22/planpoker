import express, { Router } from 'express';
import {
  getReportOfUser,
  getGroupsAssociatedToUser,
  getPokerboardAssociatedToUser,
  getTicketsAssociatedToUser,
} from '../controllers/user.controller';
import { loginUser, logoutUser } from '../controllers/user.controller.auth';
import {
  registerUser,
  reverifyUser,
  verifyUser,
} from '../controllers/user.controller.register';
import { getUser, updateUser } from '../controllers/user.controller.details';
import {
  loginValidation,
  registerUserValidation,
  reverificationValidation,
  tokenValidation,
  verificationValidation,
  searchValidation,
  updateUserValidation,
  pokerboardReportValidation,
} from '../middlewares/user.validation';
import { createGroup, searchGroup } from '../controllers/user.controller.group';
import { createGroupValidation } from '../middlewares/group.validation';
import { ROUTES } from '../constants/routes';

const userRouter: Router = express.Router();

userRouter.post('/signup', registerUserValidation, registerUser);

userRouter.get('/verify', verificationValidation, verifyUser);

userRouter.post('/verify', reverificationValidation, reverifyUser);

userRouter.post('/login', loginValidation, loginUser);

userRouter.post('/logout', tokenValidation, logoutUser);

userRouter.get('/', tokenValidation, getUser);

userRouter.put('/', tokenValidation, updateUserValidation, updateUser);

userRouter.post('/group', tokenValidation, createGroupValidation, createGroup);

userRouter.get('/group', searchValidation, searchGroup);

userRouter.get(
  `${ROUTES.POKER_BOARD}`,
  tokenValidation,
  getPokerboardAssociatedToUser
);

userRouter.get(
  '/reports/tickets',
  tokenValidation,
  pokerboardReportValidation,
  getReportOfUser
);

userRouter.get('/groups', tokenValidation, getGroupsAssociatedToUser);

userRouter.get('/tickets', tokenValidation, getTicketsAssociatedToUser);

export default userRouter;
