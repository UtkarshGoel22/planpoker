import { StatusCodes } from 'http-status-codes';
import { FindOptionsWhere, In } from 'typeorm';

import { ErrorMessages } from '../../constants/message';
import { CreateGroup } from '../../types';
import { findUsers } from '../user/repository';
import customGetRepository from '../../utils/db';
import { Group } from './model';

export const createGroup = async (data: CreateGroup): Promise<Group> => {
  const groupRepository = customGetRepository(Group);
  const groupMembers = await findUsers({ id: In(data.members) });

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

export const findGroup = async (findOptions: FindOptionsWhere<Group>): Promise<Group> => {
  const groupRepository = customGetRepository(Group);
  return groupRepository.findOne({ where: findOptions });
};
