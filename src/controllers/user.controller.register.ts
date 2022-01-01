import { Request, Response } from 'express';
import { genSalt, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import ResponseMessage from '../models/ResponseMessage';
import {
  checkIfInviteExistsAndSendMail,
  findUserById,
  registerUserDB,
  sendMailAfterSignup,
  updateUserDetail,
} from '../repositories/user.repository';
import {
  ErrorMessage,
  JWT_SECRET,
  Message,
  SuccessMessage,
} from '../constants/message';
import { sendMail } from '../services/sendMail';
import { User } from '../entity/User';
import { ErrorTypes } from '../constants/errorType';
import { IRequest } from '../models/RequestInterface';
import { ConstantValues } from '../constants/constantValues';

export const registerUser = async (req: Request, res: Response) => {
  const responseMessage: ResponseMessage = {
    success: false,
    message: '',
    data: undefined,
  };

  let body = req.body;
  const salt = await genSalt(10);

  if (salt) {
    body.password = await hash(body.password, salt);
  }

  try {
    let user = await registerUserDB({
      firstName: body.firstName,
      lastName: body.lastName ? body.lastName : '',
      email: body.email,
      userName: body.userName,
      password: body.password,
    });
    sendMailAfterSignup(user.email, user.id);
    responseMessage.success = true;
    responseMessage.message = SuccessMessage.CREATED;
    return res.status(201).json(responseMessage);
  } catch (errorObject) {
    responseMessage.message = errorObject.message;
    responseMessage.data = errorObject.errData;
    responseMessage.success = false;
    return res.status(400).json(responseMessage);
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  let token: string = req.query.token.toString();
  jwt.verify(token, JWT_SECRET, async (err, data) => {
    if (err) {
      let errData: any = {};
      errData[ErrorTypes.VERIFY] = ErrorMessage.VERIFICATION_FAILED;
      let responseMessage: ResponseMessage = {
        success: false,
        message: ErrorMessage.VERIFICATION_FAILED,
        data: errData,
      };

      return res.status(401).json(responseMessage);
    } else {
      let id: string = data.id;
      let email: string = data.email;
      let result = await updateUserDetail(
        { id: id, isVerified: false },
        { isVerified: true }
      );

      if (result.affected != 0) {
        let responseMessage: ResponseMessage = {
          success: true,
          message: SuccessMessage.VERIFY_SUCCESS,
          data: undefined,
        };

        sendMail({
          to: email,
          subject: SuccessMessage.VERIFY_SUCCESS_SUBJECT,
          message: SuccessMessage.VERIFY_SUCCESS,
        });

        findUserById(id).then((user: User) => {
          checkIfInviteExistsAndSendMail(user);
        });
        return res.status(200).json(responseMessage);
      } else {
        let errData: any = {};
        errData[ErrorTypes.ALREADY_VERIFIED] =
          ErrorMessage.ACCOUNT_ALREADY_VERIFIED;
        let responseMessage: ResponseMessage = {
          success: false,
          message: ErrorMessage.ACCOUNT_ALREADY_VERIFIED,
          data: errData,
        };
        return res.status(400).json(responseMessage);
      }
    }
  });
};

export const reverifyUser = async (req: IRequest, res: Response) => {
  let email: string = req.body.email;
  let user: User = req.user;
  let token = jwt.sign({ email: email, id: user.id }, JWT_SECRET, {
    expiresIn: ConstantValues.expiryTimeForVerificationJWT,
  });
  sendMail({
    to: email,
    subject: SuccessMessage.VERIFY_EMAIL_SUBJECT,
    message: Message.verifyAgain(token),
  });

  let responseMessage: ResponseMessage = {
    data: undefined,
    success: true,
    message: SuccessMessage.REVERIFICATION_SUCCESS,
  };

  return res.status(200).json(responseMessage);
};
