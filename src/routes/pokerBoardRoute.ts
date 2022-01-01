import express, { Router } from 'express';
import { importTicket } from '../controllers/import.ticket.controller';
import {
  acceptJoiningRequest,
  createPokerBoard,
  getPokerboardDetail,
  addTicketsToPokerboard,
  updateTickets,
  updatePokerboardUsers,
} from '../controllers/pokerboard.controller';
import {
  createPokerBoardValidation,
  pokerboardIdValidation,
  inviteValidation,
  ticketValidation,
  updateTicketValidation,
  updatePokerboardUserValidation,
  managerPermission,
} from '../middlewares/pokerboard.validation';
import { tokenValidation } from '../middlewares/user.validation';

const pokerBoardRoute: Router = express.Router();

pokerBoardRoute.use(tokenValidation);

pokerBoardRoute.post('/', createPokerBoardValidation, createPokerBoard);

pokerBoardRoute.get('/import-tickets', importTicket);

pokerBoardRoute.get('/verify', inviteValidation, acceptJoiningRequest);

pokerBoardRoute.get('/:id', pokerboardIdValidation, getPokerboardDetail);

pokerBoardRoute.post(
  '/:id/tickets',
  pokerboardIdValidation,
  ticketValidation,
  managerPermission,
  addTicketsToPokerboard
);

pokerBoardRoute.put(
  '/:id/tickets',
  pokerboardIdValidation,
  updateTicketValidation,
  managerPermission,
  updateTickets
);

pokerBoardRoute.put(
  '/:id/players',
  pokerboardIdValidation,
  updatePokerboardUserValidation,
  managerPermission,
  updatePokerboardUsers
);

export default pokerBoardRoute;
