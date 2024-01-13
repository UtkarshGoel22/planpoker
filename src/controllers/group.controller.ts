import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { FindManyOptions, Like } from 'typeorm';

import { EmailSubject } from '../constants/enums';
import { EmailMessages, ResponseMessages } from '../constants/message';
import { Group } from '../entity/group/model';
import { createGroup, findGroups, findGroupsAssociatedToUser } from '../entity/group/repository';
import { GroupDetails, UserGroupDetails } from '../types';
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

export const getGroupsAssociatedToUser = async (req: Request, res: Response) => {
  const groups: GroupDetails[] = await findGroupsAssociatedToUser(req.user);
  const userGroupsData: { [key: string]: UserGroupDetails } = {};

  for (const group of groups) {
    if (!userGroupsData[group.id]) {
      userGroupsData[group.id] = {
        admin: group.admin,
        countOfMembers: group.countOfMembers,
        id: group.id,
        members: [],
        name: group.name,
      };
    }
    userGroupsData[group.id].members.push(group.member);
  }

  res.status(StatusCodes.OK).json(
    makeResponse(true, ResponseMessages.GET_GROUPS_ASSOCIATED_TO_USER_SUCCESS, {
      groups: Object.values(userGroupsData),
    }),
  );
};

export const searchGroup = async (req: Request, res: Response) => {
  const searchKey = req.query.searchKey.toString();
  const limit = Number(req.query.limit);
  const findOptions: FindManyOptions<Group> = {
    where: { isActive: true, name: Like(`${searchKey}%`) },
    select: ['admin', 'countOfMembers', 'id', 'name'],
    take: limit,
  };
  const groups = await findGroups(findOptions);
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
