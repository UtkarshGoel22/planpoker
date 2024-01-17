import { UserRoles } from '../constants/enums';
import {
  ClientEvents,
  GameErrors,
  ServerEvents,
  SocketConstants,
  TimeConstants,
  TimerStatus,
} from '../constants/game';
import { getTicketsDetails } from '../entity/ticket/repository';
import { userVerification } from '../middlewares/socket.io.midleware';
import { io } from '../server';
import { importComments } from '../utils/jira';

let gameInfo: GameInfo = {};

export const game = () => {
  io.on(ServerEvents.CONNECTION, (socket) => {
    console.log('Connected to socket.io');

    // eslint-disable-next-line @typescript-eslint/ban-types
    socket.on(ServerEvents.JOIN_GAME, async (pokerboardId: string, callback: Function) =>
      joinGame(socket, pokerboardId, callback),
    );

    socket.on(ServerEvents.DISCONNECTING, async () => beforeDisconnect(socket));
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const beforeDisconnect = async (socket: any) => {
  const pokerboardId = socket[SocketConstants.POKERBOARD_ID];

  if (socket[SocketConstants.ROLE] === UserRoles.MANAGER) {
    gameInfo[pokerboardId].isManagerPresent = false;
    setTimeout(() => {
      if (!gameInfo[pokerboardId].isManagerPresent) {
        io.to(pokerboardId).emit(ClientEvents.MANAGER_LEFT);
      }
    }, TimeConstants.DISCONNECT_MANAGER_TIME);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
const joinGame = async (socket: any, pokerboardId: string, callback: Function) => {
  socket[SocketConstants.POKERBOARD_ID] = pokerboardId;
  const token = socket[SocketConstants.AUTH_ID];
  const userVerifyResult = await userVerification(token, pokerboardId);

  if (userVerifyResult) {
    const { role, pokerboard, user } = userVerifyResult;
    socket[SocketConstants.ROLE] = role;
    socket[SocketConstants.USER_ID] = user.id;
    const tickets = await getTicketsDetails(pokerboard);

    if (tickets.length === 0) {
      io.to(socket.id).emit(ClientEvents.GAME_ERROR, {
        ticket: GameErrors.NO_TICKETS,
      });
    } else {
      if (!gameInfo[pokerboardId]) {
        gameInfo[pokerboardId] = {
          isManagerPresent: false,
          tickets,
          currentTicketIndex: 0,
          timerDuration: TimeConstants.TIMER_DURATION,
          timerStatus: TimerStatus.NOT_STARTED,
          gameTicketInfo: {},
        };
      }

      socket.join(pokerboardId);

      const index = gameInfo[pokerboardId].currentTicketIndex;
      const currentTicketId = tickets[index].id;
      const comments = await importComments(currentTicketId);
      let currentTicketPlayerEstimate = [];

      if (gameInfo[pokerboardId].gameTicketInfo[currentTicketId]?.playerEstimates) {
        currentTicketPlayerEstimate = Object.values(
          gameInfo[pokerboardId].gameTicketInfo[currentTicketId].playerEstimates,
        );
      }

      callback({
        role: role,
        comments: comments,
        userEmail: user.email,
        userName: user.username,
        currentTicket: tickets[index],
        timerStatus: gameInfo[pokerboardId].timerStatus,
        timerDuration: gameInfo[pokerboardId].timerDuration,
        currentTicketPlayerEstimate: currentTicketPlayerEstimate,
        isManagerPresent: gameInfo[pokerboardId].isManagerPresent,
      });

      if (role == UserRoles.MANAGER) {
        gameInfo[pokerboardId].isManagerPresent = true;
        io.to(pokerboardId).emit(ClientEvents.MANAGER_JOINED);
      }
    }
  } else {
    io.to(socket.id).emit(ClientEvents.GAME_ERROR, {
      user: GameErrors.INVALID_USER,
    });
  }
};
