import { StatusCodes } from 'http-status-codes';
import { FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { ErrorMessages } from '../../constants/message';
import { CreateUser } from '../../types';
import customGetRepository from '../../utils/db';
import { User } from './model';

export const createUser = async (data: CreateUser): Promise<User> => {
  const { email, firstName, password, lastName, username } = data;
  const userRepository = customGetRepository(User);
  const newUser = userRepository.create({ email, firstName, password, lastName, username });

  const result = await findAndUpdateUser(
    { email: data.email, isActive: false },
    { firstName, password, lastName, username, isActive: true },
  );

  if (result.affected) {
    return newUser;
  }

  try {
    return await userRepository.save(newUser);
  } catch (error) {
    console.log('Error while saving user:', error);
    const errorData: { [key: string]: string } = {
      duplicateEntry: ErrorMessages.ACCOUNT_ALREADY_EXISTS,
    };
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: ErrorMessages.ACCOUNT_ALREADY_EXISTS,
      data: errorData,
    };
  }
};

export const findAndUpdateUser = async (
  findOptions: FindOptionsWhere<User>,
  dataToUpdate: QueryDeepPartialEntity<User>,
): Promise<UpdateResult> => {
  const userRepository = customGetRepository(User);
  return userRepository.update(findOptions, dataToUpdate);
};

export const findUser = async (findOptions: FindOptionsWhere<User>): Promise<User> => {
  const userRepository = customGetRepository(User);
  return userRepository.findOne({ where: findOptions });
};

export const findUsers = async (findOptions: FindOptionsWhere<User>): Promise<User[]> => {
  const userRepository = customGetRepository(User);
  return userRepository.find({ where: findOptions });
};

export const saveUser = async (user: User): Promise<User> => {
  const userRepository = customGetRepository(User);
  return userRepository.save(user);
};
