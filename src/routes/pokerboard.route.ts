import express from 'express';

import {
  acceptPokerboardInvite,
  createUserPokerboard,
  importTicketsInPokerboard,
} from '../controllers/pokerboard.controller';
import {
  acceptInviteValidation,
  createPokerboardValidation,
} from '../middlewares/pokerboard.middleware';
import { tokenValidation } from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.use(tokenValidation);

router.post('/', createPokerboardValidation, createUserPokerboard);

router.post('/import-tickets', importTicketsInPokerboard);

router.get('/verify', acceptInviteValidation, acceptPokerboardInvite);

export default router;
