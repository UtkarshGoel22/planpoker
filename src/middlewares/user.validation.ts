import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ErrorTags, ErrorTypes } from '../constants/errorType';
import { ErrorMessage, ValidationMessages } from '../constants/message';
import { PokerboardErrorType } from '../constants/PokerboardErrorTypes';
import { Token } from '../entity/Token';
import { User } from '../entity/User';
import { IRequest } from '../models/RequestInterface';
import ResponseMessage from '../models/ResponseMessage';
import {
  getPokerboardById,
  getUserPokerboardDetail,
} from '../repositories/pokerBoard.repository';
import {
  loginValidationHelper,
  registerUserValidationHelper,
  reverificationValidationHelper,
  verificationValidationHelper,
} from '../services/user.validation.helper';
import { searchSchema, updateUserSchema } from './user.validation.schema';

const registerUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registerUserValidationHelper(req.body);
  } catch (err) {
    return res
      .status(400)
      .json(generateCustomResponse(false, err.message, err.errData));
  }

  const existingUser = await getRepository(User).findOne({
    where: { isActive: true, userName: req.body.userName },
  });

  if (existingUser) {
    let errData: any = {};
    errData[ErrorTypes.USER_NAME] = ValidationMessages.USERNAME_ALREADY_EXIST;
    let err: ResponseMessage = {
      success: false,
      message: ValidationMessages.USERNAME_ALREADY_EXIST,
      data: errData,
    };
    return res.status(400).json(err);
  }

  next();
};

const verificationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verificationValidationHelper(req.query);
  } catch (err) {
    return res
      .status(400)
      .json(generateCustomResponse(false, err.message, err.errData));
  }

  next();
};

const reverificationValidation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    reverificationValidationHelper(req.body);
  } catch (err) {
    return res
      .status(400)
      .json(generateCustomResponse(false, err.message, err.errData));
  }

  try {
    const user = await getRepository(User).findOne({ email: req.body.email });
    if (user) {
      req.user = user;
      next();
    } else {
      let errData: any = {};
      errData[ErrorTypes.EMAIL] = ErrorMessage.EMAIL_NOT_FOUND;
      let err: ResponseMessage = generateCustomResponse(
        false,
        ErrorMessage.EMAIL_NOT_FOUND,
        errData
      );
      return res.status(400).json(err);
    }
  } catch (e) {
    let errData: any = {};
    errData[ErrorTypes.SOME_THING_WENT_WRONG] =
      ErrorMessage.SOMETHING_WENT_WRONG;
    let err: ResponseMessage = generateCustomResponse(
      false,
      ErrorMessage.SOMETHING_WENT_WRONG,
      errData
    );
    return res.status(400).json(err);
  }
};

const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    loginValidationHelper(req.body);
  } catch (errorObject) {
    return res
      .status(400)
      .json(
        generateCustomResponse(false, errorObject.message, errorObject.errData)
      );
  }

  try {
    const user = await getRepository(User).findOne({
      where: { isActive: true, email: req.body.email },
    });

    if (user && user.isVerified) next();
    else if (user && !user.isVerified) {
      let errData: any = {};
      errData[ErrorTypes.EMAIL] = ErrorMessage.ACCOUNT_NOT_VERIFIED;
      let err: ResponseMessage = generateCustomResponse(
        false,
        ErrorMessage.ACCOUNT_NOT_VERIFIED,
        errData
      );
      res.status(400).json(err);
    } else {
      let errData: any = {};
      errData[ErrorTypes.EMAIL] = ErrorMessage.EMAIL_NOT_FOUND;
      let err: ResponseMessage = generateCustomResponse(
        false,
        ErrorMessage.EMAIL_NOT_FOUND,
        errData
      );
      res.status(400).json(err);
    }
  } catch (e) {
    let errData: any = {};
    errData[ErrorTypes.SOME_THING_WENT_WRONG] =
      ErrorMessage.SOMETHING_WENT_WRONG;
    let err: ResponseMessage = generateCustomResponse(
      false,
      ErrorMessage.SOMETHING_WENT_WRONG,
      errData
    );
    res.status(500).json(err);
  }
};

const tokenValidation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let tokenId = req.get('authorization');
  if (!tokenId) {
    let errData: any = {};
    errData[ErrorTypes.AUTH] = ValidationMessages.UNAUTHORIZED_USER;
    let err: ResponseMessage = generateCustomResponse(
      false,
      ValidationMessages.UNAUTHORIZED_USER,
      errData
    );
    res.status(401).json(err);
    return;
  }

  tokenId = tokenId.slice(7).trim();

  let token = await getRepository(Token).findOne({
    where: {
      isActive: true,
      id: tokenId,
    },
  });

  let currentDate = new Date();
  if (!token || token.expiryDate <= currentDate) {
    let errData: any = {};
    errData[ErrorTypes.AUTH] = ValidationMessages.UNAUTHORIZED_USER;
    let err: ResponseMessage = generateCustomResponse(
      false,
      ValidationMessages.UNAUTHORIZED_USER,
      errData
    );
    return res.status(401).json(err);
  }

  let user = await token.user;
  req.user = user;
  req.token = token;
  next();
};

const searchValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const value = searchSchema.validate(req.query);
  if (value.error) {
    let errData = {};
    errData[ErrorTypes.QUERY] = value.error.details[0].message;
    let err = generateCustomResponse(
      false,
      value.error.details[0].message,
      errData
    );
    return res.status(400).json(err);
  }
  next();
};

export const updateUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const value = updateUserSchema.validate(req.body);
  if (value.error) {
    let errData: any = {};
    let message = value.error.details[0].message;
    let lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes(ErrorTags.FIRST_NAME)) {
      errData[ErrorTypes.FIRST_NAME] = message;
    } else if (lowercaseMessage.includes(ErrorTags.LAST_NAME)) {
      errData[ErrorTypes.LAST_NAME] = message;
    } else if (lowercaseMessage.includes(ErrorTypes.USER_NAME)) {
      errData[ErrorTypes.USER_NAME] = message;
    }
    let err = generateCustomResponse(
      false,
      value.error.details[0].message,
      errData
    );
    return res.status(400).json(err);
  }
  next();
};

export const generateCustomResponse = (
  success: boolean,
  message: string,
  data: any
): ResponseMessage => {
  let err: ResponseMessage = {
    success: success,
    message: message,
    data: data,
  };
  return err;
};

export const pokerboardReportValidation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let { pokerboardId } = req.query;
  let errData: any = {};

  let user = req.user;

  if (!pokerboardId) {
    return next();
  }

  pokerboardId = pokerboardId.toString();

  let pokerboard = await getPokerboardById(pokerboardId);

  if (!pokerboard) {
    errData[PokerboardErrorType.POKER_BOARD_ID] =
      ErrorMessage.INVALID_POKERBOARD_ID;
    return res
      .status(400)
      .json(
        generateCustomResponse(
          false,
          ErrorMessage.INVALID_POKERBOARD_ID,
          errData
        )
      );
  }

  let userRole = await getUserPokerboardDetail({
    userId: user.id,
    pokerboardId: pokerboard.id,
  });

  if (!userRole) {
    errData[PokerboardErrorType.POKER_BOARD_ID] =
      ErrorMessage.INVALID_POKERBOARD_ID;
    return res
      .status(400)
      .json(
        generateCustomResponse(
          false,
          ErrorMessage.INVALID_POKERBOARD_ID,
          errData
        )
      );
  }

  req.pokerboard = pokerboard;
  req.userRole = userRole;
  next();
};

export {
  registerUserValidation,
  verificationValidation,
  reverificationValidation,
  loginValidation,
  tokenValidation,
  searchValidation,
};
