import { z } from 'zod';

import { Regex } from '../constants/common';
import { FieldConstraints, FieldNames } from '../constants/field';
import { ValidationMessages } from '../constants/message';
import { DeckTypes } from '../constants/enums';

const userSchema = z.object({
  id: z
    .string({ required_error: ValidationMessages.ID_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.ID_REQUIRED),
  email: z
    .string({ required_error: ValidationMessages.EMAIL_REQUIRED })
    .email(ValidationMessages.INVALID_EMAIL),
});

export const createPokerboardSchema = z
  .object({
    name: z
      .string({ required_error: ValidationMessages.POKERBOARD_NAME_REQUIRED })
      .min(FieldConstraints.POKERBOARD_NAME.MIN, ValidationMessages.POKERBOARD_NAME_MIN_LENGTH)
      .max(FieldConstraints.POKERBOARD_NAME.MAX, ValidationMessages.POKERBOARD_NAME_MAX_LENGTH)
      .regex(Regex.ALPHANUMERIC, ValidationMessages.POKERBOARD_NAME_MUST_BE_ALPHANUMERIC),
    manager: z
      .string({ required_error: ValidationMessages.MANAGER_REQUIRED })
      .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.MANAGER_REQUIRED),
    deckType: z.enum([DeckTypes.EVEN, DeckTypes.FIBONACCI, DeckTypes.ODD, DeckTypes.SERIAL], {
      required_error: ValidationMessages.DECK_TYPE_REQUIRED,
    }),
    users: z.array(userSchema, { required_error: ValidationMessages.USERS_REQUIRED }),
    groups: z.array(z.string().min(FieldConstraints.REQUIRED_FIELD), {
      required_error: ValidationMessages.GROUPS_REQUIRED,
    }),
  })
  .refine((schema) => schema.users.length > 0 || schema.groups.length > 0, {
    message: ValidationMessages.PASSWORD_DOES_NOT_MATCH,
    path: [FieldNames.MIN_MEMBERS],
  });
