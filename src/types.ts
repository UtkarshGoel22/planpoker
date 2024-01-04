export type CreateUser = {
  confirmPassword: string;
  email: string;
  firstName: string;
  password: string;
  lastName: string;
  username: string;
};

export type CustomError = {
  message: string;
  data: any;
};

export type CustomResponse = {
  success: boolean;
  message: string;
  data: any;
};

export type ValidationIssue = {
  path: string[];
  message: string;
  [key: string]: any;
};
