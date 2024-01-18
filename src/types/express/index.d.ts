import { Pokerboard } from '../../entity/pokerboard/model';
import { Token } from '../../entity/token/model';
import { User } from '../../entity/user/model';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
      token?: Token;
      pokerboard?: Pokerboard;
    }
  }
}
