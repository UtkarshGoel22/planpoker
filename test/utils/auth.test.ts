import { ErrorMessages } from '../../src/constants/message';
import * as auth from '../../src/utils/auth';

export const testAuthUtil = () => {
  describe('Test argon2IdHasher() function', () => {
    test('Data hashed successfully', async () => {
      expect(await auth.argon2IdHasher('123')).toBe(
        '$argon2id$v=19$m=65536,t=3,p=4$SzRIK3hmNVZGQTBhK2J4Sg$7Cs+HEpjz3u3ZvoHYv3kXmNDVouK51SxydcgmFCRURg',
      );
    });
  });

  describe('Test hashPassword() function', () => {
    test('Data hashed successfully', async () => {
      expect(await auth.hashPassword('123')).toBe(
        '$argon2id$v=19$m=65536,t=3,p=4$SzRIK3hmNVZGQTBhK2J4Sg$7Cs+HEpjz3u3ZvoHYv3kXmNDVouK51SxydcgmFCRURg',
      );
    });

    test('Error while hashing password', async () => {
      const argon2IdHasherSpy = jest
        .spyOn(auth, 'argon2IdHasher')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((_data: string | Buffer) => {
          throw 'Error while hashing password';
        });

      try {
        await auth.hashPassword('123');
      } catch (error) {
        expect(error).toEqual({
          message: ErrorMessages.SOMETHING_WENT_WRONG,
          data: { somethingWentWrong: ErrorMessages.SOMETHING_WENT_WRONG },
        });
      }

      argon2IdHasherSpy.mockRestore();
    });
  });
};
