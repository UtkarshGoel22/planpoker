import { FindManyOptions, In } from 'typeorm';

import customGetRepository from '../../utils/db';
import { CreatePokerboard } from '../../types';
import { Group } from '../group/model';
import { findGroups } from '../group/repository';
import { User } from '../user/model';
import { findUsers } from '../user/repository';
import { Pokerboard } from './model';
import { PokerBoardStatus } from '../../constants/enums';
import { createUserPokerBoards } from '../userPokerboard/repository';
import {
  sendInvitationMailToUnregisteredUsers,
  sendInvitationMailToVerifiedUsers,
} from '../../helpers/pokerboard.helper';

export const createPokerboard = async (data: CreatePokerboard) => {
  const usersSet = new Set<string>();
  const unregisteredUserEmails: string[] = [];

  data.users.forEach((user) => {
    if (user.id === 'unregistered') {
      unregisteredUserEmails.push(user.email);
    } else {
      usersSet.add(user.id);
    }
  });
  usersSet.add(data.manager);

  const findGroupsOptions: FindManyOptions<Group> = {
    where: { id: In(data.groups) },
    relations: ['users'],
  };
  const groups = await findGroups(findGroupsOptions);
  groups.forEach(async (group) => {
    const groupMembers = await group.users;
    groupMembers.forEach((member) => {
      usersSet.add(member.id);
    });
  });

  const pokerboardRepository = customGetRepository(Pokerboard);
  const newPokerboard = pokerboardRepository.create({
    manager: data.manager,
    name: data.name,
    deckType: data.deckType,
    status: PokerBoardStatus.CREATED,
  });
  newPokerboard.groups = Promise.resolve(groups);
  await pokerboardRepository.save(newPokerboard);

  const findUsersOptions: FindManyOptions<User> = { where: { id: In(Array.from(usersSet)) } };
  const users = await findUsers(findUsersOptions);
  await createUserPokerBoards(users, newPokerboard);

  sendInvitationMailToVerifiedUsers(users, newPokerboard);
  sendInvitationMailToUnregisteredUsers(unregisteredUserEmails, newPokerboard);

  return newPokerboard;
};
