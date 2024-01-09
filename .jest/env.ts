import * as dotenv from 'dotenv';

dotenv.config();

process.env.EMAIL_HOST = 'emailhost';
process.env.EMAIL_SERVICE_TYPE = 'emailservice';
process.env.NODE_ENV = 'test';
process.env.SENDER_EMAIL = 'sender@example.com';
process.env.SENDER_EMAIL_PASSWORD = 'password';
