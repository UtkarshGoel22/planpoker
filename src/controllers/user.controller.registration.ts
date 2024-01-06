import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { hashPassword } from '../utils/auth';
import { User } from '../entity/user/model';
import { createUser } from '../entity/user/repository';
import { sendMail } from '../utils/notification';
import { EmailSubject } from '../constants/enums';
import { EmailMessages, ResponseMessages } from '../constants/message';
import config from '../settings/config';
import { makeResponse } from '../utils/common';
import { StatusCodes } from 'http-status-codes';

export const registerUser = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    body.password = await hashPassword(body.password);
    const user: User = await createUser(body);
    const token = jwt.sign({ email: user.email, id: user.id }, config.JWT.SECRECT, {
      expiresIn: config.JWT.EXPIRY,
    });
    sendMail(
      EmailSubject.REGISTRATION_SUCESS,
      EmailMessages.REGISTRATION_SUCCESS(token),
      user.email,
    );
    return res
      .status(StatusCodes.CREATED)
      .json(makeResponse(true, ResponseMessages.REGISTRATION_SUCCESS));
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(makeResponse(false, error.message, error.data));
  }
};
