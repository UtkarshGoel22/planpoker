import { ErrorTags, ErrorTypes } from '../constants/errorType';
import { ErrorMessage } from '../constants/message';
import {
  loginSchema,
  registrationSchema,
  reverifySchema,
  verifySchema,
} from '../middlewares/user.validation.schema';
import { ErrorInterface } from '../models/ErrorInterface';

export const registerUserValidationHelper = (data: any) => {
  const value = registrationSchema.validate(data);

  if (value.error) {
    let errData: any = {};
    let message = value.error.details[0].message;
    let lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes(ErrorTypes.EMAIL)) {
      errData[ErrorTypes.EMAIL] = message;
    } else if (lowercaseMessage.includes(ErrorTags.FIRST_NAME)) {
      errData[ErrorTypes.FIRST_NAME] = message;
    } else if (lowercaseMessage.includes(ErrorTags.LAST_NAME)) {
      errData[ErrorTypes.LAST_NAME] = message;
    } else if (lowercaseMessage.includes(ErrorTypes.USER_NAME)) {
      errData[ErrorTypes.USER_NAME] = message;
    } else if (lowercaseMessage.includes(ErrorTypes.PASSWORD)) {
      errData[ErrorTypes.PASSWORD] = message;
    }

    let err: ErrorInterface = {
      message: value.error.details[0].message,
      errData,
    };

    throw err;
  } else if (data.password !== data.confirmPassword) {
    let errData: any = {};
    errData[ErrorTypes.PASSWORD] = ErrorMessage.PASSWORD_DOES_NOT_MATCH;
    let err: ErrorInterface = {
      message: ErrorMessage.PASSWORD_DOES_NOT_MATCH,
      errData,
    };
    throw err;
  }
};

export const reverificationValidationHelper = (data: any) => {
  const value = reverifySchema.validate(data);

  if (value.error) {
    let errData: any = {};
    errData[ErrorTypes.REVERIFY] = value.error.details[0].message;
    let err: ErrorInterface = {
      message: value.error.details[0].message,
      errData,
    };

    throw err;
  }
};

export const verificationValidationHelper = (data: any) => {
  const value = verifySchema.validate(data);

  if (value.error) {
    let errData: any = {};
    errData[ErrorTypes.VERIFY] = value.error.details[0];
    let err: ErrorInterface = {
      message: value.error.details[0].message,
      errData,
    };
    throw err;
  }
};

export const loginValidationHelper = (data: any) => {
  const value = loginSchema.validate(data);

  if (value.error) {
    let errData: any = {};
    let message = value.error.details[0].message;
    let messageToLowercase = message.toLowerCase();

    if (messageToLowercase.includes(ErrorTypes.EMAIL)) {
      errData[ErrorTypes.EMAIL] = message;
    } else {
      errData[ErrorTypes.PASSWORD] = message;
    }
    let err: ErrorInterface = { message, errData };
    throw err;
  }
};
