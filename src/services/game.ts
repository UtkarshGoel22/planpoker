import { io } from '../app';
import {
  ClientEvent,
  GameError,
  gameInfoType,
  ServerEvent,
  SocketConstant,
  Time,
} from '../constants/game';
import { PokerBoardStatus, RoleTypes, TimerStatus } from "../constants/customTypes";
import { userVerify } from '../middlewares/socket.io.validation';
import { getTicketDetails } from '../repositories/pokerBoard.repository';
import { saveTicketEstimateDB } from '../repositories/ticket.repository';
import { getUserById } from '../repositories/user.repository';
import { addCommentOnJira, importComments } from './jiraComments';
import { addEstimateOnJira } from './jiraEstimates';
import {
  updatePokerboardStatus,
  updateUnestimatedTicketsAndPokerboardStatus,
} from './pokerboard';
import { updateTicketOrder } from './tickets';

let gameInfo: gameInfoType = {};

export function game() {
  io.on(ServerEvent.CONNECTION, (socket) => {
    console.log('connected to socket.io');

    socket.on(
      ServerEvent.JOIN_GAME,
      async (pokerboardId: string, callback: Function) =>
        joinGame(socket, pokerboardId, callback)
    );

    socket.on(ServerEvent.DISCONNECTING, async () => beforeDisconnect(socket));

    socket.on(ClientEvent.LEAVE_GAME, () => {
      const pokerboardId = socket[SocketConstant.POKERBOARD_ID];
      socket.leave(pokerboardId);
    });

    socket.on(ServerEvent.START_TIMER, async () => startTimer(socket));

    socket.on(ServerEvent.NEXT_TICKET, async () => nextTicket(socket));

    socket.on(ServerEvent.END_GAME, async () => endGame(socket));

    socket.on(ServerEvent.SKIP_TICKET, async () => skipTicket(socket));

    socket.on(ServerEvent.ADD_COMMENT, async (comment: string) =>
      addComment(socket, comment)
    );

    socket.on(
      ServerEvent.SET_ESTIMATE,
      async (estimateValue: number, timerValue?: number) =>
        setEstimate(socket, estimateValue, timerValue)
    );
  });
}

const joinGame = async (
  socket: any,
  pokerboardId: string,
  callback: Function
) => {
  socket[SocketConstant.POKERBOARD_ID] = pokerboardId;
  const token = socket[SocketConstant.AUTH_ID];
  const userVerifyResult = await userVerify(token, pokerboardId);

  if (userVerifyResult) {
    const { role, pokerboard, user } = userVerifyResult;
    socket[SocketConstant.ROLE] = role;
    socket[SocketConstant.USER_ID] = user.id;
    let tickets = await getTicketDetails(pokerboard);

    if (tickets.length === 0) {
      io.to(socket.id).emit(ClientEvent.GAME_ERROR, {
        ticket: GameError.NO_TICKETS,
      });
    } else {
      if (!gameInfo[pokerboardId]) {
        gameInfo[pokerboardId] = {
          isManagerPresent: false,
          tickets,
          currentTicketIndex: 0,
          timerDuration: Time.TIMER_DURATION,
          timerStatus: TimerStatus.NOT_STARTED,
          gameTicketInfo: {},
        };
      }

      socket.join(pokerboardId);

      let index = gameInfo[pokerboardId].currentTicketIndex;
      let currentTicketId = tickets[index].id;
      let comments = await importComments(currentTicketId);
      let currentTicketPlayerEstimate = [];

      if (
        gameInfo[pokerboardId].gameTicketInfo[currentTicketId]?.playerEstimates
      ) {
        currentTicketPlayerEstimate = Object.values(
          gameInfo[pokerboardId].gameTicketInfo[currentTicketId].playerEstimates
        );
      }

      callback({
        role: role,
        comments: comments,
        userEmail: user.email,
        userName: user.userName,
        currentTicket: tickets[index],
        timerStatus: gameInfo[pokerboardId].timerStatus,
        timerDuration: gameInfo[pokerboardId].timerDuration,
        currentTicketPlayerEstimate: currentTicketPlayerEstimate,
        isManagerPresent: gameInfo[pokerboardId].isManagerPresent,
      });

      if (role == RoleTypes.MANAGER) {
        gameInfo[pokerboardId].isManagerPresent = true;
        io.to(pokerboardId).emit(ClientEvent.MANAGER_JOINED);
      }
    }
  } else {
    io.to(socket.id).emit(ClientEvent.GAME_ERROR, {
      user: GameError.INVALID_USER,
    });
  }
};

const beforeDisconnect = async (socket: any) => {
  const pokerboardId = socket[SocketConstant.POKERBOARD_ID];

  if (socket[SocketConstant.ROLE] === RoleTypes.MANAGER) {
    gameInfo[pokerboardId].isManagerPresent = false;
    setTimeout(() => {
      if (!gameInfo[pokerboardId].isManagerPresent) {
        io.to(pokerboardId).emit(ClientEvent.MANAGER_LEFT);
      }
    }, Time.DISCONNECT_MANAGER_TIME);
  }
};

const startTimer = async (socket: any) => {
  const pokerboardId = socket[SocketConstant.POKERBOARD_ID];

  if (socket[SocketConstant.ROLE] === RoleTypes.MANAGER) {
    gameInfo[pokerboardId].timerStatus = TimerStatus.STARTED;

    updatePokerboardStatus(pokerboardId, PokerBoardStatus.STARTED);

    io.to(pokerboardId).emit(ClientEvent.TIMER_STARTED);

    let countdown = setInterval(() => {
      gameInfo[pokerboardId].timerDuration--;
      io.to(pokerboardId).emit(
        ClientEvent.TIMER,
        gameInfo[pokerboardId].timerDuration
      );
      if (gameInfo[pokerboardId].timerDuration === 0) {
        gameInfo[pokerboardId].timerStatus = TimerStatus.ENDED;
        io.to(pokerboardId).emit(ClientEvent.TIMER_ENDED);
        clearInterval(countdown);
      }
    }, Time.ONE_SECOND);
  } else {
    accessDenied(socket);
  }
};

const nextTicket = async (socket: any) => {
  const pokerboardId = socket[SocketConstant.POKERBOARD_ID];

  if (socket[SocketConstant.ROLE] === RoleTypes.MANAGER) {
    let currentGame = gameInfo[pokerboardId];
    let currentTicketIndex = currentGame.currentTicketIndex;
    let tickets = currentGame.tickets;

    if (currentTicketIndex == tickets.length - 1) {
      io.to(pokerboardId).emit(ClientEvent.GAME_ERROR, {
        ticket: GameError.LAST_TICKET,
      });
    } else {
      gameInfo[pokerboardId].currentTicketIndex++;
      gameInfo[pokerboardId].timerDuration = Time.TIMER_DURATION;
      gameInfo[pokerboardId].timerStatus = TimerStatus.NOT_STARTED;

      let currentTicketId = tickets[++currentTicketIndex].id;
      let comments = await importComments(currentTicketId);

      io.to(pokerboardId).emit(ClientEvent.CURRENT_TICKET, {
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

const endGame = async (socket: any) => {
  const role = socket[SocketConstant.ROLE];
  if (role == RoleTypes.MANAGER) {
    const pokerboardId = socket[SocketConstant.POKERBOARD_ID];
    updateUnestimatedTicketsAndPokerboardStatus(
      gameInfo[pokerboardId].tickets,
      gameInfo[pokerboardId].currentTicketIndex,
      pokerboardId,
      PokerBoardStatus.ENDED
    );
    io.to(pokerboardId).emit(ClientEvent.END_GAME);
  } else {
    accessDenied(socket);
  }
};

const skipTicket = async (socket: any) => {
  const pokerboardId = socket[SocketConstant.POKERBOARD_ID];
  const currentGame = gameInfo[pokerboardId];
  let tickets = currentGame.tickets;
  const currentTicketIndex = currentGame.currentTicketIndex;
  if (currentTicketIndex === tickets.length - 1) {
    io.to(socket.id).emit(ClientEvent.GAME_ERROR, {
      ticket: GameError.LAST_TICKET_SKIP,
    });
  } else {
    const len = tickets.length;
    let currentTicket = currentGame.tickets[currentTicketIndex];
    tickets[currentTicketIndex].order = tickets[len - 1].order + 1;

    updateTicketOrder(
      tickets[currentTicketIndex].id,
      tickets[currentTicketIndex].order
    );

    tickets.splice(currentTicketIndex, 1);
    tickets.push(currentTicket);

    gameInfo[pokerboardId].timerDuration = Time.TIMER_DURATION;
    gameInfo[pokerboardId].timerStatus = TimerStatus.NOT_STARTED;
    gameInfo[pokerboardId].tickets = tickets;

    let comments = await importComments(tickets[currentTicketIndex].id);

    io.to(pokerboardId).emit(ClientEvent.SKIP_TICKET, {
      currentTicket: tickets[currentTicketIndex],
      comments,
      timerDuration: gameInfo[pokerboardId].timerDuration,
      TimerStatus: gameInfo[pokerboardId].timerStatus,
      tickets,
    });
  }
};

const addComment = async (socket: any, comment: string) => {
  const pokerboardId = socket[SocketConstant.POKERBOARD_ID];

  if (socket[SocketConstant.ROLE] === RoleTypes.MANAGER) {
    const pokerboardId = socket[SocketConstant.POKERBOARD_ID];
    const currentTicketIndex = gameInfo[pokerboardId].currentTicketIndex;
    const currentTicketId =
      gameInfo[pokerboardId].tickets[currentTicketIndex].id;

    const result = await addCommentOnJira(currentTicketId, comment);

    if (result) {
      io.to(pokerboardId).emit(ClientEvent.COMMENT_ADDED, comment);
    } else {
      io.to(socket.id).emit(ClientEvent.GAME_ERROR, {
        comment: GameError.JIRA_COMMENT,
      });
    }
  } else {
    accessDenied(socket);
  }
};

const setEstimate = async (
  socket: any,
  estimateValue: number,
  timerValue?: number
) => {
  const pokerboardId = socket[SocketConstant.POKERBOARD_ID];
  const currentTicketIndex = gameInfo[pokerboardId].currentTicketIndex;
  const currentTicketId = gameInfo[pokerboardId].tickets[currentTicketIndex].id;

  if (!gameInfo[pokerboardId].gameTicketInfo[currentTicketId]) {
    gameInfo[pokerboardId].gameTicketInfo[currentTicketId] = {
      estimate: undefined,
      playerEstimates: {},
    };
  }

  if (socket[SocketConstant.ROLE] === RoleTypes.MANAGER) {
    gameInfo[pokerboardId].gameTicketInfo[currentTicketId].estimate =
      estimateValue;

    gameInfo[pokerboardId].tickets[currentTicketIndex].estimate = estimateValue;

    let playerEstimates =
      gameInfo[pokerboardId].gameTicketInfo[currentTicketId].playerEstimates;

    saveTicketEstimateDB({
      ticketId: currentTicketId,
      managerId: socket[SocketConstant.USER_ID],
      estimate: estimateValue,
      playerEstimates,
    });

    const addEstimateResult = await addEstimateOnJira(
      currentTicketId,
      estimateValue
    );

    if (addEstimateResult) {
      io.to(pokerboardId).emit(ClientEvent.MANAGER_ESTIMATE, estimateValue);
    } else {
      io.to(socket.id).emit(ClientEvent.GAME_ERROR, {
        estimate: GameError.JIRA_ESTIMATE,
      });
    }
  } else if (socket[SocketConstant.ROLE] === RoleTypes.PLAYER) {
    const user = await getUserById(socket[SocketConstant.USER_ID]);
    const username = user.userName;

    gameInfo[pokerboardId].gameTicketInfo[currentTicketId].playerEstimates[
      socket[SocketConstant.USER_ID]
    ] = {
      estimate: estimateValue,
      userName: username,
      timeTaken: Time.TIMER_DURATION - timerValue,
    };

    io.to(pokerboardId).emit(ClientEvent.PLAYER_ESTIMATE, {
      estimate: estimateValue,
      userName: username,
      id: user.id,
    });
  }
};

const accessDenied = async (socket: any) => {
  io.to(socket.id).emit(ClientEvent.GAME_ERROR, {
    accessDenied: GameError.ACCESS_DENIED,
  });
};
