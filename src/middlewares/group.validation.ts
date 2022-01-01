import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ErrorTags, ErrorTypes } from '../constants/errorType';
import { ValidationMessages } from '../constants/message';
import { Group } from '../entity/Group';
import ResponseMessage from '../models/ResponseMessage';
import { createGroupSchema } from './group.validation.schema';
import { generateCustomResponse } from './user.validation';

export const createGroupValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const value = createGroupSchema.validate(req.body);
  let errData: any = {};
  if (value.error) {
    let message = value.error.details[0].message;
    let lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes(ErrorTags.GROUP_NAME)) {
      errData[ErrorTypes.GROUP_NAME] = message;
    } else if (lowercaseMessage.includes(ErrorTags.ADMIN)) {
      errData[ErrorTags.ADMIN] = message;
    } else if (lowercaseMessage.includes(ErrorTags.MEMBERS)) {
      errData[ErrorTags.MEMBERS] = message;
    }

    let err: ResponseMessage = generateCustomResponse(
      false,
      value.error.details[0].message,
      errData
    );
    return res.status(400).json(err);
  }

  const searchGroup = await getRepository(Group).findOne({
    where: { name: req.body.name, isActive: true },
  });

  if (searchGroup) {
    errData[ErrorTypes.GROUP_NAME] =
      ValidationMessages.GROUP_NAME_ALREADY_EXIST;
    let err: ResponseMessage = generateCustomResponse(
      false,
      ValidationMessages.GROUP_NAME_ALREADY_EXIST,
      errData
    );
    return res.status(400).json(err);
  }

  next();
};
