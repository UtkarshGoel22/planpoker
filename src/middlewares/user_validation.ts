import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validateUserRegistrationData } from '../helpers/user_helper';
import { makeResponse } from '../utils/common';
import { ErrorMessages, ValidationMessages } from '../constants/message';
import { AppDataSource } from '../database/mysql';
import { User } from '../entity/user/model';

export const registerUserValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validateUserRegistrationData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  const user = await AppDataSource.getRepository(User).findOne({
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
