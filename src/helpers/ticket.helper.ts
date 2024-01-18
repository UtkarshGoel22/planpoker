import { ErrorMessages } from '../constants/message';
import { TicketsSchema } from '../schemas/ticket.schema';
import { validateData } from '../utils/common';

export const validateTicketData = (data: object) => {
  try {
    return validateData(TicketsSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
