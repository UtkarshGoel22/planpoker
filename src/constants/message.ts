import { ROUTES } from './routes';
import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'shshshsh';

export const APP_URL = process.env.ORIGIN || 'http://localhost:3000';
export const TableName = {
  userPokerboard: 'user_pokerboard',
  userTicket: 'user_ticket',
};
export const TEXT = {
  undefined: 'undefined',
};

export const Message = {
  connectedToMysql: 'Connected to mysql',
  serverRunningOnPort: 'Sever running on port',
  welcomeMessage: (token: string) => `<body>
  <h1> Welcome to Poker Planner!! </h1> 
  <p> Thankyou for registering to our app. Visit our website to start planning for your next project. </p>
  <span> Verify your account by clicking to this link: ${APP_URL}${ROUTES.USER}/verify?token=${token}
  </body>`,
  verifyAgain: (token: string) => `<body>
  <h1> Email Verification </h1> 
  <p> Verify your account by clicking to this link: ${APP_URL}${ROUTES.USER}/verify?token=${token} </p>
  </body>`,
  addedToGroup: (
    groupName: string,
    firstName: string,
    lastName: string,
    email: string
  ) => `<body>
  <h1> You were added to a group ${groupName} </h1> 
  <p> ${firstName} ${lastName} whose email is ${email} added you to group </p>
  </body>`,
  addedToPokerBoard: (pokerBoardName: string, pokerBoardId: string) => `
  <body>
  <h1> Invitation to ${pokerBoardName} poker-board </h1> 
  <p> You are invited to join the ${pokerBoardName} poker-board game  </p>
  <span> Invitation Link ${APP_URL}/poker-board/invite?pokerBoardId=${pokerBoardId}
  </body>`,
  inviteForSignup: (pokerBoardName: string) => `
  <h1> Invitation to ${pokerBoardName} poker-board </h1> 
  <p> You are invited to join the ${pokerBoardName} poker-board game  </p>
  <span> Please signup and accept the invitation to continue:  ${APP_URL}/signup
  </body>`,
};

export const enum SuccessMessage {
  CREATED = 'Account created successfully',
  EMAIL_SUBJECT = 'Registered successfully!!',
  VERIFY_EMAIL_SUBJECT = 'Email verification',
  VERIFY_SUCCESS = 'Your Account has been successfully verified',
  REVERIFICATION_SUCCESS = 'Verification Linked sent successfully',
  VERIFY_SUCCESS_SUBJECT = 'Account Verified Successfully',
  LOGIN_SUCCESSFUL = 'Login successful',
  LOGOUT_SUCCESSFUL = 'Logged out successfully',
  GET_USER_SUCCESSFUL = 'Fetched user details successfully',
  UPDATE_USER_SUCCESSFUL = 'Updated user details successfully',
  ADD_TO_GROUP_SUBJECT = 'Added to new group',
  SAVE_GROUP_SUCCESSFUL = 'Group saved successfully',
  GROUP_SEARCH_SUCCESSFUL = 'Search successful',
  POKER_BOARD_CREATED_SUCCESSFULLY = 'Poker-board created successfully',
  IMPORTED_TICKETS_SUCCESSFULLY = 'Successfully imported tickets',
  ACCEPT_BOARD_INVITATION = 'You were added to poker-board successfully',
  TICKET_SAVED = 'Tickets saved successfully',
  TICKETS_UPDATE = 'Tickets update successfully',
  UPDATED = 'Updated successfully',
  PARTIAL_SAVED = 'Some ticket already exist. Rest of the tickets were saved successfully',
  FETCHED_DETAILS_SUCCESSFULLY = 'Details fetched successfully',
}

export const enum ErrorMessage {
  DUPLICATE_ENTRY = 'Account already exists',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  VERIFICATION_FAILED = 'Verification failed',
  JSON_PARSE_ERROR = 'Please provide json object in request body',
  UNABLE_TO_SEND_MESSAGE = 'Unable to send message, please try again after sometime',
  EMAIL_NOT_FOUND = 'No account associated with this email',
  ACCOUNT_NOT_VERIFIED = 'Your account is not verified. Kindly verify your account',
  INVALID_PASSWORD = 'You have entered a wrong password',
  ACCOUNT_ALREADY_VERIFIED = 'Account is already verified',
  UPDATE_USER_FAILED = 'Update user details failed',
  GET_USER_FAILED = 'Get user details failed',
  SAVE_GROUP_FAILED = 'Saving group failed',
  SOMETHING_WENT_WRONG_WHILE_CREATING_POKER_BOARD = 'Something went wrong while creating the poker-board. Please try again',
  YOU_ARE_NOT_INVITED_TO_THIS_GAME = "We can't find any invitation for you regarding this game",
  YOU_HAVE_ALREADY_ACCEPTED_YOUR_INVITATION = 'You already have accepted the invitation',
  INVALID_POKERBOARD_ID = `Pokerboard that you are trying to view does't exist`,
  AT_LEAST_GROUP_OR_USER = 'You should add at least one user or group to create a poker board',
  NOT_FOUND = 'Not Found',
  ADD_TICKET_PERMISSION_DENIED = `You don't have permission to add ticket`,
  UPDATE_TICKET_PERMISSION_DENIED = `You don't have permission to update ticket`,
  PERMISSION_DENIED = `You don't have Permission`,
  ALL_TICKETS_ALREADY_EXIST = 'All tickets already exist',
  INVALID_USER_ID = `User you are looking for is not present`,
  USERNAME_ALREADY_EXIST = 'Username already exists',
  INCORRECT_INPUT = 'Incorrect input',
  NO_TICKETS_FOUND = 'No tickets found',
  PASSWORD_DOES_NOT_MATCH = 'Password does not match',
  USERS_NOT_FOUND = 'Users you want to add do not exist',
  YOU_HAVE_ALREADY_REJECTED_THE_INVITE = 'You have already rejected the invite',
  NO_ESTIMATE_FOUND_FOR_THIS_TICKET = `We can't find any estimate details for this account`,
  TICKET_DOES_NOT_EXIST_FOR_THIS_POKERBOARD = `We can't found any ticket with this given ticket id`,
}

export const enum ValidationMessages {
  INVALID_EMAIL = 'Please enter a valid email address',
  MIN_CHAR = 'should be at least 4 characters long',
  REQUIRED = 'is a required field',
  PASSWORD_INVALID = 'Password length should be at least 6',
  USERNAME_INVALID = 'should be alphanumeric',
  MAX_CHAR = ' length should be upto 30',
  MAX_CHAR_CUSTOM = 'length must be less than 50',
  USERNAME_ALREADY_EXIST = 'Username already exist',
  UNAUTHORIZED_USER = 'You are not authorized',
  MIN_MEMBERS = 'Minimum 2 members required',
  MIN_USERS = 'Minimum 2 users required',
  INVALID_DECK_TYPE = 'DeckType must be one of [SERIAL, EVEN, ODD, FIBONACCI',
  INVALID_TICKET_TYPE = `Ticket type must be on of [Bug, Story, Task]`,
  INVALID_BASE_NUMBER = 'should be a number',
  INVALID_BASE_STRING = 'should be a string',
  MIN_TICKET_1 = 'At least one ticket should be there',
  ALPHANUMERIC = 'should be alphanumeric',
  POKER_BOARD_MAX = 'should be upto 30',
  POKER_BOARD_USER_MIN = ' should be at least 2',
  INVALID_MANAGER = 'Invalid Manager id',
  INVALID_ROLE_TYPE = `Role must be one of [MANAGER, PLAYER, SPECTATOR]`,
  GROUP_NAME_INVALID = 'Groupname should be alphanumeric',
  GROUP_NAME_ALREADY_EXIST = 'Groupname already exists',
}

export const enum ResponseConstants {
  ALLOW_ORIGIN = 'Access-Control-Allow-Origin',
  ALLOW_METHOD = 'Access-Control-Allow-Methods',
  ALLOW_HEADER = 'Access-Control-Allow-Headers',
  METHODS = 'GET,POST,PUT,DELETE,OPTIONS',
}
