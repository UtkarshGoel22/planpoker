import {
  FindConditions,
  getRepository,
  In,
  Like,
  Not,
  UpdateResult,
} from 'typeorm';
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcrypt';
import {
  ErrorMessage,
  JWT_SECRET,
  Message,
  SuccessMessage,
} from '../constants/message';
import {
  InviteStatus, PokerBoardStatus,
  RoleTypes,
  SEARCH_LIMIT
} from "../constants/customTypes";
import { ErrorTypes } from '../constants/errorType';
import { Token } from '../entity/Token';
import { User } from '../entity/User';
import { sendMail } from '../services/sendMail';
import { Pokerboard } from '../entity/Pokerboard';
import { UserPokerboard } from '../entity/UserPokerboard';
import { UserInviteToPokerboard } from '../entity/PokerboardInvite';
import { ErrorInterface } from '../models/ErrorInterface';
import { ConstantValues } from '../constants/constantValues';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Ticket } from '../entity/Ticket';
import { UserTicket } from '../entity/UserTicket';
import { getEstimationReportOfPokerboard } from './pokerBoard.repository';
import { PlayerEstimateType, ReportType } from '../models/customTypes';

export interface RegisterUserProps {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

export const registerUserDB = async (
  details: RegisterUserProps
): Promise<User> => {
  const userRepository = getRepository(User);
  let newUser = userRepository.create();

  newUser.email = details.email;
  newUser.password = details.password;
  newUser.firstName = details.firstName;
  newUser.lastName = details.lastName;
  newUser.userName = details.userName;

  // if user already existed with is_active = false, then update the user
  let result = await userRepository.update(
    { isActive: false, email: newUser.email },
    {
      password: newUser.password,
      isActive: true,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      userName: newUser.userName,
    }
  );

  // if any row was updated then user must have exist in our database with active state equal to false
  if (result.affected == 1) {
    return newUser;
  } else {
    try {
      let user = await userRepository.save(newUser);
      if (user) {
        return newUser;
      }
    } catch (_) {
      let message = ErrorMessage.DUPLICATE_ENTRY;
      let errData: any = {};
      errData[ErrorTypes.DUPLICATE_ENTRY] = ErrorMessage.DUPLICATE_ENTRY;
      throw { errData, message };
    }
  }
};

/**
 *
 * @param res Response object
 * @param responseMessage Response message to send
 */
export function sendMailAfterSignup(email: string, id: string) {

  let token = jwt.sign({ email: email, id: id }, JWT_SECRET, {
    expiresIn: ConstantValues.expiryTimeForVerificationJWT,
  });

  sendMail({
    message: Message.welcomeMessage(token),
    to: email,
    subject: SuccessMessage.EMAIL_SUBJECT,
  });
}

/**
 *
 * @param email email of user
 * @param password password of user
 * @returns Object {token, userId}
 */
export async function checkPasswordAndGenerateToken(
  email: string,
  password: string
): Promise<{ token: string; userId: string }> {
  const tokenRepo = getRepository(Token);
  const user = await getRepository(User).findOne({
    where: { email: email },
  });

  let isValid = compareSync(password, user.password);

  if (!isValid) {
    let errData: any = {};
    errData[ErrorTypes.PASSWORD] = ErrorMessage.INVALID_PASSWORD;
    let err: ErrorInterface = {
      message: ErrorMessage.INVALID_PASSWORD,
      errData,
    };
    throw err;
  }

  let token = tokenRepo.create();
  token.isActive = true;
  token.user = Promise.resolve(user);
  token.expiryDate = new Date();
  token.expiryDate.setDate(
    token.expiryDate.getDate() + ConstantValues.expiryRange
  );
  await tokenRepo.save(token);

  return { token: token.id, userId: user.id };
}

/**
 * Checks if there is an invite to game for the user and if it is present,
 * it sends email of invitation to game.
 * @param email email of the user
 * @returns
 */
export const checkIfInviteExistsAndSendMail = async (user: User) => {
  try {
    if (!user) {
      return;
    }

    const pokerboardRepo = getRepository(Pokerboard);
    const userPokerboardRepo = getRepository(UserPokerboard);
    const invitesRepo = getRepository(UserInviteToPokerboard);

    const invites = await invitesRepo.find({
      where: { isVerified: false, email: user.email },
    });

    if (!invites || invites.length == 0) {
      return;
    }

    const pokerboards = await pokerboardRepo.find({
      where: {
        id: In(invites.map((i) => i.pokerboardId)),
        status: Not(PokerBoardStatus.ENDED),
      },
    });

    let userPokerBoards: UserPokerboard[] = [];

    for (let pokerboard of pokerboards) {
      const userPokerBoard = userPokerboardRepo.create();
      // connected to user
      userPokerBoard.user = Promise.resolve(user);
      // connected to pokerboard
      userPokerBoard.pokerboard = Promise.resolve(pokerboard);
      userPokerBoard.inviteStatus = InviteStatus.PENDING;
      userPokerBoard.role = RoleTypes.PLAYER;
      userPokerBoards.push(userPokerBoard);
    }

    await userPokerboardRepo.save(userPokerBoards);
    await invitesRepo.update(
      {
        id: In(invites.map((i) => i.id)),
      },
      {
        isVerified: true,
      }
    );
    // now send mails.
    for (let pokerboard of pokerboards) {
      sendMail({
        to: user.email,
        subject: `Invitation to ${pokerboard.name} Poker-board `,
        message: Message.addedToPokerBoard(pokerboard.name, pokerboard.id),
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUserById = async (id: string) => {
  const user = await getRepository(User).findOne({
    where: { id: id, isActive: true },
  });
  return user;
};

export const findUserPokerboardsByUserId = async (
  id: string
): Promise<UserPokerboard[]> => {
  const userPokerboards = await getRepository(UserPokerboard).find({
    where: {
      userId: id,
      isActive: true,
      inviteStatus: InviteStatus.ACCEPTED,
    },
  });
  return userPokerboards;
};

export const findUser = async (
  searchQuery: string,
  limit: number = SEARCH_LIMIT
): Promise<User[]> => {
  let userRepository = getRepository(User);
  let findCondition: FindConditions<User> = {
    isActive: true,
    isVerified: true,
  };
  let users = await userRepository.find({
    where: [
      {
        ...findCondition,
        userName: Like(`${searchQuery}%`),
      },
      {
        ...findCondition,
        email: Like(`${searchQuery}%`),
      },
      {
        ...findCondition,
        firstName: Like(`${searchQuery}%`),
      },
      {
        ...findCondition,
        lastName: Like(`${searchQuery}%`),
      },
    ],
    take: limit,
    select: ['email', 'firstName', 'lastName', 'userName', 'id'],
  });

  return users;
};

export const findUserByEmail = async (email: string) => {
  let user: User = await getRepository(User).findOne({
    where: {
      email: email,
    },
  });
  return user;
};

export const findUserById = async (id: string) => {
  let user = getRepository(User).findOne({
    where: { id: id },
  });
  return user;
};

export const updateUserDetail = async (
  findCondition: FindConditions<User>,
  updateFields: QueryDeepPartialEntity<User>
): Promise<UpdateResult> => {
  let result = await getRepository(User).update(findCondition, updateFields);
  return result;
};

export type PokerboardDetailsType = {
  id: string;
  manager: string;
  name: string;
  status: string;
  createdBy: string;
  deckType: string;
};
export const getPokerboardDetailsAssociatedWithUser = async (
  user: User
): Promise<PokerboardDetailsType[]> => {
  const result = await getRepository(UserPokerboard)
    .createQueryBuilder('user_pokerboard')
    .where({
      userId: user.id,
      isActive: true,
      inviteStatus: InviteStatus.ACCEPTED,
    })
    .leftJoin(Pokerboard, 'pokerboard', 'pokerboard.id = pokerboardId')
    .leftJoin(User, 'user', 'user.id = pokerboard.manager')
    .select('user.user_name', 'createdBy')
    .addSelect('pokerboard.id', 'id')
    .addSelect('pokerboard.manager', 'manager')
    .addSelect('pokerboard.deck_type', 'deckType')
    .addSelect('pokerboard.status', 'status')
    .addSelect('pokerboard.name', 'name')
    .orderBy('pokerboard.updated_at', 'DESC')
    .getRawMany();
  return result;
};

type UserTicketEstimateReportType = {
  actualEstimate: number;
  estimate: number;
  ticketId: string;
  userId: string;
  estimateTime: number;
};

export const getReportOfUserHelper = async (
  pokerboard: Pokerboard | undefined,
  user: User,
  userRole: UserPokerboard | undefined
): Promise<any> => {
  try {
    if (!pokerboard || !userRole) {
      // fetch estimates of user.
      let report = await getUserGameReport(user);
      return report;
    } else if (
      userRole.role === RoleTypes.MANAGER ||
      userRole.role === RoleTypes.SPECTATOR
    ) {
      let report = await getEstimationReportOfPokerboard(pokerboard);
      return report;
    } else if (userRole.role === RoleTypes.PLAYER) {
      // get user estimate for a pokerboard
      let report = await getUserReportForAPokerboard(user, pokerboard);
      return report;
    }
  } catch (error) {
    throw error;
  }
};

export const getUserGameReport = async (user: User): Promise<ReportType> => {
  let allTicketsEstimate: UserTicketEstimateReportType[] = await getRepository(
    UserTicket
  )
    .createQueryBuilder('user_ticket')
    .where({
      userId: user.id,
      estimateTime: Not('NULL'),
    })
    .leftJoin(User, 'user', 'user.id = userId')
    .leftJoin(Ticket, 'ticket', 'ticket.id = ticketId')
    .select('ticket.estimate', 'actualEstimate')
    .addSelect('user_ticket.estimate', 'estimate')
    .addSelect('estimate_time', 'time')
    .addSelect('ticketId')
    .addSelect('userId')
    .orderBy('estimate_time', 'ASC')
    .getRawMany();

  return generateReportHelper(allTicketsEstimate, user);
};

export const getUserReportForAPokerboard = async (
  user: User,
  pokerboard: Pokerboard
): Promise<ReportType> => {
  let result: UserTicketEstimateReportType[] = await getRepository(UserTicket)
    .createQueryBuilder('user_ticket')
    .where({
      userId: user.id,
      estimateTime: Not('NULL'),
    })
    .leftJoin(User, 'user', 'user.id = userId')
    .leftJoin(Ticket, 'ticket', 'ticket.id = ticketId')
    .leftJoin(Pokerboard, 'pokerboard', 'pokerboard.id = ticket.pokerboardId')
    .andWhere('pokerboard.id = :pokerboard', {
      pokerboard: pokerboard.id,
    })
    .select('ticket.estimate', 'actualEstimate')
    .addSelect('pokerboard.id', 'pokerboardId')
    .addSelect('user_ticket.estimate', 'estimate')
    .addSelect('estimate_time', 'time')
    .addSelect('ticketId')
    .addSelect('userId')
    .orderBy('estimate_time', 'ASC')
    .getRawMany();

  return generateReportHelper(result, user);
};

export const generateReportHelper = (
  allTicketsEstimate: UserTicketEstimateReportType[],
  user: User
): ReportType => {
  let report: ReportType = {};

  for (let estimateDetail of allTicketsEstimate) {
    let playerEstimate: PlayerEstimateType = {
      estimate: estimateDetail.estimate,
      id: estimateDetail.userId,
      name: user.userName,
      time: estimateDetail.actualEstimate,
    };

    if (report[estimateDetail.ticketId]) {
      report[estimateDetail.ticketId].playersEstimate.push(playerEstimate);
    } else {
      report[estimateDetail.ticketId] = {
        actualEstimate: estimateDetail.actualEstimate,
        playersEstimate: [playerEstimate],
      };
    }
  }
  return report;
};
