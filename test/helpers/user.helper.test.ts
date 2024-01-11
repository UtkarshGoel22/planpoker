import { ErrorMessages, ValidationMessages } from '../../src/constants/message';
import { validateUserRegistrationData } from '../../src/helpers/user.helper';
import { TestData } from '../test.data';

export const testUserHelpers = () => {
  describe('Test validateUserRegistrationData function', () => {
    test('Invalid data', () => {
      try {
        validateUserRegistrationData({});
      } catch (error) {
        expect(error).toEqual({
          message: ErrorMessages.INVALID_REQUEST_DATA,
          data: {
            firstName: ValidationMessages.FIRST_NAME_REQUIRED,
            username: ValidationMessages.USERNAME_REQUIRED,
            email: ValidationMessages.EMAIL_REQUIRED,
            password: ValidationMessages.PASSWORD_REQUIRED,
            confirmPassword: ValidationMessages.PASSWORD_REQUIRED,
          },
        });
      }
    });

    test('Valid data', () => {
      expect(validateUserRegistrationData(TestData.USER_REGISTERATION_REQUEST_DATA)).toEqual(
        TestData.USER_REGISTERATION_REQUEST_DATA,
      );
    });
  });
};
