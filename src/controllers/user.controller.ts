import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { FindManyOptions, Like, Not } from 'typeorm';

import { ErrorMessages, ResponseMessages, ValidationMessages } from '../constants/message';
import { User } from '../entity/user/model';
import { findUser, findUsers, saveUser } from '../entity/user/repository';
import { makeResponse } from '../utils/common';

export const getUser = async (req: Request, res: Response) => {
  const { password, ...user } = req.user; // eslint-disable-line @typescript-eslint/no-unused-vars
  if (!user.isVerified) {
    const errorData = { verify: ErrorMessages.ACCOUNT_NOT_VERIFIED };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.ACCOUNT_NOT_VERIFIED, errorData));
  } else {
    return res
      .status(StatusCodes.OK)
      .json(makeResponse(true, ResponseMessages.GET_USER_SUCCESS, user));
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  const searchKey = req.query.searchKey.toString();
  const limit = Number(req.query.limit);
  const findCondition = { isActive: true, isVerified: true };
  const findOptions: FindManyOptions<User> = {
    where: [
      { ...findCondition, username: Like(`${searchKey}%`) },
      { ...findCondition, email: Like(`${searchKey}%`) },
      { ...findCondition, firstName: Like(`${searchKey}%`) },
      { ...findCondition, lastName: Like(`${searchKey}%`) },
    ],
    select: ['email', 'firstName', 'lastName', 'id', 'username'],
    take: limit,
  };

  const users = await findUsers(findOptions);

  const searchResult = users.map((user) => {
    return {
      email: user.email,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      id: user.id,
    };
  });

  res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.USER_SEARCH_SUCCESS, searchResult));
};

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username } = req.body;
  const user = req.user;

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (username) {
    const userWithSameUsername = await findUser({ username: username, id: Not(user.id) });
    if (userWithSameUsername) {
      const errorData = { username: ValidationMessages.USERNAME_ALREADY_EXISTS };
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(makeResponse(false, ValidationMessages.USERNAME_ALREADY_EXISTS, errorData));
    } else {
      user.username = username;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = await saveUser(user);
  return res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.UPDATE_USER_SUCCESS, userData));
};
