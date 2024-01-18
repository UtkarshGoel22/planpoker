import { DeckTypes, TicketTypes } from './constants/enums';

export type CreateGroup = {
  name: string;
  admin: string;
  members: string[];
};

export type CreatePokerboard = {
  name: string;
  manager: string;
  deckType: DeckTypes.EVEN | DeckTypes.FIBONACCI | DeckTypes.ODD | DeckTypes.SERIAL;
  users: { id: string; email: string }[];
  groups: string[];
};

export type CreateUser = {
  confirmPassword: string;
  email: string;
  firstName: string;
  password: string;
  lastName: string;
  username: string;
};

export type CustomResponse = {
  success: boolean;
  message: string;
  data: object | undefined;
};

export type GroupDetails = {
  id: string;
  name: string;
  admin: string;
  countOfMembers: number;
  member?: string;
};

export type TicketDetails = {
  id: string;
  summary: string;
  description: string;
  estimate: number;
  type: TicketTypes;
};

export type UserDetails = {
  role: string;
  userId: string;
  name: string;
  email: string;
  inviteStatus: string;
};

export type UserGroupDetails = {
  admin: string;
  countOfMembers: number;
  id: string;
  members: string[];
  name: string;
};

export type ValidationIssue = {
  path: string[];
  message: string;
  [key: string]: unknown;
};
