import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ValidationMessages } from '../../src/constants/message';
import { registerUserValidation } from '../../src/middlewares/user.middleware';
import { createTestUser } from '../test.util';
import { TestData } from '../test.data';

export const testUserMiddleware = () => {
  describe('Test registerUserValidation function', () => {
    let requestMock: Partial<Request>;
    const responseMock = () => {
      const res: { status?: any; json?: any } = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
    const nextFunctionMock: NextFunction = jest.fn();

    beforeEach(() => {
      requestMock = {};
    });

    test('Invalid request body data', async () => {
      requestMock.body = {};
      const resMock: Partial<Response> = responseMock();

      await registerUserValidation(requestMock as Request, resMock as Response, nextFunctionMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(resMock.json).toHaveBeenCalledWith({
        success: false,
        message: ErrorMessages.INVALID_REQUEST_DATA,
        data: {
          firstName: ValidationMessages.FIRST_NAME_REQUIRED,
          username: ValidationMessages.USERNAME_REQUIRED,
          email: ValidationMessages.EMAIL_REQUIRED,
          password: ValidationMessages.PASSWORD_REQUIRED,
          confirmPassword: ValidationMessages.PASSWORD_REQUIRED,
        },
      });
      expect(nextFunctionMock).toHaveBeenCalledTimes(0);
    });

    test('User already exists in the database', async () => {
      await createTestUser();
      requestMock.body = TestData.USER_REGISTERATION_REQUEST_DATA;
      const resMock: Partial<Response> = responseMock();

      await registerUserValidation(requestMock as Request, resMock as Response, nextFunctionMock);

      expect(resMock.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(resMock.json).toHaveBeenCalledWith({
        success: false,
        message: ErrorMessages.INVALID_REQUEST_DATA,
        data: { username: ValidationMessages.USERNAME_ALREADY_EXISTS },
      });
      expect(nextFunctionMock).toHaveBeenCalledTimes(0);
    });

    test('Valid request body data', async () => {
      requestMock.body = TestData.USER_REGISTERATION_REQUEST_DATA;
      const resMock: Partial<Response> = responseMock();

      await registerUserValidation(requestMock as Request, resMock as Response, nextFunctionMock);

      expect(resMock.status).toHaveBeenCalledTimes(0);
      expect(resMock.json).toHaveBeenCalledTimes(0);
      expect(nextFunctionMock).toHaveBeenCalledTimes(1);
    });
  });
};
