import { In, Not } from 'typeorm';

import { EmailSubject, PokerboardStatus } from '../constants/enums';
import { EmailMessages, ErrorMessages } from '../constants/message';
import { findPokerboards } from '../entity/pokerboard/repository';
import { findInvites, updateInvites } from '../entity/pokerboardInvite/repository';
import { createUserPokerboards } from '../entity/userPokerboard/repository';
import { findUser } from '../entity/user/repository';
import {
  LoginSchema,
  RegistrationSchema,
  UserReverificationSchema,
  UserUpdationSchema,
  UserVerificationSchema,
} from '../schemas/user.schema';
import { validateData } from '../utils/common';
import { sendMail } from '../utils/notification';

export const updatePendingInvitesToPokerboards = async (email: string) => {
  const user = await findUser({ email });
  const invites = await findInvites({ where: { isVerified: false, email: user.email } });
  if (!invites || invites.length == 0) {
    return;
  }

  const pokerboards = await findPokerboards({
    where: {
      id: In(invites.map((invite) => invite.pokerboardId)),
      status: Not(PokerboardStatus.ENDED),
    },
  });
  await createUserPokerboards([user], pokerboards);
  await updateInvites({ id: In(invites.map((invite) => invite.id)) }, { isVerified: true });

  pokerboards.forEach((pokerboard) => {
    sendMail(
      EmailSubject.POKERBOARD_INVITE,
      EmailMessages.POKERBOARD_INVITATION(pokerboard.name, pokerboard.id),
      user.email,
    );
  });
};

export const validateUserLoginData = (data: object) => {
  try {
    return validateData(LoginSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INCORRECT_EMAIL_OR_PASSWORD, data: error.data };
  }
};

export const validateUserRegistrationData = (data: object) => {
  try {
    return validateData(RegistrationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateUserReverificationData = (data: object) => {
  try {
    return validateData(UserReverificationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateUserUpdationData = (data: object) => {
  try {
    return validateData(UserUpdationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateUserVerificationData = (data: object) => {
  try {
    return validateData(UserVerificationSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
