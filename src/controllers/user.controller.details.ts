import { Response } from 'express';
import ResponseMessage from '../models/ResponseMessage';
import {
  ErrorMessage,
  SuccessMessage,
  ValidationMessages,
} from '../constants/message';
import { ErrorTypes } from '../constants/errorType';
import { IRequest } from '../models/RequestInterface';
import { getRepository, Not } from 'typeorm';
import { User } from '../entity/User';

export const getUser = async (req: IRequest, res: Response) => {
  let responseMessage: ResponseMessage;
  let errData: any = {};

  let savedUser = req.user;

  if (!savedUser.isVerified) {
    errData[ErrorTypes.VERIFY] = ErrorMessage.ACCOUNT_NOT_VERIFIED;
    responseMessage = {
      success: false,
      message: ErrorMessage.ACCOUNT_NOT_VERIFIED,
      data: errData,
    };
    return res.status(401).json(responseMessage);
  }

  let userTickets = await savedUser.userTicket;
  userTickets = userTickets.filter(
    (userTicket) => userTicket.estimateTime != null
  );

  responseMessage = {
    success: true,
    message: SuccessMessage.GET_USER_SUCCESSFUL,
    data: {
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      userName: savedUser.userName,
      email: savedUser.email,
      ticketsEstimated: userTickets.length,
    },
  };
  return res.status(200).json(responseMessage);
};

export const updateUser = async (req: IRequest, res: Response) => {
  let responseMessage: ResponseMessage;
  let errData: any = {};

  let savedUser = req.user;

  if (req.body.firstName) {
    savedUser.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    savedUser.lastName = req.body.lastName;
  }

  if (req.body.userName) {
    let savedUserName = await getRepository(User).findOne({
      where: { userName: req.body.userName, id: Not(savedUser.id) },
    });
    if (savedUserName) {
      errData[ErrorTypes.USER_NAME] = ErrorMessage.USERNAME_ALREADY_EXIST;
      responseMessage = {
        success: false,
        message: ValidationMessages.USERNAME_ALREADY_EXIST,
        data: errData,
      };
      return res.status(400).json(responseMessage);
    } else {
      savedUser.userName = req.body.userName;
    }
  }

  // TO-DO: Send complete user except password

  const result = await getRepository(User).save(savedUser);
  responseMessage = {
    success: true,
    message: SuccessMessage.UPDATE_USER_SUCCESSFUL,
    data: {
      firstName: result.firstName,
      lastName: result.lastName,
      userName: result.userName,
    },
  };
  res.status(200).json(responseMessage);
};
