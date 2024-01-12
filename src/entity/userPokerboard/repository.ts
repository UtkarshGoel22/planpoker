import { InviteStatus } from '../../constants/enums';
import customGetRepository from '../../utils/db';
import { Pokerboard } from '../pokerboard/model';
import { User } from '../user/model';
import { UserPokerboard } from './model';

export const createUserPokerBoards = async (users: User[], pokerboard: Pokerboard) => {
  const userPokerboardRepository = customGetRepository(UserPokerboard);
  const userPokerBoards: UserPokerboard[] = [];

  users.forEach((user) => {
    const userPokerBoard = userPokerboardRepository.create();
    userPokerBoard.user = Promise.resolve(user);
    userPokerBoard.pokerboard = Promise.resolve(pokerboard);
    userPokerBoard.inviteStatus =
      user.id === pokerboard.manager ? InviteStatus.ACCEPTED : InviteStatus.PENDING;
    userPokerBoards.push(userPokerBoard);
  });

  await userPokerboardRepository.save(userPokerBoards);
};
