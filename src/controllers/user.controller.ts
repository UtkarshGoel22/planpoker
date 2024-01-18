import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FindManyOptions, Like, Not } from 'typeorm';

import { ONE_DAY, UNDEFINED } from '../constants/common';
import { SortTypes } from '../constants/enums';
import { ErrorMessages, ResponseMessages, ValidationMessages } from '../constants/message';
import { Ticket } from '../entity/ticket/model';
import { User } from '../entity/user/model';
import { findUser, findUsers, saveUser } from '../entity/user/repository';
import { UserTicket } from '../entity/userTicket/model';
import { makeResponse } from '../utils/common';
import customGetRepository from '../utils/db';

export const getTicketsAssociatedToUser = async (req: Request, res: Response) => {
  const user = req.user;
  let { filter, date } = req.query;

  const newSort =
    req.query.sort == SortTypes.ASCENDING ? SortTypes.ASCENDING : SortTypes.DESCENDING;
  filter = filter == UNDEFINED ? undefined : filter?.toString();

  date = date == UNDEFINED ? undefined : date?.toString();
  let from: Date, to: Date;
  if (date) {
    from = new Date(+date);
    to = new Date(+date + ONE_DAY);
  }

  const tickets = await customGetRepository(UserTicket)
    .createQueryBuilder('user_ticket')
    .where({
      userId: user.id,
    })
    .select('user_ticket.ticketId', 'id')
    .leftJoin(Ticket, 'ticket', 'ticket.id = ticketId')
    .addSelect('ticket.type', 'type')
    .addSelect('ticket.estimate', 'managerEstimate')
    .addSelect('user_ticket.estimate', 'playerEstimate')
    .addSelect('user_ticket.estimate_date', 'date')
    .orderBy('date', newSort)
    .andWhere(filter ? `type = :filter` : '1=1', { filter })
    .andWhere(
      date ? `user_ticket.estimate_date >= :from AND user_ticket.estimate_date <= :to` : '1=1',
      { from: from, to: to },
    )
    .getRawMany();

  res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.GET_TICKETS_SUCCESS, { ticketDetails: tickets }));
};

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
