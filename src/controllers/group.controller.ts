import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { Like } from 'typeorm';

import { EmailSubject } from '../constants/enums';
import { EmailMessages, ResponseMessages } from '../constants/message';
import { createGroup, findGroups } from '../entity/group/repository';
import { makeResponse } from '../utils/common';
import { sendBulkMails } from '../utils/notification';

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

export const searchGroup = async (req: Request, res: Response) => {
  const searchKey = req.query.searchKey;
  const limit = Number(req.query.limit);
  const groups = await findGroups(
    { isActive: true, name: Like(`${searchKey.toString()}%`) },
    limit,
  );
  const groupsData = groups
    .map((group) => {
      return {
        admin: group.admin,
        countOfMembers: group.countOfMembers,
        id: group.id,
        name: group.name,
      };
    })
    .filter((_, i) => i < limit);
  res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.GROUP_SEARCH_SUCCESS, groupsData));
};
