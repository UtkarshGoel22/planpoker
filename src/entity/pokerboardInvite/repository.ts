import customGetRepository from '../../utils/db';
import { Pokerboard } from '../pokerboard/model';
import { UserInviteToPokerboard } from './model';

export const createPokerboardInvites = async (
  unregisteredUserEmails: string[],
  pokerboard: Pokerboard,
) => {
  const userInviteRepository = customGetRepository(UserInviteToPokerboard);
  const invitees: UserInviteToPokerboard[] = [];
  unregisteredUserEmails.forEach((email) => {
    const userInvite = userInviteRepository.create();
    userInvite.email = email;
    userInvite.pokerboard = Promise.resolve(pokerboard);
    invitees.push(userInvite);
  });
  await userInviteRepository.save(invitees);
};
