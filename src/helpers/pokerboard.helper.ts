import { EmailSubject } from '../constants/enums';
import { EmailMessages, ErrorMessages } from '../constants/message';
import { Pokerboard } from '../entity/pokerboard/model';
import { createPokerboardInvites } from '../entity/pokerboardInvite/repository';
import { User } from '../entity/user/model';
import { createPokerboardSchema } from '../schemas/pokerboard.schema';
import { validateData } from '../utils/common';
import { sendBulkMails } from '../utils/notification';

export const sendInvitationMailToUnregisteredUsers = async (
  unregisteredUserEmails: string[],
  pokerboard: Pokerboard,
) => {
  if (unregisteredUserEmails.length === 0) {
    return;
  }
  await createPokerboardInvites(unregisteredUserEmails, pokerboard);
  sendBulkMails(
    EmailSubject.SIGN_UP_TO_JOIN_POKERBOARD,
    EmailMessages.INVITE_FOR_SIGN_UP(pokerboard.name),
    unregisteredUserEmails,
  );
};

export const sendInvitationMailToVerifiedUsers = async (users: User[], pokerboard: Pokerboard) => {
  const receiverEmails = users
    .filter((user) => user.id !== pokerboard.manager)
    .map((user) => user.email);
  sendBulkMails(
    EmailSubject.POKERBOARD_INVITE,
    EmailMessages.POKERBOARD_INVITATION(pokerboard.name, pokerboard.id),
    receiverEmails,
  );
};

export const validateCreatePokerboardData = (data: object) => {
  try {
    return validateData(createPokerboardSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
