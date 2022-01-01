import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { ErrorTypes } from '../constants/errorType';
import { ConstantValues } from '../constants/constantValues';
import { ErrorMessage, SuccessMessage, TEXT } from '../constants/message';
import { SEARCH_LIMIT, SortType, SORT_TYPE } from '../constants/customTypes';
import { Pokerboard } from '../entity/Pokerboard';
import { Ticket } from '../entity/Ticket';
import { UserPokerboard } from '../entity/UserPokerboard';
import { UserTicket } from '../entity/UserTicket';
import { generateCustomResponse } from '../middlewares/user.validation';
import { IRequest } from '../models/RequestInterface';
import ResponseMessage from '../models/ResponseMessage';
import {
  getGroupDetailsAssociatedWithUser,
  userGroupData,
} from '../repositories/group.repository';
import { GroupDetails } from '../repositories/pokerBoard.repository';
import {
  findUser,
  getPokerboardDetailsAssociatedWithUser,
  getReportOfUserHelper,
  PokerboardDetailsType,
} from '../repositories/user.repository';

export const searchUser = async (req: Request, res: Response) => {
  let { searchKey, limit: limitFromRequest } = req.query;
  if (!searchKey) {
    searchKey = '';
  }
  const limit = Number(limitFromRequest)
    ? Number(limitFromRequest)
    : SEARCH_LIMIT;

  let users = await findUser(searchKey.toString(), limit);

  let searchResult = users.map((user) => {
    let {
      email,
      userName: user_name,
      firstName: first_name,
      lastName: last_name,
      id,
    } = user;
    return {
      email,
      userName: user_name,
      name: `${first_name} ${last_name}`,
      id,
    };
  });

  const message: ResponseMessage = {
    data: searchResult,
    success: true,
    message: '',
  };
  return res.json(message);
};

export const getPokerboardAssociatedToUser = async (
  req: IRequest,
  res: Response
) => {
  const user = req.user;

  const userPokerboards: PokerboardDetailsType[] =
    await getPokerboardDetailsAssociatedWithUser(user);

  res
    .status(200)
    .json(
      generateCustomResponse(
        true,
        SuccessMessage.FETCHED_DETAILS_SUCCESSFULLY,
        userPokerboards
      )
    );
};

export const getGroupsAssociatedToUser = async (
  req: IRequest,
  res: Response
) => {
  let responseMessage: ResponseMessage = {
    data: undefined,
    message: '',
    success: true,
  };

  const user = req.user;
  let groups = await user.groups;
  let groupIds = groups.map((group) => group.id);

  let groupsData: GroupDetails[] = await getGroupDetailsAssociatedWithUser(
    groupIds
  );

  let userGroups: { [key: string]: userGroupData } = {};
  for (let groupData of groupsData) {
    if (!userGroups[groupData.id]) {
      userGroups[groupData.id] = {
        id: groupData.id,
        name: groupData.name,
        admin: groupData.admin,
        countOfMembers: groupData.countOfMembers,
        members: [],
      };
    }
    userGroups[groupData.id].members.push(groupData.member);
  }

  responseMessage.data = {
    groups: Object.values(userGroups),
  };
  res.status(200).json(responseMessage);
};

export type ticketDetails = {
  id: string;
  type: string;
  managerEstimate: number;
  playerEstimate: number;
  date: Date;
};

export const getTicketsAssociatedToUser = async (
  req: IRequest,
  res: Response
) => {
  let responseMessage: ResponseMessage = {
    data: undefined,
    message: '',
    success: true,
  };

  const user = req.user;
  let { sort, filter, date } = req.query;

  const newSort: SORT_TYPE =
    sort == SortType.ASCENDING ? SortType.ASCENDING : SortType.DESCENDING;
  filter = filter == TEXT.undefined ? undefined : filter.toString();
  date = date == TEXT.undefined ? undefined : date.toString();

  let from: Date, to: Date;

  if (date) {
    from = new Date(+date);
    to = new Date(+date + ConstantValues.oneDay);
  }

  let tickets = await getRepository(UserTicket)
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
      date
        ? `user_ticket.estimate_date >= :from AND user_ticket.estimate_date <= :to`
        : '1=1',
      {
        from: from,
        to: to,
      }
    )
    .getRawMany();

  responseMessage.data = {
    ticketDetails: tickets,
  };

  res.status(200).json(responseMessage);
};

export const getReportOfUser = async (req: IRequest, res: Response) => {
  let pokerboard: Pokerboard = req.pokerboard;
  let userRole: UserPokerboard = req.userRole;
  let user = req.user;

  try {
    let report = await getReportOfUserHelper(pokerboard, user, userRole);
    return res
      .status(200)
      .json(
        generateCustomResponse(
          true,
          SuccessMessage.FETCHED_DETAILS_SUCCESSFULLY,
          report
        )
      );
  } catch (error) {
    let errData: any = {};
    if (error instanceof Error) {
      errData[error.name] = error.message;
      return res
        .status(400)
        .json(generateCustomResponse(false, error.message, errData));
    } else {
      errData[ErrorTypes.SOME_THING_WENT_WRONG] =
        ErrorMessage.SOMETHING_WENT_WRONG;
      return res
        .status(500)
        .json(
          generateCustomResponse(
            false,
            ErrorMessage.SOMETHING_WENT_WRONG,
            errData
          )
        );
    }
  }
};
