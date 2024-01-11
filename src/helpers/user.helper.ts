import { ErrorMessages } from '../constants/message';
import {
  loginSchema,
  registrationSchema,
  userReverificationSchema,
  userUpdationSchema,
  userVerificationSchema,
} from '../schemas/user.schema';
import { validateData } from '../utils/common';

export const validateUserLoginData = (data: object) => {
  try {
    return validateData(loginSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INCORRECT_EMAIL_OR_PASSWORD, data: error.data };
  }
};

export const validateUserRegistrationData = (data: object) => {
  try {
    return validateData(registrationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateUserReverificationData = (data: object) => {
  try {
    return validateData(userReverificationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateUserUpdationData = (data: object) => {
  try {
    return validateData(userUpdationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateUserVerificationData = (data: object) => {
  try {
    return validateData(userVerificationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
