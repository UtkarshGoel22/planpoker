import Joi from '@hapi/joi';
import { ValidationMessages } from '../constants/message';

export const createGroupSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(4)
    .max(30)
    .alphanum()
    .messages({
      'any.required': `GroupName ${ValidationMessages.REQUIRED}`,
      'string.alphanum': `${ValidationMessages.GROUP_NAME_INVALID}`,
      'string.max': `GroupName ${ValidationMessages.MAX_CHAR}`,
      'string.min': `GroupName ${ValidationMessages.MIN_CHAR}`,
    }),

  admin: Joi.string()
    .required()
    .messages({
      'any.required': `Admin ${ValidationMessages.REQUIRED}`,
      'string.empty': `Admin ${ValidationMessages.REQUIRED}`,
    }),

  members: Joi.array()
    .min(2)
    .required()
    .items(Joi.string())
    .messages({
      'any.required': `Members ${ValidationMessages.REQUIRED}`,
      'array.min': `${ValidationMessages.MIN_MEMBERS}`,
    }),
});
