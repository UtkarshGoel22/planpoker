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
  const errorData: { [key: string]: string } | null = validateData(loginSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INCORRECT_EMAIL_OR_PASSWORD, data: errorData };
  }
};

export const validateUserRegistrationData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(registrationSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};

export const validateUserReverificationData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(userReverificationSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};

export const validateUserUpdationData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(userUpdationSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};

export const validateUserVerificationData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(userVerificationSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};
