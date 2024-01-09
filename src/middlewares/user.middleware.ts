import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ValidationMessages } from '../constants/message';
import { User } from '../entity/user/model';
import { findUser } from '../entity/user/repository';
import {
  validateUserRegistrationData,
  validateUserReverificationData,
  validateUserVerificationData,
} from '../helpers/user.helper';
import { makeResponse } from '../utils/common';
import customGetRepository from '../utils/db';

export const registerUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserRegistrationData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  const user = await customGetRepository(User).findOne({
    where: { isActive: true, username: req.body.username },
  });

  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      makeResponse(false, ErrorMessages.INVALID_REQUEST_DATA, {
        username: ValidationMessages.USERNAME_ALREADY_EXISTS,
      }),
    );
  }

  next();
};

export const reverifyUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserReverificationData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  const user = await findUser({ email: req.body.email });

  if (user) {
    req.user = user;
    next();
  } else {
    const errorData = { email: ErrorMessages.NO_ACCOUNT_ASSOCIATED_WITH_THE_EMAIL };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.NO_ACCOUNT_ASSOCIATED_WITH_THE_EMAIL, errorData));
  }
};

export const verifyUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserVerificationData(req.query);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  next();
};
