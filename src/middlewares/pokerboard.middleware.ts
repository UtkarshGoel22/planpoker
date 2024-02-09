import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages } from '../constants/message';
import { findPokerboard } from '../entity/pokerboard/repository';
import {
  validateAcceptPokerboardInviteData,
  validateCreatePokerboardData,
  validatePokerboardId,
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

export const managerPermission = async (req: Request, res: Response, next: NextFunction) => {
  const pokerboard = req.pokerboard;
  const user = req.user;
  if (pokerboard.manager !== user.id) {
    const errorData = { permission: ErrorMessages.PERMISSION_DENIED };
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(makeResponse(false, ErrorMessages.PERMISSION_DENIED, errorData));
  } else {
    next();
  }
};

export const pokerboardIdValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params = validatePokerboardId(req.params);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  const { id } = req.params;
  const pokerboard = await findPokerboard({ where: { id: id, isActive: true } });

  if (!pokerboard) {
    const errorData = { id: ErrorMessages.INVALID_POKERBOARD_ID };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.INVALID_POKERBOARD_ID, errorData));
  }

  req.pokerboard = pokerboard;
  next();
};
