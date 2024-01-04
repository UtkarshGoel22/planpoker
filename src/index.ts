import "reflect-metadata";
import cors from "cors";
import express from "express";

import { LogMessages } from "./constants/message";
import { connectToMySQLDB } from "./database/mysql";
import userRouter from "./routes/user_routes";
import config from "./settings/config";
import { Routes } from "./constants/enums";

const app = express();

const startServer = async () => {
  await connectToMySQLDB();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(Routes.USER, userRouter);
  app.listen(config.PORT, () => {
    console.log(LogMessages.LISTENING_ON_PORT, process.env.PORT);
  });
};

startServer();
