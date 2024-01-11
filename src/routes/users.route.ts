import express from 'express';

import { searchValidation } from '../middlewares/search.middleware';
import { searchUsers } from '../controllers/user.controller';

const router: express.Router = express.Router();

router.get('/', searchValidation, searchUsers);

export default router;
