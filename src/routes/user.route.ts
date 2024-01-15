import express from 'express';

import {
  createUserGroup,
  getGroupsAssociatedToUser,
  searchGroup,
} from '../controllers/group.controller';
import { getPokerboardsAssociatedToUser } from '../controllers/pokerboard.controller';
import { getTicketsAssociatedToUser, getUser, updateUser } from '../controllers/user.controller';
import { loginUser, logoutUser } from '../controllers/user.controller.auth';
import {
  registerUser,
  reverifyUser,
  verifyUser,
} from '../controllers/user.controller.registration';
import { createGroupValidation } from '../middlewares/group.middleware';
import { searchValidation } from '../middlewares/search.middleware';
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

router.post('/group', tokenValidation, createGroupValidation, createUserGroup);

router.get('/group', searchValidation, searchGroup);

router.get('/groups', tokenValidation, getGroupsAssociatedToUser);

router.get('/pokerboard', tokenValidation, getPokerboardsAssociatedToUser);

router.get('/pokerboard', tokenValidation, getTicketsAssociatedToUser);

export default router;
