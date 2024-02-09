import express from 'express';

import {
  acceptPokerboardInvite,
  addTicketsToPokerboard,
  createUserPokerboard,
  getPokerboard,
  importTicketsInPokerboard,
} from '../controllers/pokerboard.controller';
import {
  acceptInviteValidation,
  createPokerboardValidation,
  managerPermission,
  pokerboardIdValidation,
} from '../middlewares/pokerboard.middleware';
import { ticketValidation } from '../middlewares/ticket.middleware';
import { tokenValidation } from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.use(tokenValidation);

router.post('/', createPokerboardValidation, createUserPokerboard);

router.post('/import-tickets', importTicketsInPokerboard);

router.get('/verify', acceptInviteValidation, acceptPokerboardInvite);

router.get('/:id', pokerboardIdValidation, getPokerboard);

router.post(
  '/:id/tickets',
  pokerboardIdValidation,
  ticketValidation,
  managerPermission,
  addTicketsToPokerboard,
);

export default router;
