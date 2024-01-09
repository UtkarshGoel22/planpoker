import { LogMessages } from '../constants/message';
import dataSource from '../settings/ormconfig';

export const connectToMySQLDB = async () => {
  try {
    await dataSource.AppDataSource.initialize();
    console.log(LogMessages.DATABASE_CONNECTION_SUCCESS);
  } catch (error) {
    console.log(LogMessages.DATABASE_CONNECTION_FAILURE, error);
    process.exit(1);
  }
};
