import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  validateAcceptPokerboardInviteData,
  validateCreatePokerboardData,
} from '../helpers/pokerboard.helper';
import { makeResponse } from '../utils/common';

export const acceptInviteValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = validateAcceptPokerboardInviteData(req.query);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }
  next();
};

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
