import { ErrorMessages } from '../constants/message';
import { SearchSchema } from '../schemas/search.schema';
import { validateData } from '../utils/common';

export const validateSearchData = (data: object) => {
  try {
    return validateData(SearchSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
