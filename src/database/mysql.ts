import { DataSource } from "typeorm";
import { LogMessages } from "../constants/message";

const ormConfig = require("../settings/ormconfig");

export const AppDataSource = new DataSource(ormConfig);

export const connectToMySQLDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log(LogMessages.DATABASE_CONNECTION_SUCCESS);
  } catch (error) {
    console.log(LogMessages.DATABASE_CONNECTION_FAILURE, error);
    process.exit(1);
  }
};
