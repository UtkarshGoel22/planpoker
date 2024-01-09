import { ErrorMessages } from '../constants/message';
import { registrationSchema } from '../schemas/user.schema';
import { validateData } from '../utils/common';

export const validateUserRegistrationData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(registrationSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};
