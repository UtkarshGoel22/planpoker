import { FindManyOptions, FindOneOptions, In } from 'typeorm';

import { UNREGISTERED } from '../../constants/common';
import { PokerboardStatus } from '../../constants/enums';
import {
  sendInvitationMailToUnregisteredUsers,
  sendInvitationMailToVerifiedUsers,
} from '../../helpers/pokerboard.helper';
import { CreatePokerboard } from '../../types';
import customGetRepository from '../../utils/db';
import { Group } from '../group/model';
import { findGroups } from '../group/repository';
import { User } from '../user/model';
import { findUsers } from '../user/repository';
import { createUserPokerboards } from '../userPokerboard/repository';
import { Pokerboard } from './model';

export const createPokerboard = async (data: CreatePokerboard) => {
  const usersSet = new Set<string>();
  const unregisteredUserEmails: string[] = [];

  data.members.forEach((member) => {
    if (member.id === UNREGISTERED) {
      unregisteredUserEmails.push(member.email);
    } else {
      usersSet.add(member.id);
    }
  });
  usersSet.add(data.manager);

  const findGroupsOptions: FindManyOptions<Group> = {
    where: { id: In(data.groups) },
    relations: ['users'],
  };
  const groups = await findGroups(findGroupsOptions);
  for (const group of groups) {
    const groupMembers = await group.users;
    groupMembers.forEach((member) => {
      usersSet.add(member.id);
    });
  }

  const pokerboardRepository = customGetRepository(Pokerboard);
  const newPokerboard = pokerboardRepository.create({
    manager: data.manager,
    name: data.boardName,
    deckType: data.deckType,
    status: PokerboardStatus.CREATED,
  });
  newPokerboard.groups = Promise.resolve(groups);
  await pokerboardRepository.save(newPokerboard);

  const findUsersOptions: FindManyOptions<User> = { where: { id: In(Array.from(usersSet)) } };
  const users = await findUsers(findUsersOptions);
  await createUserPokerboards(users, [newPokerboard]);

  sendInvitationMailToVerifiedUsers(users, newPokerboard);
  sendInvitationMailToUnregisteredUsers(unregisteredUserEmails, newPokerboard);

  return newPokerboard;
};

export const findPokerboard = async (
  findOptions: FindOneOptions<Pokerboard>,
): Promise<Pokerboard> => {
  const pokerboardRepository = customGetRepository(Pokerboard);
  return pokerboardRepository.findOne(findOptions);
};

export const findPokerboards = async (
  findOptions: FindManyOptions<Pokerboard>,
): Promise<Pokerboard[]> => {
  const pokerboardRepository = customGetRepository(Pokerboard);
  return pokerboardRepository.find(findOptions);
};
