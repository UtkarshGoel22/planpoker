import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ResponseMessages, ValidationMessages } from '../../src/constants/message';
import * as auth from '../../src/utils/auth';
import { TestData } from '../test.data';
import { sendMailMock } from '../test.mocks';
import { TestConfig } from '../test.settings';
import { createTestUser } from '../test.util';

// To prevent axios from generating error when the request fails
// so that it does not go inside the catch block.
axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => Promise.resolve(error.response),
);

export const testUserRegistration = () => {
  afterEach(() => sendMailMock.mockClear());

  describe('Test user registration endpoint', () => {
    const url = `${TestConfig.BASE_URL}/user/signup/`;
    const headers = { 'Content-Type': 'application/json' };

    test('Invalid data', async () => {
      const payload = {};

      const response = await axios.post(url, payload, { headers: headers });

      expect(sendMailMock).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.data).toEqual({
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
    });

    test('Active user with the given username already exists', async () => {
      await createTestUser();
      const payload = TestData.USER_REGISTERATION_REQUEST_DATA;

      const response = await axios.post(url, payload, { headers: headers });

      expect(sendMailMock).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.data).toEqual({
        success: false,
        message: ErrorMessages.INVALID_REQUEST_DATA,
        data: { username: ValidationMessages.USERNAME_ALREADY_EXISTS },
      });
    });

    test('Error while hashing password', async () => {
      const payload = TestData.USER_REGISTERATION_REQUEST_DATA;
      const argon2IdHasherSpy = jest
        .spyOn(auth, 'argon2IdHasher')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((_data: string | Buffer) => {
          throw 'Error while hashing password';
        });

      const response = await axios.post(url, payload, { headers: headers });

      expect(sendMailMock).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.data).toEqual({
        success: false,
        message: ErrorMessages.SOMETHING_WENT_WRONG,
        data: { somethingWentWrong: ErrorMessages.SOMETHING_WENT_WRONG },
      });

      argon2IdHasherSpy.mockRestore();
    });

    test('Inactive user with the given email already exists', async () => {
      await createTestUser({ isActive: false });
      const payload = TestData.USER_REGISTERATION_REQUEST_DATA;

      const response = await axios.post(url, payload, { headers: headers });

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.data).toEqual({
        success: true,
        message: ResponseMessages.REGISTRATION_SUCCESS,
      });
    });

    test('Active user with the given email already exists', async () => {
      await createTestUser({ username: 'doejohn' });
      const payload = TestData.USER_REGISTERATION_REQUEST_DATA;

      const response = await axios.post(url, payload, { headers: headers });

      expect(sendMailMock).toHaveBeenCalledTimes(0);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.data).toEqual({
        success: false,
        message: ErrorMessages.ACCOUNT_ALREADY_EXISTS,
        data: { email: ErrorMessages.ACCOUNT_ALREADY_EXISTS },
      });
    });

    test('User registered successfully', async () => {
      const payload = TestData.USER_REGISTERATION_REQUEST_DATA;

      const response = await axios.post(url, payload, { headers: headers });

      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.data).toEqual({
        success: true,
        message: ResponseMessages.REGISTRATION_SUCCESS,
      });
    });
  });
};
