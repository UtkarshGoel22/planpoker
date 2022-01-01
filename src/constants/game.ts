import { Ticket } from '../entity/Ticket';
import { TIMER_STATUS } from "./customTypes";

export type gameInfoType = {
  [key: string]: {
    isManagerPresent: boolean;
    tickets: Ticket[];
    currentTicketIndex: number;
    timerDuration: number;
    timerStatus?: TIMER_STATUS;
    gameTicketInfo?: ticketInfoType;
  };
};

export type ticketInfoType = {
  [key: string]: {
    estimate: number;
    playerEstimates: playerEstimatesType;
  };
};

export type playerEstimatesType = {
  [key: string]: {
    estimate: number;
    userName: string;
    timeTaken?: number;
  };
};

export type commentBodyType = {
  body: {
    version: number;
    type: string;
    content: [{ type: string; content: [{ type: string; text: string }] }];
  };
};

export type estmateBodyType = {
  fields: {
    customfield_10016: number;
  };
};

export const enum ServerEvent {
  JOIN_GAME = 'join-game',
  END_GAME = 'end-game',
  START_TIMER = 'start-timer',
  NEXT_TICKET = 'next-ticket',
  SKIP_TICKET = 'skip-ticket',
  ADD_COMMENT = 'add-comment',
  SET_ESTIMATE = 'set-estimate',
  CONNECTION = 'connection',
  DISCONNECTING = 'disconnecting',
}

export const enum ClientEvent {
  TIMER = 'timer',
  TIMER_STARTED = 'timer-started',
  TIMER_ENDED = 'timer-ended',
  MANAGER_JOINED = 'manager-joined',
  MANAGER_LEFT = 'manager-left',
  MANAGER_ESTIMATE = 'manager-estimate',
  PLAYER_ESTIMATE = 'player-estimate',
  GAME_ERROR = 'game-error',
  CURRENT_TICKET = 'current-ticket',
  COMMENT_ADDED = 'comment-added',
  SKIP_TICKET = 'skip-ticket',
  END_GAME = 'end-game',
  LEAVE_GAME = 'leave-game',
}

export const enum SocketConstant {
  AUTH_ID = 'authId',
  POKERBOARD_ID = 'pokerboardId',
  USER_ID = 'userId',
  ROLE = 'role',
}

export const enum GameError {
  ACCESS_DENIED = `You don't of the access`,
  INVALID_TOKEN = 'Invalid Token',
  INVALID_USER = 'Invalid User',
  NO_TICKETS = 'You need to have atleast 1 ticket in pokerboard',
  LAST_TICKET = 'This is the last ticket',
  LAST_TICKET_SKIP = 'You cannot skip the last ticket',
  JIRA_COMMENT = 'Failed to add comment on JIRA',
  JIRA_ESTIMATE = 'Failed to add estimate on JIRA',
}

export const enum Time {
  DISCONNECT_MANAGER_TIME = 30000,
  ONE_SECOND = 1000,
  TIMER_DURATION = 10,
}
