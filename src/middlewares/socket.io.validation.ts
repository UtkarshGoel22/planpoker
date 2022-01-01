import { getRepository, Not } from 'typeorm';
import { GameError, SocketConstant } from '../constants/game';
import { InviteStatus } from "../constants/customTypes";
import { Token } from '../entity/Token';
import { UserPokerboard } from '../entity/UserPokerboard';
import { getPokerboardById } from '../repositories/pokerBoard.repository';

export const socketValidation = async (socket: any, next: any) => {
  const token = socket.handshake.auth.token;
  if (await authVerify(token)) {
    socket[SocketConstant.AUTH_ID] = token;
    next();
  } else {
    next(new Error(GameError.INVALID_TOKEN));
  }
};

/**
 * Token validation middleware
 * @param token
 * @returns {Promise<boolean>} - true if token is valid else false
 */
export const authVerify = async (token: string): Promise<boolean> => {
  if (!token) {
    return false;
  }

  const savedToken = await getRepository(Token).findOne({
    where: { isActive: true, id: token },
  });

  const currentDate = new Date();

  if (!savedToken || savedToken.expiryDate <= currentDate) {
    if (savedToken) {
      savedToken.isActive = false;
      await getRepository(Token).save(savedToken);
    }
    return false;
  }

  return true;
};

/**
 * User and Pokerboard validation
 * @param token
 * @param pokerboardId
 * @returns
 */
export const userVerify = async (token: string, pokerboardId: string) => {
  const savedToken = await getRepository(Token).findOne({
    where: { isActive: true, id: token },
  });
  const savedUser = await savedToken.user;
  const savedPokerboard = await getPokerboardById(pokerboardId);

  if (savedUser && savedPokerboard) {
    const userPokerboard = await getRepository(UserPokerboard).findOne({
      where: {
        userId: savedUser.id,
        pokerboardId: savedPokerboard.id,
      },
    });

    if (userPokerboard) {
      return {
        role: userPokerboard.role,
        pokerboard: savedPokerboard,
        user: savedUser,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
};
