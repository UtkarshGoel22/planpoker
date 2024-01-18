import { z } from 'zod';

import { Regex } from '../constants/common';
import { FieldConstraints, FieldNames } from '../constants/field';
import { ValidationMessages } from '../constants/message';
import { DeckTypes, TicketTypes } from '../constants/enums';

const UserSchema = z.object({
  id: z
    .string({ required_error: ValidationMessages.ID_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.ID_REQUIRED),
  email: z
    .string({ required_error: ValidationMessages.EMAIL_REQUIRED })
    .email(ValidationMessages.INVALID_EMAIL),
});

export const AcceptPokerboardInviteSchema = z.object({
  pokerboardId: z.string({ required_error: ValidationMessages.POKERBOARD_ID_REQUIRED }),
});

export const CreatePokerboardSchema = z
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          case 'invalid_type':
            return { message: ValidationMessages.INVALID_DECK_TYPE };
          case 'invalid_enum_value':
            return { message: ValidationMessages.INVALID_DECK_TYPE };
          default:
            return { message: ValidationMessages.DECK_TYPE_REQUIRED };
        }
      },
    }),
    users: z.array(UserSchema, { required_error: ValidationMessages.USERS_REQUIRED }),
    groups: z.array(z.string().min(FieldConstraints.REQUIRED_FIELD), {
      required_error: ValidationMessages.GROUPS_REQUIRED,
    }),
  })
  .refine((schema) => schema.users.length > 0 || schema.groups.length > 0, {
    message: ValidationMessages.MINIMUM_MEMBERS,
    path: [FieldNames.MIN_MEMBERS],
  });

export const PokerboardIdSchema = z.object({
  id: z
    .string({ required_error: ValidationMessages.ID_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.ID_REQUIRED),
});

const UpdateTicketSchema = z.object({
  id: z
    .string({ required_error: ValidationMessages.TICKET_ID_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.TICKET_ID_REQUIRED),
  summary: z
    .string()
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.TICKET_SUMMARY_REQUIRED)
    .optional(),
  description: z
    .string()
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.TICKET_DESCRIPTION_REQUIRED)
    .optional(),
  estimate: z
    .number()
    .positive(ValidationMessages.TICKET_ESTIMATE_SHOULD_BE_A_POSITIVE_NUMBER)
    .optional(),
  type: z
    .enum([TicketTypes.BUG, TicketTypes.STORY, TicketTypes.TASK], {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          case 'invalid_type':
            return { message: ValidationMessages.INVALID_TICKET_TYPE };
          case 'invalid_enum_value':
            return { message: ValidationMessages.INVALID_TICKET_TYPE };
          default:
            return { message: ValidationMessages.TICKET_TYPE_REQUIRED };
        }
      },
    })
    .optional(),
  order: z
    .number()
    .positive(ValidationMessages.TICKET_ORDER_SHOULD_BE_A_POSITIVE_NUMBER)
    .optional(),
});

export const UpdateTicketsSchema = z.object({
  tickets: z.array(UpdateTicketSchema, { required_error: ValidationMessages.TICKETS_REQUIRED }),
});
