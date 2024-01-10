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
