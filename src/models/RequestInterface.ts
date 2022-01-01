import { Request } from 'express';
import { Pokerboard } from '../entity/Pokerboard';
import { Token } from '../entity/Token';
import { User } from '../entity/User';
import { UserPokerboard } from '../entity/UserPokerboard';

export interface IRequest extends Request {
  user: User;
  token: Token;
  pokerboard?: Pokerboard;
  userRole?: UserPokerboard;
}
