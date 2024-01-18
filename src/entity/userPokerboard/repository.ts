import { FindOneOptions } from 'typeorm';

import { InviteStatus, UserRoles } from '../../constants/enums';
import { UserDetails } from '../../types';
import customGetRepository from '../../utils/db';
import { Pokerboard } from '../pokerboard/model';
import { User } from '../user/model';
import { UserPokerboard } from './model';

export const createUserPokerboards = async (users: User[], pokerboards: Pokerboard[]) => {
  const userPokerboardRepository = customGetRepository(UserPokerboard);
  const userPokerBoards: UserPokerboard[] = [];

  users.forEach((user) => {
    pokerboards.forEach((pokerboard) => {
      const userPokerBoard = userPokerboardRepository.create();
      userPokerBoard.user = Promise.resolve(user);
      userPokerBoard.pokerboard = Promise.resolve(pokerboard);
      userPokerBoard.inviteStatus =
        user.id === pokerboard.manager ? InviteStatus.ACCEPTED : InviteStatus.PENDING;
      userPokerBoard.role = user.id === pokerboard.manager ? UserRoles.MANAGER : UserRoles.PLAYER;
      userPokerBoards.push(userPokerBoard);
    });
  });

  await userPokerboardRepository.save(userPokerBoards);
};

export const findUserPokerboard = async (
  findOptions: FindOneOptions<UserPokerboard>,
): Promise<UserPokerboard> => {
  const userPokerboardRepository = customGetRepository(UserPokerboard);
  return userPokerboardRepository.findOne(findOptions);
};

export const getUsersDetails = async (pokerboard: Pokerboard) => {
  const userPokerboards = (await pokerboard.userPokerboard).filter(
    (userPokerboard) => userPokerboard.isActive === true,
  );
  const usersDetails: UserDetails[] = [];

  for (const userPokerboard of userPokerboards) {
    const user = await userPokerboard.user;
    usersDetails.push({
      role: userPokerboard.role,
      userId: userPokerboard.userId,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      inviteStatus: userPokerboard.inviteStatus,
    });
  }

  return usersDetails;
};

export const saveUserPokerboard = async (
  userPokerboard: UserPokerboard,
): Promise<UserPokerboard> => {
  const userPokerboardRepository = customGetRepository(UserPokerboard);
  return userPokerboardRepository.save(userPokerboard);
};
