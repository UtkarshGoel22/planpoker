import cors from 'cors';
import express from 'express';

import { Routes } from './constants/enums';
import userRouter from './routes/user.route';
import config from './settings/config';

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
  }
}

export default new App().app;
