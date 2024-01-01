import "reflect-metadata";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { AppDataSource } from "./config/data-source";
import { LogMessage } from "./constants/api";

dotenv.config();

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log(LogMessage.CONNECTED_TO_MYSQL);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.listen(process.env.PORT || 3000, () => {
      console.log(LogMessage.LISTENING_ON_PORT, process.env.PORT);
    });
  })
  .catch((error) => console.log(error));
