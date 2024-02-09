import { ErrorMessages } from '../constants/message';
import { CreateGroupSchema } from '../schemas/group.schema';
import { validateData } from '../utils/common';

export const validateCreateGroupData = (data: object) => {
  try {
    return validateData(CreateGroupSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
