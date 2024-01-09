import { StatusCodes } from 'http-status-codes';

import { ErrorMessages } from '../../constants/message';
import { CreateUser } from '../../types';
import customGetRepository from '../../utils/db';
import { User } from './model';

export const createUser = async (data: CreateUser): Promise<User> => {
  const { email, firstName, password, lastName, username } = data;
  const userRepository = customGetRepository(User);
  const newUser = userRepository.create({ email, firstName, password, lastName, username });

  const result = await userRepository.update(
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
