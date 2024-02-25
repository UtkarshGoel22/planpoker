import * as dotenv from 'dotenv';

import { Environments } from '../constants/common';

dotenv.config();

const config = {
  APP_URL: process.env.ORIGIN || 'http://localhost:5173',
  ARGON2ID_SALT: process.env.ARGON2ID_SALT,
  AUTH_TOKEN: { EXPIRY: 7 },
  PORT: process.env.PORT || 3000,
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    SENDER_MAIL: process.env.SENDER_EMAIL,
    SENDER_PASSWORD: process.env.SENDER_EMAIL_PASSWORD,
    SERIVCE_TYPE: process.env.EMAIL_SERVICE_TYPE,
  },
  JIRA_AUTH: process.env.JIRA_AUTH,
  JWT: { EXPIRY: process.env.JWT_EXPIRY, SECRECT: process.env.JWT_SECRET },
  NODE_ENV: process.env.NODE_ENV || Environments.DEV,
  SEARCH: { LIMIT: 10 },
};

export default config;
