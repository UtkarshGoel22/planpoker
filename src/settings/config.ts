import * as dotenv from "dotenv";

dotenv.config();

const config = {
  APP_URL: process.env.ORIGIN || "http://localhost:3000",
  ARGON2ID_SALT: process.env.ARGON2ID_SALT,
  PORT: process.env.PORT || 3000,
  EMAIL: {
    HOST: "smtp.gmail.com",
    SENDER_MAIL: process.env.SENDER_EMAIL,
    SENDER_PASSWORD: process.env.SENDER_EMAIL_PASSWORD,
    SERIVCE_TYPE: process.env.EMAIL_SERVICE_TYPE,
  },
  JWT: { EXPIRY: process.env.JWT_EXPIRY, SECRECT: process.env.JWT_SECRET },
};

export default config;
