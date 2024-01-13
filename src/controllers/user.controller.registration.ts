import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { EmailSubject } from '../constants/enums';
import { EmailMessages, ErrorMessages, ResponseMessages } from '../constants/message';
import { User } from '../entity/user/model';
import { createUser, findAndUpdateUser } from '../entity/user/repository';
import { updatePendingInvitesToPokerboards } from '../helpers/user.helper';
import config from '../settings/config';
import { hashPassword } from '../utils/auth';
import { makeResponse } from '../utils/common';
import { sendMail } from '../utils/notification';

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
      const email: string = decoded['email'];
      const result = await findAndUpdateUser({ email, isVerified: false }, { isVerified: true });

      if (result.affected) {
        sendMail(EmailSubject.VERIFICATION_SUCCESS, EmailMessages.VERIFICATION_SUCCESS, email);
        updatePendingInvitesToPokerboards(email);
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
