import { StatusCodes } from 'http-status-codes';
import { FindManyOptions, FindOptionsWhere, In } from 'typeorm';

import { ErrorMessages } from '../../constants/message';
import { CreateGroup, GroupDetails } from '../../types';
import customGetRepository from '../../utils/db';
import { Pokerboard } from '../pokerboard/model';
import { User } from '../user/model';
import { findUsers } from '../user/repository';
import { Group } from './model';

export const createGroup = async (data: CreateGroup): Promise<Group> => {
  const groupRepository = customGetRepository(Group);
  const groupMembers = await findUsers({ where: { id: In(data.members) } });

  if (groupMembers.length < 2) {
    const errorData = { members: ErrorMessages.USERS_NOT_FOUND };
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: ErrorMessages.USERS_NOT_FOUND,
      data: errorData,
    };
  }

  const newGroup = groupRepository.create({
    name: data.name,
    admin: data.admin,
    countOfMembers: groupMembers.length,
  });
  newGroup.users = Promise.resolve(groupMembers);

  try {
    return groupRepository.save(newGroup);
  } catch (error) {
    const errorData = { somethingWentWrong: ErrorMessages.SOMETHING_WENT_WRONG };
    throw {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.SOMETHING_WENT_WRONG,
      data: errorData,
    };
  }
};

export const getGroupsDetails = async (entity: Pokerboard | User): Promise<GroupDetails[]> => {
  const groups = await entity.groups;
  const groupsDetails: GroupDetails[] = [];
  groups.forEach((group) => {
    groupsDetails.push({
      id: group.id,
      name: group.name,
      admin: group.admin,
      countOfMembers: group.countOfMembers,
    });
  });
  return groupsDetails;
};

export const findGroup = async (findOptions: FindOptionsWhere<Group>): Promise<Group> => {
  const groupRepository = customGetRepository(Group);
  return groupRepository.findOne({ where: findOptions });
};

export const findGroups = async (findOptions: FindManyOptions<Group>): Promise<Group[]> => {
  const groupRepository = customGetRepository(Group);
  return groupRepository.find(findOptions);
};

export const findGroupsAssociatedToUser = async (user: User) => {
  const groups = await user.groups;
  const groupIds = groups.map((group) => group.id);
  const groupRepository = customGetRepository(Group);
  const groupsData = await groupRepository
    .createQueryBuilder('group')
    .where({ id: In(groupIds) })
    .select('name')
    .leftJoin(User, 'user', 'user.id = admin')
    .leftJoin('group.users', 'members')
    .addSelect('members.username', 'member')
    .addSelect('group.id', 'id')
    .addSelect('user.username', 'admin')
    .addSelect('name')
    .addSelect('count_of_members', 'countOfMembers')
    .addSelect('')
    .orderBy('group.updated_at', 'DESC')
    .getRawMany();
  return groupsData;
};
