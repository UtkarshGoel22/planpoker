import { StatusCodes } from 'http-status-codes';

import { ErrorMessages } from '../../src/constants/message';
import { createUser } from '../../src/entity/user/repository';
import { TestData } from '../test.data';
import { createTestUser } from '../test.util';

export const testUserRepository = () => {
  describe('Test createUser function', () => {
    test('An inactive user with the same email already exists', async () => {
      await createTestUser({ isActive: false });

      expect(await createUser(TestData.USER_REGISTERATION_REQUEST_DATA)).toEqual({
        ...TestData.USER,
        password: 'password',
      });
    });

    test('New user created successfully', async () => {
      const { createdAt, id, updatedAt, ...result } = await createUser(
        TestData.USER_REGISTERATION_REQUEST_DATA,
      );

      expect(result).toEqual({
        ...TestData.USER,
        password: 'password',
        isActive: true,
        isVerified: false,
      });
      expect(createdAt).toBeInstanceOf(Date);
      expect(id).toBeTruthy();
      expect(updatedAt).toBeInstanceOf(Date);
    });

    test('Error while saving new user data', async () => {
      await createTestUser();

      try {
        await createUser(TestData.USER_REGISTERATION_REQUEST_DATA);
      } catch (error) {
        expect(error).toEqual({
          statusCode: StatusCodes.BAD_REQUEST,
          message: ErrorMessages.ACCOUNT_ALREADY_EXISTS,
          data: { duplicateEntry: ErrorMessages.ACCOUNT_ALREADY_EXISTS },
        });
      }
    });
  });
};
