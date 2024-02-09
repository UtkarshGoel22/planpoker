import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validateTicketData } from '../helpers/ticket.helper';
import { makeResponse } from '../utils/common';

export const ticketValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = validateTicketData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }
  next();
};
