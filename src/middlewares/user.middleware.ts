import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ValidationMessages } from '../constants/message';
import { User } from '../entity/user/model';
import { validateUserRegistrationData } from '../helpers/user.helper';
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
