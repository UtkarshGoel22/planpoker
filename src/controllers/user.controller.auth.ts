import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

import { ResponseMessages } from '../constants/message';
import { createToken, findAndUpdateToken } from '../entity/token/repository';
import { comparePassword } from '../utils/auth';
import { makeResponse } from '../utils/common';

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

export const logoutUser = async (req: Request, res: Response) => {
  const currentDate = new Date();
  await findAndUpdateToken({ id: req.token.id }, { expiredAt: currentDate, isActive: false });
  return res.status(StatusCodes.OK).json(makeResponse(true, ResponseMessages.LOGOUT_SUCCESS));
};
