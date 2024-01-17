import 'reflect-metadata';
import socketIo from 'socket.io';

import server from './app';
import { LogMessages } from './constants/message';
import { connectToMySQLDB } from './database/mysql';
import { socketValidation } from './middlewares/socket.io.midleware';
import { game } from './services/game';
import config from './settings/config';

export const io = new socketIo.Server(server, { cors: { origin: process.env.ORIGIN } });

const startServer = async () => {
  await connectToMySQLDB();

  server.listen(config.PORT, () => {
    console.log(LogMessages.LISTENING_ON_PORT, config.PORT);
  });
};

startServer();

io.use(async (socket, next) => socketValidation(socket, next));

game();
