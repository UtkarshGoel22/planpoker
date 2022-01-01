import { Request } from 'express';
import { FindConditions, getRepository, In, Not, Repository } from 'typeorm';
import { ErrorTypes } from '../constants/errorType';
import { ErrorMessage, Message, SuccessMessage } from '../constants/message';
import {
  ConstantTypes,
  InviteStatus,
  PokerBoardStatus,
  RoleTypes,
  ROLE_TYPE,
} from '../constants/customTypes';
import { PokerboardErrorType } from '../constants/PokerboardErrorTypes';
import { Group } from '../entity/Group';
import { Pokerboard } from '../entity/Pokerboard';
import { UserInviteToPokerboard } from '../entity/PokerboardInvite';
import { Ticket } from '../entity/Ticket';
import { Token } from '../entity/Token';
import { User } from '../entity/User';
import { UserPokerboard } from '../entity/UserPokerboard';
import { UserTicket } from '../entity/UserTicket';
import { generateCustomResponse } from '../middlewares/user.validation';
import { ReportType, PlayerEstimateType } from '../models/customTypes';
import { ErrorInterface } from '../models/ErrorInterface';
import ResponseMessage from '../models/ResponseMessage';
import { sendMassMails, SendMassMails } from '../services/sendMail';

/**
 *
 * @param users : Array of Users
 * @param pokerBoard : Pokerboard
 * @param manager : Manager of the Pokerboard
 */
export const createAndSaveUserPokerBoardForAllUsers = async (
  users: User[],
  pokerBoard: Pokerboard,
  manager: string
) => {
  const userPokerBoardRepo = getRepository(UserPokerboard);
  let userPokerBoards: UserPokerboard[] = [];
  for (const user of users) {
    const userPokerBoard = userPokerBoardRepo.create();
    // connected to user
    userPokerBoard.user = Promise.resolve(user);
    // connected to pokerboard
    userPokerBoard.pokerboard = Promise.resolve(pokerBoard);
    userPokerBoard.inviteStatus =
      user.id === manager ? InviteStatus.ACCEPTED : InviteStatus.PENDING;
    userPokerBoard.role =
      user.id === manager ? RoleTypes.MANAGER : RoleTypes.PLAYER;
    userPokerBoards.push(userPokerBoard);
  }

  // saving all the users
  await userPokerBoardRepo.save(userPokerBoards);
};

/**
 * This function saves the tickets to database and returns the array of tickets
 * @param tickets
 * @returns Promise of Tickets
 */
export const saveTickets = async (
  tickets: any,
  pokerboard: Pokerboard
): Promise<Ticket[]> => {
  const ticketRepo = getRepository(Ticket);
  const ticketArray: Ticket[] = [];
  let count = (await pokerboard.tickets).length;

  for (let ticketFromBody of tickets) {
    const ticket = ticketRepo.create();
    ticket.id = ticketFromBody.id;
    ticket.type = ticketFromBody.type;
    ticket.summary = ticketFromBody.summary;
    ticket.description = ticketFromBody.description;
    ticket.pokerboard = Promise.resolve(pokerboard);
    ticket.order = count + 1;
    ticket.isActive = true;
    count++;
    ticketArray.push(ticket);
  }

  // save tickets
  await ticketRepo.save(ticketArray);
  return ticketArray;
};

/**
 * Get pokerboard by id
 * @param id
 * @returns Pokerboard
 */
export const getPokerboardById = async (id: string): Promise<Pokerboard> => {
  const pokerboardRepo = getRepository(Pokerboard);
  const pokerboard = await pokerboardRepo.findOne({
    where: {
      id: id,
      isActive: true,
    },
  });
  return pokerboard;
};

export type GroupDetails = {
  id: string;
  name: string;
  admin: string;
  countOfMembers: number;
  member?: string;
};

/**
 *
 * @param pokerboard
 * @returns Array of groups
 */
export const getGroupDetails = async (
  pokerboardOrUser: Pokerboard | User
): Promise<GroupDetails[]> => {
  const groupsFromDb = await pokerboardOrUser.groups;
  const groups: GroupDetails[] = [];
  for (let group of groupsFromDb) {
    let groupDetail: GroupDetails = {
      id: group.id,
      name: group.name,
      admin: group.admin,
      countOfMembers: group.countOfMembers,
    };
    groups.push(groupDetail);
  }

  return groups;
};

/**
 * Get list of tickets
 * @param pokerboard
 * @returns  List of Tickets
 */
export const getTicketDetails = async (
  pokerboard: Pokerboard
): Promise<Ticket[]> => {
  const ticketsFromDb = await getRepository(Ticket).find({
    where: {
      pokerboard: pokerboard,
      isActive: true,
    },
    select: ['id', 'description', 'estimate', 'order', 'summary', 'type'],
    order: { order: 'ASC' },
  });
  return ticketsFromDb;
};

export type UserDetail = {
  role: string;
  userId: string;
  name: string;
  email: string;
  inviteStatus: string;
};

/**Get list of UserDetails
 *
 * @param pokerboard
 * @returns Array of UserDetails
 */
export const getUserDetails = async (
  pokerboard: Pokerboard
): Promise<UserDetail[]> => {
  const userPokerboards = (await pokerboard.userPokerboard).filter(
    (userPokerboard) => userPokerboard.isActive === true
  );

  const usersDetail: UserDetail[] = [];

  for (let userPokerboard of userPokerboards) {
    let user = await userPokerboard.user;
    let userDetail: UserDetail = {
      role: userPokerboard.role,
      userId: userPokerboard.userId,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      inviteStatus: userPokerboard.inviteStatus,
    };

    usersDetail.push(userDetail);
  }

  return usersDetail;
};

export const getUserFromAuthToken = async (req: Request): Promise<User> => {
  let tokenId = req.get('authorization');
  tokenId = tokenId.slice(7).trim();

  let token = await getRepository(Token).findOne({
    where: {
      isActive: true,
      id: tokenId,
    },
  });

  let user = await token.user;
  return user;
};

export const createPokerboardHelper = async (body: any) => {
  const usersSet = new Set<string>();
  const { manager, name, deckType, users: usersFromRequestBody } = body;
  const userRepo: Repository<User> = getRepository(User);
  const groupRepo: Repository<Group> = getRepository(Group);
  const pokerBoardRepo: Repository<Pokerboard> = getRepository(Pokerboard);
  const pokerBoard: Pokerboard = pokerBoardRepo.create();

  let unregisteredUsersEmail: string[] = [];

  for (let user of usersFromRequestBody) {
    if (user.id !== ConstantTypes.UN_REGISTERED) {
      usersSet.add(user.id);
    } else {
      unregisteredUsersEmail.push(user.email);
    }
  }

  usersSet.add(manager);

  // get users from group
  let groups: string[] = body.groups;
  const allGroups = await groupRepo.find({
    where: {
      id: In(groups),
    },
    relations: ['users'],
  });

  for (let group of allGroups) {
    const allUsersFromGroup = await group.users;
    allUsersFromGroup.forEach((u) => {
      usersSet.add(u.id);
    });
  }

  // we have all users
  const allUsers = await userRepo.find({
    where: { id: In(Array.from(usersSet)) },
  });

  pokerBoard.manager = manager;
  pokerBoard.name = name;
  pokerBoard.deckType = deckType;
  pokerBoard.status = PokerBoardStatus.CREATED;
  pokerBoard.groups = Promise.resolve(allGroups);

  // saving the poker-board
  await pokerBoardRepo.save(pokerBoard);

  await createAndSaveUserPokerBoardForAllUsers(allUsers, pokerBoard, manager);

  // // now we can send mail to users
  sendInvitationMailToAllVerifiedUser(allUsers, pokerBoard, manager);
  sendInvitationMailToUnregisteredUsers(unregisteredUsersEmail, pokerBoard);

  return pokerBoard;
};

async function sendInvitationMailToAllVerifiedUser(
  users: User[],
  pokerBoard: Pokerboard,
  manager: string
) {
  const mails = users.filter((u) => u.id !== manager).map((u) => u.email);
  let details: SendMassMails = {
    to: mails,
    subject: `Invitation to ${pokerBoard.name} Poker-board `,
    message: Message.addedToPokerBoard(pokerBoard.name, pokerBoard.id),
  };

  sendMassMails(details);
}

async function sendInvitationMailToUnregisteredUsers(
  unregisteredUsersEmail: string[],
  pokerBoard: Pokerboard
) {
  if (unregisteredUsersEmail.length === 0) {
    return;
  }
  // add all unverified users to invite table
  const userInviteRepo = getRepository(UserInviteToPokerboard);
  const invitees: UserInviteToPokerboard[] = [];
  for (let email of unregisteredUsersEmail) {
    const userInvitation = userInviteRepo.create();
    userInvitation.email = email;
    userInvitation.pokerboard = Promise.resolve(pokerBoard);
    invitees.push(userInvitation);
  }

  await userInviteRepo.save(invitees);

  let details: SendMassMails = {
    to: unregisteredUsersEmail,
    subject: `Signup to join ${pokerBoard.name} Poker-board `,
    message: Message.inviteForSignup(pokerBoard.name),
  };

  sendMassMails(details);
}
export const getUserPokerboardByUserIdAndPokerboardId = async (
  userId: string,
  pokerBoardId: string
) => {
  let userPokerBoard = await getRepository(UserPokerboard).findOne({
    where: {
      userId: userId,
      pokerboardId: pokerBoardId,
    },
  });

  return userPokerBoard;
};

export const saveUserPokerboard = async (userPokerBoard: UserPokerboard) => {
  await getRepository(UserPokerboard).save(userPokerBoard);
};

/**
 *
 * @param ticketsFromBody Tickets To add
 * @param pokerboard Pokerboard
 * @returns Response Message
 */
export const addTicketToPokerboardHelper = async (
  ticketsFromBody: any,
  pokerboard: Pokerboard
): Promise<ResponseMessage> => {
  // get ticket id's
  const ticketIds = ticketsFromBody.map((ticket: Ticket) => ticket.id);
  const tickets = await getTicketsByIdsFromDb(ticketIds);

  // 3 case
  if (tickets.length == 0) {
    // all tickets are valid tickets.
    await saveTickets(ticketsFromBody, pokerboard);
    return generateCustomResponse(true, SuccessMessage.TICKET_SAVED, undefined);
  } else if (tickets.length == ticketsFromBody.length) {
    // all tickets are invalid tickets.
    let errData: any = {};
    errData[PokerboardErrorType.TICKETS_ALREADY_EXIST] =
      ErrorMessage.ALL_TICKETS_ALREADY_EXIST;
    throw {
      errData,
      message: ErrorMessage.ALL_TICKETS_ALREADY_EXIST,
    } as ErrorInterface;
  } else {
    // some tickets already exist.
    const idOfTicketWhichExist = tickets.map((ticket) => ticket.id);
    const setOfIds = new Set(idOfTicketWhichExist);
    ticketsFromBody = ticketsFromBody.filter(
      (ticket: Ticket) => !setOfIds.has(ticket.id)
    );
    await saveTickets(ticketsFromBody, pokerboard);
    let data: any = {};
    data[PokerboardErrorType.PARTIAL_EXIST] = idOfTicketWhichExist;
    return generateCustomResponse(true, SuccessMessage.PARTIAL_SAVED, data);
  }
};

export const getTicketsByIdsFromDb = async (ids: string[]) => {
  return await getRepository(Ticket).find({
    where: {
      id: In(ids),
      isActive: true,
    },
  });
};

export const updateTicketsInDbService = async (ticketsFromBody: any[]) => {
  const ids = ticketsFromBody.map((t: any) => t.id);

  const ticketsFromDb = await getTicketsByIdsFromDb(ids);

  type TicketSetType = {
    [index: string]: Ticket;
  };

  const ticketsSet: TicketSetType = {};

  ticketsFromDb.forEach((t) => {
    ticketsSet[t.id] = t;
  });

  for (let ticketFromBody of ticketsFromBody) {
    let ticket = ticketsSet[ticketFromBody.id];
    if (!ticket) {
      continue;
    }

    if (ticketFromBody.estimate) ticket.estimate = ticketFromBody.estimate;
    if (ticketFromBody.order) ticket.order = ticketFromBody.order;
    if (ticketFromBody.summary) ticket.summary = ticketFromBody.summary;
    if (ticketFromBody.description)
      ticket.description = ticketFromBody.description;
    if (ticketFromBody.type) ticket.type = ticketFromBody.type;
  }

  try {
    await getRepository(Ticket).save(ticketsFromDb);
    return ticketsFromDb;
  } catch (_) {
    let errorData: any = {};
    errorData[PokerboardErrorType.SOMETHING_WENT_WRONG] =
      ErrorMessage.SOMETHING_WENT_WRONG;
    throw {
      message: ErrorMessage.SOMETHING_WENT_WRONG,
      errData: errorData,
    } as ErrorInterface;
  }
};

export const updateRoleHelper = async (
  pokerboardId: string,
  users: any[]
): Promise<ResponseMessage> => {
  // users can be divided into 2 categories.
  // whose role is changed to SPECTATOR
  // else whose role is changed to PLAYER
  let players: string[] = [];
  let spectators: string[] = [];

  for (let user of users) {
    if (user.role === RoleTypes.PLAYER) {
      players.push(user.userId);
    } else if (user.role === RoleTypes.SPECTATOR) {
      spectators.push(user.userId);
    }
  }

  // update user pokerboard table
  try {
    await updateRoleOfUsersByIds(pokerboardId, spectators, RoleTypes.SPECTATOR);
    await updateRoleOfUsersByIds(pokerboardId, players, RoleTypes.PLAYER);

    return generateCustomResponse(true, SuccessMessage.UPDATED, undefined);
  } catch (error) {
    let errData: any = {};
    errData[PokerboardErrorType.SOMETHING_WENT_WRONG] = error;
    let message = ErrorMessage.SOMETHING_WENT_WRONG;
    throw { message, errData } as ErrorInterface;
  }
};

export const updateRoleOfUsersByIds = async (
  pokerboardId: string,
  players: string[],
  role: ROLE_TYPE
) => {
  await getRepository(UserPokerboard).update(
    {
      pokerboardId: pokerboardId,
      userId: In(players),
    },
    {
      role: role,
    }
  );
};

export const getEstimationReportOfPokerboard = async (
  pokerboard: Pokerboard
): Promise<ReportType> => {
  const tickets = await pokerboard.tickets;
  const ticketIds = tickets.map((ticket) => ticket.id);

  let allPlayerEstimateDetails: GetReportForPokerboardReturnType[] =
    await getReportForPokerboard(ticketIds);

  if (!allPlayerEstimateDetails || allPlayerEstimateDetails.length === 0) {
    let error = new Error(ErrorMessage.NO_ESTIMATE_FOUND_FOR_THIS_TICKET);
    error.name = ErrorTypes.ESTIMATE_NOT_FOUND;
    throw error;
  }

  let dataToSend: ReportType = {};

  for (let estimateDetails of allPlayerEstimateDetails) {
    let playerEstimate: PlayerEstimateType = {
      id: estimateDetails.id,
      estimate: estimateDetails.estimate,
      name: estimateDetails.name,
      time: estimateDetails.time,
    };

    if (dataToSend[estimateDetails.ticketId]) {
      dataToSend[estimateDetails.ticketId].playersEstimate.push(playerEstimate);
    } else {
      dataToSend[estimateDetails.ticketId] = {
        actualEstimate: estimateDetails.actualEstimate,
        playersEstimate: [playerEstimate],
      };
    }
  }

  return dataToSend;
};

export const getPlayersEstimateByTicketId = async (
  ticketId: string[]
): Promise<PlayerEstimateType[]> => {
  let playersEstimate: PlayerEstimateType[] = await getRepository(UserTicket)
    .createQueryBuilder('user_ticket')
    .where({
      ticketId: In(ticketId),
      estimateTime: Not('NULL'),
    })
    .leftJoin(User, 'user', 'user.id = userId')
    .select('user.id', 'id')
    .addSelect('estimate_time', 'time')
    .addSelect('estimate')
    .addSelect('user.user_name', 'name')
    .orderBy('estimate_time', 'ASC')
    .getRawMany();

  return playersEstimate;
};

export const getTicketEstimateByTicketId = (
  ticketId: string
): Promise<Ticket> => {
  return getRepository(Ticket).findOne(ticketId, {
    select: ['estimate'],
  });
};

export type GetReportForPokerboardReturnType = {
  id: string;
  time: number;
  estimate: number;
  name: string;
  actualEstimate: number;
  ticketId: string;
};

export const getReportForPokerboard = async (
  ticketIds: string[]
): Promise<GetReportForPokerboardReturnType[]> => {
  let result = await getRepository(UserTicket)
    .createQueryBuilder('user_ticket')
    .where({
      ticketId: In(ticketIds),
      estimateTime: Not('NULL'),
    })
    .leftJoin(User, 'user', 'user.id = userId')
    .leftJoinAndSelect(Ticket, 'ticket', 'ticket.id = ticketId')
    .select('user.id', 'id')
    .addSelect('estimate_time', 'time')
    .addSelect('user_ticket.estimate', 'estimate')
    .addSelect('user.user_name', 'name')
    .addSelect('ticket.estimate', 'actualEstimate')
    .addSelect('ticketId')
    .orderBy('estimate_time', 'ASC')
    .getRawMany();

  return result;
};

export const getUserPokerboardDetail = (
  findOptions: FindConditions<UserPokerboard>
) => {
  return getRepository(UserPokerboard).findOne({
    where: findOptions,
  });
};
