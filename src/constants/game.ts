import { Ticket } from '../entity/ticket/model';

export const ClientEvents = {
  COMMENT_ADDED: 'comment-added',
  CURRENT_TICKET: 'current-ticket',
  END_GAME: 'end-game',
  GAME_ERROR: 'game-error',
  LEAVE_GAME: 'leave-game',
  MANAGER_ESTIMATE: 'manager-estimate',
  MANAGER_JOINED: 'manager-joined',
  MANAGER_LEFT: 'manager-left',
  PLAYER_ESTIMATE: 'player-estimate',
  SKIP_TICKET: 'skip-ticket',
  TIMER: 'timer',
  TIMER_ENDED: 'timer-ended',
  TIMER_STARTED: 'timer-started',
};

export const GameErrors = {
  ACCESS_DENIED: `You don't of the access`,
  INVALID_TOKEN: 'Invalid Token',
  INVALID_USER: 'Invalid User',
  NO_TICKETS: 'You need to have atleast 1 ticket in pokerboard',
  LAST_TICKET: 'This is the last ticket',
  LAST_TICKET_SKIP: 'You cannot skip the last ticket',
  JIRA_COMMENT: 'Failed to add comment on JIRA',
  JIRA_ESTIMATE: 'Failed to add estimate on JIRA',
};

export const ServerEvents = {
  ADD_COMMENT: 'add-comment',
  CONNECTION: 'connection',
  DISCONNECTING: 'disconnecting',
  END_GAME: 'end-game',
  JOIN_GAME: 'join-game',
  NEXT_TICKET: 'next-ticket',
  SET_ESTIMATE: 'set-estimate',
  SKIP_TICKET: 'skip-ticket',
  START_TIMER: 'start-timer',
};

export const SocketConstants = {
  AUTH_ID: 'authId',
  POKERBOARD_ID: 'pokerboardId',
  ROLE: 'role',
  USER_ID: 'userId',
};

export const TimeConstants = {
  DISCONNECT_MANAGER_TIME: 30000,
  TIMER_DURATION: 10,
};

export const enum TimerStatus {
  STARTED = 'TIMER_STARTED',
  NOT_STARTED = 'NOT_STARTED',
  ENDED = 'TIMER_ENDED',
}

export type GameInfo = {
  [key: string]: {
    isManagerPresent: boolean;
    tickets: Ticket[];
    currentTicketIndex: number;
    timerDuration: number;
    timerStatus?: TimerStatus.NOT_STARTED | TimerStatus.STARTED | TimerStatus.ENDED;
    gameTicketInfo?: TicketInfo;
  };
};

export type PlayerEstimates = {
  [key: string]: {
    estimate: number;
    userName: string;
    timeTaken?: number;
  };
};

export type TicketInfo = {
  [key: string]: {
    estimate: number;
    playerEstimates: PlayerEstimates;
  };
};
