import { InviteStatus, UserRoles } from '../../constants/enums';
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
