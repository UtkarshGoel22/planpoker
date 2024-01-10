import { ErrorMessages } from '../constants/message';
import { createGroupSchema } from '../schemas/group.schema';
import { validateData } from '../utils/common';

export const validateCreateGroupData = (data: object) => {
  const errorData: { [key: string]: string } | null = validateData(createGroupSchema, data);
  if (errorData) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: errorData };
  }
};
