import { z } from 'zod';

import { FieldConstraints } from '../constants/field';
import { ValidationMessages } from '../constants/message';
import { TicketTypes } from '../constants/enums';

const TicketSchema = z.object({
  id: z
    .string({ required_error: ValidationMessages.TICKET_ID_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.TICKET_ID_REQUIRED),
  summary: z
    .string({ required_error: ValidationMessages.TICKET_SUMMARY_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.TICKET_SUMMARY_REQUIRED),
  description: z
    .string({ required_error: ValidationMessages.TICKET_DESCRIPTION_REQUIRED })
    .min(FieldConstraints.REQUIRED_FIELD, ValidationMessages.TICKET_DESCRIPTION_REQUIRED),
  estimate: z
    .number()
    .positive(ValidationMessages.TICKET_ESTIMATE_SHOULD_BE_A_POSITIVE_NUMBER)
    .optional(),
  type: z.enum([TicketTypes.BUG, TicketTypes.STORY, TicketTypes.TASK], {
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
  }),
});

export const TicketsSchema = z.object({
  tickets: z.array(TicketSchema, {
    required_error: ValidationMessages.TICKETS_REQUIRED,
  }),
});
