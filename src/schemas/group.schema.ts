import { z } from 'zod';

import { Regex } from '../constants/common';
import { FieldConstraints } from '../constants/field';
import { ValidationMessages } from '../constants/message';

export const createGroupSchema = z.object({
  name: z
    .string({ required_error: ValidationMessages.GROUP_NAME_REQUIRED })
    .min(FieldConstraints.USERNAME.MIN, ValidationMessages.GROUP_NAME_MIN_LENGTH)
    .max(FieldConstraints.USERNAME.MAX, ValidationMessages.GROUP_NAME_MAX_LENGTH)
    .regex(Regex.ALPHANUMERIC, ValidationMessages.GROUP_NAME_MUST_BE_ALPHANUMERIC),
  admin: z.string({ required_error: ValidationMessages.ADMIN_REQUIRED }),
  members: z
    .array(z.string())
    .min(FieldConstraints.MEMBERS.MIN, ValidationMessages.MINIMUM_MEMBERS),
});
