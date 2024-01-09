import * as argon2 from 'argon2';

import { ErrorMessages, LogMessages } from '../constants/message';
import config from '../settings/config';

export const argon2IdHasher = async (data: string | Buffer): Promise<string> => {
  return argon2.hash(data, {
    salt: Buffer.from(config.ARGON2ID_SALT, 'utf-8'),
    type: argon2.argon2id,
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await argon2IdHasher(password);
  } catch (error) {
    console.log(LogMessages.PASSWORD_HASHING_FAILURE, error);
    const errorData = { somethingWentWrong: ErrorMessages.SOMETHING_WENT_WRONG };
    throw { message: ErrorMessages.SOMETHING_WENT_WRONG, data: errorData };
  }
};
