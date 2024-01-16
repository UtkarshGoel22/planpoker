import cors from 'cors';
import express, { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Routes } from './constants/enums';
import { ErrorMessages } from './constants/message';
import pokerboardRouter from './routes/pokerboard.route';
import userRouter from './routes/user.route';
import usersRouter from './routes/users.route';
import config from './settings/config';
import { makeResponse } from './utils/common';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.set('port', config.PORT);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(Routes.USER, userRouter);
    this.app.use(Routes.USERS, usersRouter);
    this.app.use(Routes.POKERBOARD, pokerboardRouter);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err, req: Request, res: Response, next: NextFunction) => {
      const errorData = { somethingWentWrong: ErrorMessages.SOMETHING_WENT_WRONG };
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(makeResponse(false, ErrorMessages.SOMETHING_WENT_WRONG, errorData));
    });
  }
}

export default new App().app;
