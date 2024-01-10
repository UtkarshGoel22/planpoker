import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { EmailSubject } from '../constants/enums';
import { EmailMessages, ErrorMessages, ResponseMessages } from '../constants/message';
import { createToken, findAndUpdateToken } from '../entity/token/repository';
import { User } from '../entity/user/model';
import { createUser, findAndUpdateUser } from '../entity/user/repository';
import config from '../settings/config';
import { comparePassword, hashPassword } from '../utils/auth';
import { makeResponse } from '../utils/common';
import { sendMail } from '../utils/notification';

export const loginUser = async (req: Request, res: Response) => {
  const user = req.user;
  const { password, ...userData } = user;

  try {
    await comparePassword(req.body.password, password);
  } catch (error) {
    return res.status(error.statusCode).json(makeResponse(false, error.message, error.data));
  }

  const { token } = await createToken(user);
  res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.LOGIN_SUCCESS, { token, userData }));
};

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
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json(makeResponse(false, error.message, error.data));
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const currentDate = new Date();
  await findAndUpdateToken({ id: req.token.id }, { expiredAt: currentDate, isActive: false });
  return res.status(StatusCodes.OK).json(makeResponse(true, ResponseMessages.LOGOUT_SUCCESS));
};

export const reverifyUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const token = jwt.sign({ email: email, id: req.user.id }, config.JWT.SECRECT, {
    expiresIn: config.JWT.EXPIRY,
  });
  sendMail(EmailSubject.EMAIL_VERIFICATION, EmailMessages.VERIFY_EMAIL(token), email);
  return res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.VERIFICATION_LINK_SENT));
};

export const verifyUser = async (req: Request, res: Response) => {
  const token = req.query.token.toString();
  jwt.verify(token, config.JWT.SECRECT, async (error, decoded) => {
    if (error) {
      const errorData = { verify: ErrorMessages.USER_VERIFICATION_FAILED };
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(makeResponse(false, ErrorMessages.USER_VERIFICATION_FAILED, errorData));
    } else {
      const id: string = decoded['id'];
      const email: string = decoded['email'];
      const result = await findAndUpdateUser({ id: id, isVerified: false }, { isVerified: true });

      if (result.affected) {
        sendMail(EmailSubject.VERIFICATION_SUCCESS, EmailMessages.VERIFICATION_SUCCESS, email);
        return res
          .status(StatusCodes.OK)
          .json(makeResponse(true, ResponseMessages.ACCOUNT_VERIFICATION_SUCCESS));
      } else {
        const errorData = { alreadyVerified: ErrorMessages.ACCOUNT_ALREADY_VERIFIED };
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(makeResponse(false, ErrorMessages.ACCOUNT_ALREADY_VERIFIED, errorData));
      }
    }
  });
};
