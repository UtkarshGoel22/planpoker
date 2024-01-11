import { ErrorMessages } from '../constants/message';
import { createGroupSchema } from '../schemas/group.schema';
import { validateData } from '../utils/common';

export const validateCreateGroupData = (data: object) => {
  try {
    return validateData(createGroupSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
