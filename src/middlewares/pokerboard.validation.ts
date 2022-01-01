import { NextFunction, Request, Response } from 'express';
import { ErrorMessage } from '../constants/message';
import { PokerboardErrorType } from '../constants/PokerboardErrorTypes';
import { IRequest } from '../models/RequestInterface';
import { getPokerboardById } from '../repositories/pokerBoard.repository';
import {
  createPokerboardValidationHelper,
  isManagerHavePermissionToPokerboard,
  pokerboardIdValidationHelper,
  pokerBoardInviteValidationHelper,
  pokerboardUserRoleValidation,
  ticketsValidationHelper,
  updateTicketInPokerboardValidationHelper,
} from '../services/pokerboard.validation.helper';

import { generateCustomResponse } from './user.validation';

export const createPokerBoardValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createPokerboardValidationHelper(req.body);
  } catch (errorObject) {
    return res
      .status(400)
      .json(
        generateCustomResponse(false, errorObject.message, errorObject.errData)
      );
  }
  next();
};

export const inviteValidation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    pokerBoardInviteValidationHelper(req.query);
  } catch (errorObject) {
    return res
      .status(400)
      .json(
        generateCustomResponse(false, errorObject.message, errorObject.errData)
      );
  }

  let user = req.user;
  req.query.userId = user.id;
  next();
};

export const pokerboardIdValidation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    pokerboardIdValidationHelper(req.params);
  } catch (errorObject) {
    return res
      .status(400)
      .json(
        generateCustomResponse(false, errorObject.message, errorObject.errData)
      );
  }

  const { id } = req.params;
  const pokerboard = await getPokerboardById(id);

  if (!pokerboard) {
    let errorData: any = {};
    errorData[PokerboardErrorType.POKER_BOARD_ID] =
      ErrorMessage.INVALID_POKERBOARD_ID;
    return res
      .status(400)
      .json(
        generateCustomResponse(
          false,
          ErrorMessage.INVALID_POKERBOARD_ID,
          errorData
        )
      );
  }

  req.pokerboard = pokerboard;
  next();
};

export const ticketValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    ticketsValidationHelper(req.body);
  } catch (error) {
    return res
      .status(400)
      .json(generateCustomResponse(false, error.message, error.errData));
  }

  next();
};

export const updateTicketValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateTicketInPokerboardValidationHelper(req.body);
  } catch (err) {
    return res
      .status(400)
      .json(generateCustomResponse(false, err.message, err.errData));
  }

  next();
};

export const updatePokerboardUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    pokerboardUserRoleValidation(req.body);
  } catch (error) {
    return res
      .status(400)
      .json(generateCustomResponse(false, error.message, error.errData));
  }

  next();
};

export const managerPermission = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let managerPermission = isManagerHavePermissionToPokerboard(
    req.pokerboard,
    req.user
  );

  if (managerPermission.err) {
    return res.status(403).json(managerPermission.err);
  }
  next();
};
