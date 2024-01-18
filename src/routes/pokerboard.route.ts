import express from 'express';

import {
  acceptPokerboardInvite,
  createUserPokerboard,
  getPokerboard,
  importTicketsInPokerboard,
} from '../controllers/pokerboard.controller';
import {
  acceptInviteValidation,
  createPokerboardValidation,
  pokerboardIdValidation,
} from '../middlewares/pokerboard.middleware';
import { tokenValidation } from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.use(tokenValidation);

router.post('/', createPokerboardValidation, createUserPokerboard);

router.post('/import-tickets', importTicketsInPokerboard);

router.get('/verify', acceptInviteValidation, acceptPokerboardInvite);

router.get('/:id', pokerboardIdValidation, getPokerboard);

export default router;
