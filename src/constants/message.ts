import config from '../settings/config';
import { Routes } from './enums';

export const EmailMessages = {
  ADDED_TO_GROUP: (
    groupName: string,
    adminFirstName: string,
    adminLastName: string,
    adminEmail: string,
  ) => `<body>
  <h1> You are added to a new group ${groupName} </h1>
  <p> ${adminFirstName} ${adminLastName} having email as ${adminEmail} added you to the group. </p>
  </body>`,
  REGISTRATION_SUCCESS: (token: string) => `<body>
  <h1> Welcome to Plan Poker!! </h1> 
  <p> Thank you for registering on our application. Visit our website to start planning for your next project. </p>
  <span> Please verify your account by clicking on the following link: ${config.APP_URL}${Routes.USER}/verify?token=${token} </span>
  </body>`,
  VERIFY_EMAIL: (token: string) => `<body>
  <h1> Email address verification </h1>
  <span> Please verify your account by clicking on the following link: ${config.APP_URL}${Routes.USER}/verify?token=${token} </span>
  </body>`,
  VERIFICATION_SUCCESS: `<body>
  <h1> Account Verified Successfully!! </h1>
  <p> Your account has been verified successfully. Login to your account and start planning poker. </p>
  </body>`,
};

export const ErrorMessages = {
  ACCOUNT_ALREADY_EXISTS: 'Account already exists',
  ACCOUNT_ALREADY_VERIFIED: 'Account already verified',
  ACCOUNT_NOT_VERIFIED: 'Your account in not verified. Kindly verify your account',
  GROUP_NAME_ALREADY_EXISTS: 'Group with the given name already exists',
  INCORRECT_EMAIL_OR_PASSWORD: 'Incorrect email or password. Please try again',
  INVALID_REQUEST_DATA: 'Invalid request data',
  NO_ACCOUNT_ASSOCIATED_WITH_THE_EMAIL: 'No account associated with the given email',
  SOMETHING_WENT_WRONG: 'Oops something went wrong, please try again',
  UNAUTHORIZED_ACCESS: 'You do not have access to perform the action',
  USER_VERIFICATION_FAILED: 'User verfication failed',
  USERS_NOT_FOUND: 'Users you are trying to add do not exist',
};

export const LogMessages = {
  DATABASE_CONNECTION_FAILURE: 'TypeORM encountered error while connecting to database:',
  DATABASE_CONNECTION_SUCCESS: 'Successfully connected to database',
  LISTENING_ON_PORT: 'Listening on port',
  PASSWORD_HASHING_FAILURE: 'Error while hashing password:',
  PASSWORD_VERIFICATION_FAILURE: 'Error while verifying password',
  SEND_EMAIL_SUCCESS: 'Email sent successfully:',
  SEND_EMAIL_FAILURE: 'Error while sending email:',
};

export const ResponseMessages = {
  ACCOUNT_VERIFICATION_SUCCESS: 'Account verified successfully',
  GET_GROUPS_ASSOCIATED_TO_USER_SUCCESS: 'Fetched groups associated to the user successfully',
  GET_USER_SUCCESS: 'Fetched user details successfully',
  GROUP_CREATION_SUCCESS: 'Group created successfully',
  GROUP_SEARCH_SUCCESS: 'Groups searched successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTRATION_SUCCESS: 'Account created successfully',
  UPDATE_USER_SUCCESS: 'User updated successfully',
  USER_SEARCH_SUCCESS: 'Fetched users successfully',
  VERIFICATION_LINK_SENT: 'Verification link sent successfully to your email address',
};

export const ValidationMessages = {
  ADMIN_REQUIRED: 'Admin is a required field',
  EMAIL_REQUIRED: 'Email is a required field',
  FIRST_NAME_MAX_LENGTH: 'First name length can be upto 50',
  FIRST_NAME_REQUIRED: 'First name is a required field',
  GROUP_NAME_REQUIRED: 'Group name is a required field',
  GROUP_NAME_MIN_LENGTH: 'Group name length must be at least 4',
  GROUP_NAME_MAX_LENGTH: 'Group name length can be upto 30',
  GROUP_NAME_MUST_BE_ALPHANUMERIC: 'Group name must be alphanumeric',
  INVALID_EMAIL: 'Please enter a valid email address',
  LAST_NAME_MAX_LENGTH: 'Last name length can be upto 50',
  LIMIT_SHOULD_BE_A_NATURAL_NUMBER: 'Limit must be atleast 1',
  MINIMUM_MEMBERS: 'Minimum 2 members required',
  PASSWORD_DOES_NOT_MATCH: 'Password does not match',
  PASSWORD_MAX_LENGTH: 'Password length can be upto 30',
  PASSWORD_MIN_LENGTH: 'Password length must be atleast 6',
  PASSWORD_REQUIRED: 'Password is a required field',
  TOKEN_REQUIRED: 'Token is a required field',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  USERNAME_MAX_LENGTH: 'Username length can be upto 30',
  USERNAME_MIN_LENGTH: 'Username length must be atleast 4',
  USERNAME_MUST_BE_ALPHANUMERIC: 'Username must be alphanumeric',
  USERNAME_REQUIRED: 'Username is a required field',
};
