import { GameErrors, SocketConstants } from '../constants/game';
import { findPokerboard } from '../entity/pokerboard/repository';
import { findToken, saveToken } from '../entity/token/repository';
import { findUserPokerboard } from '../entity/userPokerboard/repository';

export const authVerification = async (token: string): Promise<boolean> => {
  if (!token) {
    return false;
  }
  const savedToken = await findToken({ isActive: true, id: token });
  const currentDate = new Date();

  if (!savedToken || savedToken.expiryDate <= currentDate) {
    if (savedToken) {
      savedToken.isActive = false;
      await saveToken(savedToken);
    }
    return false;
  }
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const socketValidation = async (socket: any, next: any) => {
  const token = socket.handshake.auth.token;
  if (await authVerification(token)) {
    socket[SocketConstants.AUTH_ID] = token;
    next();
  } else {
    next(new Error(GameErrors.INVALID_TOKEN));
  }
};

export const userVerification = async (token: string, pokerboardId: string) => {
  const savedToken = await findToken({ isActive: true, id: token });
  const savedUser = await savedToken.user;
  const savedPokerboard = await findPokerboard({ where: { id: pokerboardId } });

  if (savedUser && savedPokerboard) {
    const userPokerboard = await findUserPokerboard({
      where: { userId: savedUser.id, pokerboardId: savedPokerboard.id },
    });
    if (userPokerboard) {
      return {
        role: userPokerboard.role,
        pokerboard: savedPokerboard,
        user: savedUser,
      };
    }
  }

  return null;
};
