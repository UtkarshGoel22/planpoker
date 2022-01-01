import 'reflect-metadata';
import { Server } from 'http';
import cors from 'cors';
import socketIo from 'socket.io';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import express = require('express');
import ormconfig from './config/ormconfig';
import { Message } from './constants/message';
import userRouter from './routes/userRoute';
import { ROUTES } from './constants/routes';
import pokerBoardRoute from './routes/pokerBoardRoute';
import { socketValidation } from './middlewares/socket.io.validation';
import { game } from './services/game';
import usersRouter from './routes/usersRoutes';

dotenv.config();

const app = express();
const server = new Server(app);
export const io = new socketIo.Server(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

createConnection(ormconfig)
  .then(() => {
    console.log(Message.connectedToMysql);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(cors());

    app.use(ROUTES.USER, userRouter);
    app.use(ROUTES.USERS, usersRouter);
    app.use(ROUTES.POKER_BOARD, pokerBoardRoute);
    server.listen(process.env.PORT || 3000, () => {
      console.log(Message.serverRunningOnPort, process.env.PORT);
    });
  })
  .catch((error) => console.log(error));

io.use(async (socket, next) => socketValidation(socket, next));

game();
