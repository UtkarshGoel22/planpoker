export enum DeckTypes {
  SERIAL = 'SERIAL',
  EVEN = 'EVEN',
  ODD = 'ODD',
  FIBONACCI = 'FIBONACCI',
}

export enum EmailSubject {
  ADDED_TO_GROUP = 'Added to new group',
  EMAIL_VERIFICATION = 'Email verification',
  POKERBOARD_INVITE = 'Invitation to join pokerboard',
  REGISTRATION_SUCESS = 'Registered successfully!!',
  SIGN_UP_TO_JOIN_POKERBOARD = 'Sign up to join pokerboard',
  VERIFICATION_SUCCESS = 'Account verified successfully!!',
}

export const enum ImportByTypes {
  ID = 'ID',
  SPRINT = 'SPRINT',
  JQL = 'JQL',
}

export enum InviteStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum PokerboardStatus {
  CREATED = 'CREATED',
  STARTED = 'GAME_STARTED',
  ENDED = 'GAME_ENDED',
}

export enum Routes {
  USER = '/user',
  USERS = '/users',
  POKERBOARD = '/pokerboard',
}

export enum TicketTypes {
  BUG = 'Bug',
  STORY = 'Story',
  TASK = 'Task',
}

export enum UserRoles {
  MANAGER = 'MANAGER',
  PLAYER = 'PLAYER',
  SPECTATOR = 'SPECTATOR',
}
