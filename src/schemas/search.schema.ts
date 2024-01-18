import { z } from 'zod';

import { ValidationMessages } from '../constants/message';
import config from '../settings/config';

export const SearchSchema = z.object({
  searchKey: z.string().optional().default(''),
  limit: z
    .string()
    .optional()
    .default(`${config.SEARCH.LIMIT}`)
    .refine((value) => {
      const parsedLimit = Number(value);
      return !isNaN(parsedLimit) && Number.isFinite(parsedLimit) && parsedLimit > 0;
    }, ValidationMessages.LIMIT_SHOULD_BE_A_NATURAL_NUMBER),
});
