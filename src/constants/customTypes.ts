
export type INVITE_STATUS = InviteStatus.ACCEPTED |
  InviteStatus.PENDING |
  InviteStatus.REJECTED;

export type ROLE_TYPE = RoleTypes.MANAGER |
  RoleTypes.PLAYER |
  RoleTypes.SPECTATOR;

export type DECK_TYPE = DeckType.EVEN |
  DeckType.SERIAL |
  DeckType.FIBONACCI |
  DeckType.ODD;

export type TICKET_TYPE = TicketTypes.BUG |
  TicketTypes.STORY |
  TicketTypes.Task;

export type POKER_BOARD_STATUS = PokerBoardStatus.CREATED |
  PokerBoardStatus.ENDED |
  PokerBoardStatus.STARTED;

export type TIMER_STATUS = TimerStatus.NOT_STARTED |
  TimerStatus.STARTED |
  TimerStatus.ENDED;

export type SORT_TYPE = SortType.ASCENDING | SortType.DESCENDING;

export enum TicketTypes {
  BUG = 'Bug',
  STORY = 'Story',
  Task = 'Task'
}

export const SEARCH_LIMIT = 10;

export enum RoleTypes {
  MANAGER = 'MANAGER',
  PLAYER = 'PLAYER',
  SPECTATOR = 'SPECTATOR'
}

export enum DeckType {
  SERIAL = 'SERIAL',
  EVEN = 'EVEN',
  ODD = 'ODD',
  FIBONACCI = 'FIBONACCI'
}

export enum InviteStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum PokerBoardStatus {
  CREATED = 'CREATED',
  STARTED = 'GAME_STARTED',
  ENDED = 'GAME_ENDED'
}

export const enum ConstantTypes {
  UN_REGISTERED = 'un-registered'
}

export const enum ImportByType {
  ID = 'ID',
  SPRINT = 'SPRINT',
  JQL = 'JQL'
}

export const enum TimerStatus {
  STARTED = 'TIMER_STARTED',
  NOT_STARTED = 'NOT_STARTED',
  ENDED = 'TIMER_ENDED'
}

export const enum SortType {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC'
}
