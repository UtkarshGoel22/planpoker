export type CreateGroup = {
  name: string;
  admin: string;
  members: string[];
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
