import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

import { createGroup } from '../entity/group/repository';
import { makeResponse } from '../utils/common';
import { sendBulkMails } from '../utils/notification';
import { EmailSubject } from '../constants/enums';
import { EmailMessages, ResponseMessages } from '../constants/message';

export const createUserGroup = async (req: Request, res: Response) => {
  try {
    const group = await createGroup(req.body);
    const groupMembers = await group.users;
    const groupMembersEmails = groupMembers
      .filter((user) => user.id !== group.admin)
      .map((user) => user.email);
    const user = req.user;
    sendBulkMails(
      EmailSubject.ADDED_TO_GROUP,
      EmailMessages.ADDED_TO_GROUP(group.name, user.firstName, user.lastName, user.email),
      groupMembersEmails,
    );
    res
      .status(StatusCodes.CREATED)
      .json(makeResponse(true, ResponseMessages.GROUP_CREATION_SUCCESS));
  } catch (error) {
    res.status(error.statusCode).json(makeResponse(false, error.message, error.data));
  }
};
