import { PokerboardStatus, UserRoles } from '../constants/enums';
import {
  ClientEvents,
  GameErrors,
  ServerEvents,
  SocketConstants,
  TimeConstants,
  TimerStatus,
} from '../constants/game';
import { findAndUpdatePokerboard } from '../entity/pokerboard/repository';
import { findAndUpdateTicket, getTicketsDetails } from '../entity/ticket/repository';
import { updateUnestimatedTicketsAndPokerboardStatus } from '../helpers/pokerboard.helper';
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

    socket.on(ClientEvents.LEAVE_GAME, () => {
      const pokerboardId = socket[SocketConstants.POKERBOARD_ID];
      socket.leave(pokerboardId);
    });

    socket.on(ServerEvents.START_TIMER, async () => startTimer(socket));

    socket.on(ServerEvents.NEXT_TICKET, async () => nextTicket(socket));

    socket.on(ServerEvents.END_GAME, async () => endGame(socket));

    socket.on(ServerEvents.SKIP_TICKET, async () => skipTicket(socket));
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
      io.to(socket.id).emit(ClientEvents.GAME_ERROR, { ticket: GameErrors.NO_TICKETS });
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
    io.to(socket.id).emit(ClientEvents.GAME_ERROR, { user: GameErrors.INVALID_USER });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const startTimer = async (socket: any) => {
  const pokerboardId = socket[SocketConstants.POKERBOARD_ID];

  if (socket[SocketConstants.ROLE] === UserRoles.MANAGER) {
    gameInfo[pokerboardId].timerStatus = TimerStatus.STARTED;

    findAndUpdatePokerboard({ id: pokerboardId }, { status: PokerboardStatus.STARTED });

    io.to(pokerboardId).emit(ClientEvents.TIMER_STARTED);

    const countdown = setInterval(() => {
      gameInfo[pokerboardId].timerDuration--;
      io.to(pokerboardId).emit(ClientEvents.TIMER, gameInfo[pokerboardId].timerDuration);
      if (gameInfo[pokerboardId].timerDuration === 0) {
        gameInfo[pokerboardId].timerStatus = TimerStatus.ENDED;
        io.to(pokerboardId).emit(ClientEvents.TIMER_ENDED);
        clearInterval(countdown);
      }
    }, TimeConstants.ONE_SECOND);
  } else {
    accessDenied(socket);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextTicket = async (socket: any) => {
  const pokerboardId = socket[SocketConstants.POKERBOARD_ID];

  if (socket[SocketConstants.ROLE] === UserRoles.MANAGER) {
    const currentGame = gameInfo[pokerboardId];
    let currentTicketIndex = currentGame.currentTicketIndex;
    const tickets = currentGame.tickets;

    if (currentTicketIndex == tickets.length - 1) {
      io.to(pokerboardId).emit(ClientEvents.GAME_ERROR, {
        ticket: GameErrors.LAST_TICKET,
      });
    } else {
      gameInfo[pokerboardId].currentTicketIndex++;
      gameInfo[pokerboardId].timerDuration = TimeConstants.TIMER_DURATION;
      gameInfo[pokerboardId].timerStatus = TimerStatus.NOT_STARTED;

      const currentTicketId = tickets[++currentTicketIndex].id;
      const comments = await importComments(currentTicketId);

      io.to(pokerboardId).emit(ClientEvents.CURRENT_TICKET, {
        currentTicket: gameInfo[pokerboardId].tickets[currentTicketIndex],
        comments,
        timerDuration: gameInfo[pokerboardId].timerDuration,
        timerStatus: gameInfo[pokerboardId].timerStatus,
      });
    }
  } else {
    accessDenied(socket);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const endGame = async (socket: any) => {
  const role = socket[SocketConstants.ROLE];
  if (role == UserRoles.MANAGER) {
    const pokerboardId = socket[SocketConstants.POKERBOARD_ID];
    updateUnestimatedTicketsAndPokerboardStatus(
      gameInfo[pokerboardId].tickets,
      gameInfo[pokerboardId].currentTicketIndex,
      pokerboardId,
      PokerboardStatus.ENDED,
    );
    io.to(pokerboardId).emit(ClientEvents.END_GAME);
  } else {
    accessDenied(socket);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const skipTicket = async (socket: any) => {
  const pokerboardId = socket[SocketConstants.POKERBOARD_ID];
  const currentGame = gameInfo[pokerboardId];
  const tickets = currentGame.tickets;
  const currentTicketIndex = currentGame.currentTicketIndex;
  if (currentTicketIndex === tickets.length - 1) {
    io.to(socket.id).emit(ClientEvents.GAME_ERROR, {
      ticket: GameErrors.LAST_TICKET_SKIP,
    });
  } else {
    const len = tickets.length;
    const currentTicket = currentGame.tickets[currentTicketIndex];
    tickets[currentTicketIndex].order = tickets[len - 1].order + 1;

    findAndUpdateTicket(
      { id: tickets[currentTicketIndex].id },
      { order: tickets[currentTicketIndex].order },
    );

    tickets.splice(currentTicketIndex, 1);
    tickets.push(currentTicket);

    gameInfo[pokerboardId].timerDuration = TimeConstants.TIMER_DURATION;
    gameInfo[pokerboardId].timerStatus = TimerStatus.NOT_STARTED;
    gameInfo[pokerboardId].tickets = tickets;

    const comments = await importComments(tickets[currentTicketIndex].id);

    io.to(pokerboardId).emit(ClientEvents.SKIP_TICKET, {
      currentTicket: tickets[currentTicketIndex],
      comments,
      timerDuration: gameInfo[pokerboardId].timerDuration,
      TimerStatus: gameInfo[pokerboardId].timerStatus,
      tickets,
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const accessDenied = async (socket: any) => {
  io.to(socket.id).emit(ClientEvents.GAME_ERROR, { accessDenied: GameErrors.ACCESS_DENIED });
};
