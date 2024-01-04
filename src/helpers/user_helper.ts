import { ErrorMessages } from "../constants/message";
import { registrationSchema } from "../schemas/user_schema";
import { validateData } from "../utils/common";

export const validateUserRegistrationData = (data: any) => {
  let errorData: { [key: string]: string } | null = validateData(registrationSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};
