import { FindManyOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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

export const findInvites = async (
  findOptions: FindManyOptions<UserInviteToPokerboard>,
): Promise<UserInviteToPokerboard[]> => {
  const userInviteRepository = customGetRepository(UserInviteToPokerboard);
  return userInviteRepository.find(findOptions);
};

export const updateInvites = async (
  findOptions: FindOptionsWhere<UserInviteToPokerboard>,
  dataToUpdate: QueryDeepPartialEntity<UserInviteToPokerboard>,
): Promise<UpdateResult> => {
  const userInviteRepository = customGetRepository(UserInviteToPokerboard);
  return userInviteRepository.update(findOptions, dataToUpdate);
};
