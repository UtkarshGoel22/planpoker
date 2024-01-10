import * as argon2 from 'argon2';

import { ErrorMessages, LogMessages } from '../constants/message';
import config from '../settings/config';
import { StatusCodes } from 'http-status-codes';

export const argon2IdHasher = async (data: string | Buffer): Promise<string> => {
  return argon2.hash(data, {
    salt: Buffer.from(config.ARGON2ID_SALT, 'utf-8'),
    type: argon2.argon2id,
  });
};

export const comparePassword = async (password: string, savedPassword: string) => {
  let errorData: object;
  let passwordMatch: boolean;

  try {
    passwordMatch = await argon2.verify(savedPassword, password, {
      salt: Buffer.from(config.ARGON2ID_SALT, 'utf-8'),
      type: argon2.argon2id,
    });
  } catch (error) {
    console.log(LogMessages.PASSWORD_VERIFICATION_FAILURE, error);
    errorData = { somethingWentWrong: ErrorMessages.SOMETHING_WENT_WRONG };
    throw {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.SOMETHING_WENT_WRONG,
      data: errorData,
    };
  }

  if (!passwordMatch) {
    errorData = { password: ErrorMessages.INCORRECT_EMAIL_OR_PASSWORD };
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: ErrorMessages.INCORRECT_EMAIL_OR_PASSWORD,
      data: errorData,
    };
  }
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
