import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { SuccessMessage } from '../constants/message';
import { Token } from '../entity/Token';
import { generateCustomResponse } from '../middlewares/user.validation';
import ResponseMessage from '../models/ResponseMessage';
import { checkPasswordAndGenerateToken } from '../repositories/user.repository';

export const loginUser = async (req: Request, res: Response) => {
  const responseMessage: ResponseMessage = {
    success: false,
    message: '',
    data: undefined,
  };

  try {
    let { token, userId } = await checkPasswordAndGenerateToken(
      req.body.email,
      req.body.password
    );
    responseMessage.success = true;
    responseMessage.message = SuccessMessage.LOGIN_SUCCESSFUL;
    responseMessage.data = { token, userId };
    return res.status(200).json(responseMessage);
  } catch (errorObject) {
    return res
      .status(400)
      .json(generateCustomResponse(false, errorObject.message, errorObject.errData));
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  let tokenId = req.get('authorization').slice(7);
  let date = new Date();
  await getRepository(Token).update(
    { id: tokenId },
    { expiredAt: date, isActive: false }
  );
  let message: ResponseMessage = {
    data: undefined,
    message: SuccessMessage.LOGOUT_SUCCESSFUL,
    success: true,
  };
  return res.status(200).json(message);
};
