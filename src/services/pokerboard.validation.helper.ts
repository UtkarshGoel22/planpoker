import { ErrorMessage } from '../constants/message';
import {
  PokerboardErrorTag,
  PokerboardErrorType,
} from '../constants/PokerboardErrorTypes';
import { Pokerboard } from '../entity/Pokerboard';
import { User } from '../entity/User';
import {
  createPokerBoardSchema,
  InviteSchema,
  PokerboardIdSchema,
  TicketSchema,
  UpdatePokerboardUserSchema,
  UpdateTicketsSchema,
} from '../middlewares/pokerboard.validation.schema';
import { generateCustomResponse } from '../middlewares/user.validation';
import { ErrorInterface } from '../models/ErrorInterface';
import ResponseMessage from '../models/ResponseMessage';

export const createPokerboardValidationHelper = (data: any) => {
  const value = createPokerBoardSchema.validate(data);
  if (value.error) {
    let errorData: any = {};
    let message = value.error.details[0].message;
    let messageToLower = message.toLowerCase();

    if (messageToLower.includes(PokerboardErrorTag.DECK_TYPE)) {
      errorData[PokerboardErrorType.DECK_TYPE] = message;
    } else if (messageToLower.includes(PokerboardErrorTag.MANAGER)) {
      errorData[PokerboardErrorType.MANAGER] = message;
    } else if (messageToLower.includes(PokerboardErrorTag.NAME)) {
      errorData[PokerboardErrorType.NAME] = message;
    } else if (messageToLower.includes(PokerboardErrorTag.USERS)) {
      errorData[PokerboardErrorType.USERS] = message;
    } else if (messageToLower.includes(PokerboardErrorTag.USER_ID)) {
      errorData[PokerboardErrorType.USER_ID] = message;
    } else if (messageToLower.includes(PokerboardErrorTag.USER_EMAIL)) {
      errorData[PokerboardErrorType.USER_EMAIL] = message;
    } else {
      errorData[PokerboardErrorType.GROUPS] = message;
    }
    let err = {
      message: value.error.details[0].message,
      errData: errorData,
    };
    throw err;
  }
};

export const pokerBoardInviteValidationHelper = (data: any) => {
  const value = InviteSchema.validate(data);

  if (value.error) {
    let errData: any = {};
    let message: string = value.error.details[0].message;
    errData[PokerboardErrorType.INVITE] = message;
    let err: ErrorInterface = {
      errData,
      message,
    };

    throw err;
  }
};

export const pokerboardIdValidationHelper = (data: any) => {
  const value = PokerboardIdSchema.validate(data);

  if (value.error) {
    let errData: any = {};
    let message = value.error.details[0].message;
    errData[PokerboardErrorType.POKER_BOARD_ID] =
      value.error.details[0].message;

    let err: ErrorInterface = { message, errData };
    throw err;
  }
};

export const ticketsValidationHelper = (tickets: any) => {
  const value = TicketSchema.validate(tickets);
  if (value.error) {
    let errData: any = {};
    let message = value.error.details[0].message;
    let error: ErrorInterface = { message, errData };
  }
};

export const isNotPokerboard = (
  pokerboard: Pokerboard
): null | ResponseMessage => {
  if (!pokerboard) {
    let errorData: any = {};
    errorData[PokerboardErrorType.POKER_BOARD_ID] =
      ErrorMessage.INVALID_POKERBOARD_ID;
    return generateCustomResponse(
      false,
      ErrorMessage.INVALID_POKERBOARD_ID,
      errorData
    );
  } else {
    return null;
  }
};

export const isManagerHavePermissionToPokerboard = (
  pokerboard: Pokerboard,
  manager: User
): { permission: boolean; err: ResponseMessage | undefined } => {
  if (pokerboard.manager != manager.id) {
    let errorData: any = {};
    errorData[PokerboardErrorType.TICKET_PERMISSION] =
      ErrorMessage.ADD_TICKET_PERMISSION_DENIED;
    return {
      permission: false,
      err: generateCustomResponse(
        false,
        ErrorMessage.ADD_TICKET_PERMISSION_DENIED,
        errorData
      ),
    };
  } else {
    return {
      permission: true,
      err: undefined,
    };
  }
};

export const updateTicketInPokerboardValidationHelper = (tickets: any) => {
  const value = UpdateTicketsSchema.validate(tickets);
  if (value.error) {
    let errData: any = {};
    errData[PokerboardErrorType.TICKETS] = value.error.details[0].message;
    let message: string = value.error.details[0].message;
    throw { errData, message } as ErrorInterface;
  }
};

export const pokerboardUserRoleValidation = (pokerboardUsers: any) => {
  const value = UpdatePokerboardUserSchema.validate(pokerboardUsers);

  if (value.error) {
    let errData: any = {};
    let message = value.error.details[0].message;
    let toLowerMessage = message.toLowerCase();

    if (toLowerMessage.includes(PokerboardErrorTag.USER_ID)) {
      errData[PokerboardErrorType.USER_ID] = message;
    } else if (toLowerMessage.includes(PokerboardErrorTag.ROLE)) {
      errData[PokerboardErrorType.USER_ROLE] = message;
    } else {
      errData[PokerboardErrorType.USERS] = message;
    }
    throw { message, errData } as ErrorInterface;
  }
};
