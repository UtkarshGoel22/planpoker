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
  data: object | null;
};

export type ValidationIssue = {
  path: string[];
  message: string;
  [key: string]: unknown;
};
