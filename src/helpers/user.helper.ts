import { ErrorMessages } from '../constants/message';
import { registrationSchema, userVerificationSchema } from '../schemas/user.schema';
import { validateData } from '../utils/common';

export const validateUserRegistrationData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(registrationSchema, data);
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
