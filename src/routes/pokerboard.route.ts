import express from 'express';

import {
  createUserPokerboard,
  importTicketsInPokerboard,
} from '../controllers/pokerboard.controller';
import { createPokerboardValidation } from '../middlewares/pokerboard.middleware';
import { tokenValidation } from '../middlewares/user.middleware';

const router: express.Router = express.Router();

router.use(tokenValidation);

router.post('/', createPokerboardValidation, createUserPokerboard);

router.post('/import-tickets', importTicketsInPokerboard);

export default router;
