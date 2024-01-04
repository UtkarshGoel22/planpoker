import config from "../settings/config";
import { Routes } from "./enums";

export const EmailMessages = {
  REGISTRATION_SUCCESS: (token: string) => `<body>
  <h1> Welcome to Plan Poker!! </h1> 
  <p> Thank you for registering on our application. Visit our website to start planning for your next project. </p>
  <span> Please verify your account by clicking on the following link: ${config.APP_URL}${Routes.USER}/verify?token=${token} </span>
  </body>`,
};

export const ErrorMessages = {
  ACCOUNT_ALREADY_EXISTS: "Account already exists",
  INVALID_REQUEST_DATA: "Invalid request data",
  SOMETHING_WENT_WRONG: "Oops something went wrong, please try again",
};

export const LogMessages = {
  DATABASE_CONNECTION_FAILURE: "TypeORM encountered error while connecting to database:",
  DATABASE_CONNECTION_SUCCESS: "Successfully connected to database",
  LISTENING_ON_PORT: "Listening on port",
  PASSWORD_HASHING_FAILURE: "Error while hashing password:",
  SEND_EMAIL_SUCCESS: "Email sent successfully:",
  SEND_EMAIL_FAILURE: "Error while sending email:",
};

export const ResponseMessages = {
  REGISTRATION_SUCCESS: "Account created successfully",
};

export const ValidationMessages = {
  EMAIL_REQUIRED: "Email is a required field",
  FIRST_NAME_MAX_LENGTH: "First name length can be upto 50",
  FIRST_NAME_REQUIRED: "First name is a required field",
  INVALID_EMAIL: "Please enter a valid email address",
  LAST_NAME_MAX_LENGTH: "Last name length can be upto 50",
  PASSWORD_DOES_NOT_MATCH: "Password does not match",
  PASSWORD_MAX_LENGTH: "Password length can be upto 30",
  PASSWORD_MIN_LENGTH: "Password length must be atleast 6",
  PASSWORD_REQUIRED: "Password is a required field",
  USERNAME_ALREADY_EXISTS: "Username already exists",
  USERNAME_MAX_LENGTH: "Username length can be upto 30",
  USERNAME_MIN_LENGTH: "Username length must be atleast 4",
  USERNAME_MUST_BE_ALPHANUMERIC: "Username must be alphanumeric",
  USERNAME_REQUIRED: "Username is a required field",
};
