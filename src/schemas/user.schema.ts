import { z } from 'zod';

import { Regex } from '../constants/common';
import { FieldConstraints, FieldNames } from '../constants/field';
import { ValidationMessages } from '../constants/message';

export const registrationSchema = z
  .object({
    firstName: z
      .string({ required_error: ValidationMessages.FIRST_NAME_REQUIRED })
      .max(FieldConstraints.FIRST_NAME.MAX, ValidationMessages.FIRST_NAME_MAX_LENGTH),
    lastName: z
      .string()
      .max(FieldConstraints.LAST_NAME.MAX, ValidationMessages.LAST_NAME_MAX_LENGTH)
      .optional(),
    username: z
      .string({ required_error: ValidationMessages.USERNAME_REQUIRED })
      .min(FieldConstraints.USERNAME.MIN, ValidationMessages.USERNAME_MIN_LENGTH)
      .max(FieldConstraints.USERNAME.MAX, ValidationMessages.USERNAME_MAX_LENGTH)
      .regex(Regex.ALPHANUMERIC, ValidationMessages.USERNAME_MUST_BE_ALPHANUMERIC),
    email: z
      .string({ required_error: ValidationMessages.EMAIL_REQUIRED })
      .email(ValidationMessages.INVALID_EMAIL),
    password: z
      .string({ required_error: ValidationMessages.PASSWORD_REQUIRED })
      .min(FieldConstraints.PASSWORD.MIN, ValidationMessages.PASSWORD_MIN_LENGTH)
      .max(FieldConstraints.PASSWORD.MAX, ValidationMessages.PASSWORD_MAX_LENGTH),
    confirmPassword: z
      .string({ required_error: ValidationMessages.PASSWORD_REQUIRED })
      .min(FieldConstraints.PASSWORD.MIN, ValidationMessages.PASSWORD_MIN_LENGTH)
      .max(FieldConstraints.PASSWORD.MAX, ValidationMessages.PASSWORD_MAX_LENGTH),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: ValidationMessages.PASSWORD_DOES_NOT_MATCH,
    path: [FieldNames.PASSWORD],
  });

export const userVerificationSchema = z.object({
  token: z.string({ required_error: ValidationMessages.TOKEN_REQUIRED }),
});
