import { FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import config from '../../settings/config';
import customGetRepository from '../../utils/db';
import { User } from '../user/model';
import { Token } from './model';

export const createToken = async (user: User): Promise<{ token: string }> => {
  const tokenRepository = customGetRepository(Token);
  const token = tokenRepository.create();
  token.user = Promise.resolve(user);
  token.expiryDate = new Date();
  token.expiryDate.setDate(token.expiryDate.getDate() + config.AUTH_TOKEN.EXPIRY);
  await tokenRepository.save(token);
  return { token: token.id };
};

export const findAndUpdateToken = async (
  findOptions: FindOptionsWhere<Token>,
  dataToUpdate: QueryDeepPartialEntity<Token>,
): Promise<UpdateResult> => {
  const tokenRepository = customGetRepository(Token);
  return tokenRepository.update(findOptions, dataToUpdate);
};

export const findToken = async (findOptions: FindOptionsWhere<Token>): Promise<Token> => {
  const tokenRepository = customGetRepository(Token);
  return tokenRepository.findOne({ where: findOptions });
};
