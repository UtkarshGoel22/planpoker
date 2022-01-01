import {
  getManager,
  getRepository,
  In,
  Like,
  QueryBuilder,
  SelectQueryBuilder,
} from 'typeorm';
import { ErrorMessage, Message, SuccessMessage } from '../constants/message';
import { User } from '../entity/User';
import { Group } from '../entity/Group';
import ResponseMessage from '../models/ResponseMessage';
import { sendMassMails } from '../services/sendMail';
import { ErrorTypes } from '../constants/errorType';
import { ErrorInterface } from '../models/ErrorInterface';

export interface RegisterUserProps {
  name: string;
  admin: string;
  members: string[];
}

export type userGroupData = {
  id: string;
  name: string;
  admin: string;
  countOfMembers: number;
  members: string[];
};

export const createGroupDB = async (
  details: RegisterUserProps,
  responseMessage: ResponseMessage
) => {
  let errData: any = {};
  let err: ErrorInterface = {
    message: '',
    errData,
  };
  const groupRepository = getRepository(Group);
  let newGroup = groupRepository.create();

  newGroup.name = details.name;
  newGroup.admin = details.admin;
  newGroup.countOfMembers = details.members.length;

  // finding users that need to be added to group
  let users = await getRepository(User).find({
    id: In(details.members),
  });

  if (users.length == 0) {
    err.message = ErrorMessage.USERS_NOT_FOUND;
    err.errData[ErrorTypes.MEMBERS] = ErrorMessage.USERS_NOT_FOUND;
    throw err;
  }

  newGroup.users = Promise.resolve(users);
  let saveResult = await groupRepository.save(newGroup);

  if (saveResult) {
    // find the group admin
    let admin = users.find((user) => user.id === details.admin);

    // find emails of all users except admin
    let emails = users
      .filter((user) => user.id !== details.admin)
      .map((user) => user.email);
    responseMessage.success = true;
    responseMessage.message = SuccessMessage.SAVE_GROUP_SUCCESSFUL;
    responseMessage.data = newGroup;

    sendGroupInvites(
      emails,
      details.name,
      admin.firstName,
      admin.lastName,
      admin.email
    );

    return { responseMessage };
  } else {
    err.message = ErrorMessage.SOMETHING_WENT_WRONG;
    err.errData[ErrorTypes.SOME_THING_WENT_WRONG] =
      ErrorMessage.SOMETHING_WENT_WRONG;
    throw err;
  }
};

/**
 *
 * @param res Response object
 * @param responseMessage Response message to send
 * @param emails Array of email ids
 * @param groupName Name of the group
 * @param adminFirstName First name of admin
 * @param adminLastName Last name of admin
 * @param adminEmail Email of admin
 */
export async function sendGroupInvites(
  emails: string[],
  groupName: string,
  adminFirstName: string,
  adminLastName: string,
  adminEmail: string
) {
  sendMassMails({
    message: Message.addedToGroup(
      groupName,
      adminFirstName,
      adminLastName,
      adminEmail
    ),
    to: emails,
    subject: SuccessMessage.ADD_TO_GROUP_SUBJECT,
  });
}

/**
 *
 * @param searchQuery Search query
 * @returns Promise<Group[]>
 */
export const findGroup = async (
  searchQuery: string,
  limit: number = 10
): Promise<Group[]> => {
  const groupRepository = getRepository(Group);
  const groups = await groupRepository.find({
    where: [
      {
        isActive: true,
        name: Like(`${searchQuery}%`),
      },
    ],
    select: ['admin', 'name', 'countOfMembers', 'id'],
    take: limit,
  });
  return groups;
};

export const getGroupDetailsAssociatedWithUser = async (groupIds: string[]) => {
  const groupsData = await getManager()
    .createQueryBuilder(Group, 'group')
    .where({
      id: In(groupIds),
    })
    .select('name')
    .leftJoin(User, 'user', 'user.id = admin')
    .leftJoin('group.users', 'members')
    .addSelect('members.user_name', 'member')
    .addSelect('group.id', 'id')
    .addSelect('user.user_name', 'admin')
    .addSelect('name')
    .addSelect('count_of_members', 'countOfMembers')
    .addSelect('')
    .orderBy('group.updated_at', 'DESC')
    .getRawMany();
  return groupsData;
};
