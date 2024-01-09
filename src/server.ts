import 'reflect-metadata';

import app from './app';
import { LogMessages } from './constants/message';
import { connectToMySQLDB } from './database/mysql';
import config from './settings/config';

const startServer = async () => {
  await connectToMySQLDB();

  app.listen(config.PORT, () => {
    console.log(LogMessages.LISTENING_ON_PORT, config.PORT);
  });
};

startServer();
