import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ValidationMessages } from '../constants/message';
import { findUser } from '../entity/user/repository';
import {
  validateUserLoginData,
  validateUserRegistrationData,
  validateUserReverificationData,
  validateUserVerificationData,
} from '../helpers/user.helper';
import { makeResponse } from '../utils/common';
import { findToken } from '../entity/token/repository';

export const loginUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserLoginData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  const user = await findUser({ email: req.body.email, isActive: true });

  if (user && user.isVerified) {
    req.user = user;
    next();
  } else if (user && !user.isVerified) {
    const errorData = { email: ErrorMessages.ACCOUNT_NOT_VERIFIED };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.ACCOUNT_NOT_VERIFIED, errorData));
  } else {
    const errorData = { email: ErrorMessages.NO_ACCOUNT_ASSOCIATED_WITH_THE_EMAIL };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.NO_ACCOUNT_ASSOCIATED_WITH_THE_EMAIL, errorData));
  }
};

export const registerUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserRegistrationData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  const user = await findUser({ isActive: true, username: req.body.username });

  if (user) {
    const errorData = { username: ValidationMessages.USERNAME_ALREADY_EXISTS };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.INVALID_REQUEST_DATA, errorData));
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

export const tokenValidation = async (req: Request, res: Response, next: NextFunction) => {
  let tokenId = req.headers.authorization;

  if (!tokenId) {
    const errorData = { auth: ErrorMessages.UNAUTHORIZED_ACCESS };
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(makeResponse(false, ErrorMessages.UNAUTHORIZED_ACCESS, errorData));
  }

  tokenId = tokenId.slice(7).trim();

  const token = await findToken({ id: tokenId, isActive: true });
  const currentDate = new Date();

  if (!token || token.expiryDate <= currentDate) {
    const errorData = { auth: ErrorMessages.UNAUTHORIZED_ACCESS };
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(makeResponse(false, ErrorMessages.UNAUTHORIZED_ACCESS, errorData));
  }

  req.token = token;
  next();
};

export const verifyUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserVerificationData(req.query);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  next();
};
