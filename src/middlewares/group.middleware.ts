import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages } from '../constants/message';
import { findGroup } from '../entity/group/repository';
import { validateCreateGroupData } from '../helpers/group.helper';
import { makeResponse } from '../utils/common';

export const createGroupValidation = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const { name, admin, members } = body;

  try {
    validateCreateGroupData(req.body);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  // Only the user creating the group can be the admin of that group.
  if (req.user.id !== admin) {
    req.body.admin = req.user.id;
  }

  // Admin is also a member of the group.F
  if (members.indexOf(admin) == -1) {
    req.body.members.push(admin);
  }

  const group = await findGroup({ name: name, isActive: true });

  if (group) {
    const errorData = { groupName: ErrorMessages.GROUP_NAME_ALREADY_EXISTS };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.GROUP_NAME_ALREADY_EXISTS, errorData));
  }

  next();
};
