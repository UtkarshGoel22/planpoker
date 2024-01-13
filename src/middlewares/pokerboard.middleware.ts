import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validateCreatePokerboardData } from '../helpers/pokerboard.helper';
import { makeResponse } from '../utils/common';

export const createPokerboardValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = validateCreatePokerboardData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }
  next();
};
