import Joi from '@hapi/joi';
import { ValidationMessages } from '../constants/message';

const registrationSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .max(50)
    .messages({
      'any.required': `FirstName ${ValidationMessages.REQUIRED}`,
      'string.max': `FirstName ${ValidationMessages.MAX_CHAR_CUSTOM}`,
    }),
  lastName: Joi.string()
    .optional()
    .max(50)
    .messages({
      'any.required': `LastName ${ValidationMessages.REQUIRED}`,
      'string.max': `LastName ${ValidationMessages.MAX_CHAR_CUSTOM}`,
    }),
  userName: Joi.string()
    .required()
    .min(4)
    .max(30)
    .alphanum()
    .messages({
      'any.required': `Username ${ValidationMessages.REQUIRED}`,
      'string.alphanum': `Username ${ValidationMessages.USERNAME_INVALID}`,
      'string.max': `Username ${ValidationMessages.MAX_CHAR}`,
      'string.min': `Username ${ValidationMessages.MIN_CHAR}`,
    }),
  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': `Email ${ValidationMessages.REQUIRED}`,
      'string.email': `${ValidationMessages.INVALID_EMAIL}`,
      'string.empty': `Email ${ValidationMessages.REQUIRED}`,
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(30)
    .messages({
      'any.required': `Password ${ValidationMessages.REQUIRED}`,
      'string.min': `${ValidationMessages.PASSWORD_INVALID}`,
      'string.max': `Password ${ValidationMessages.MAX_CHAR}`,
    }),
    confirmPassword: Joi.string()
    .required()
    .min(6)
    .max(30)
    .messages({
      'any.required': `Password ${ValidationMessages.REQUIRED}`,
      'string.min': `${ValidationMessages.PASSWORD_INVALID}`,
      'string.max': `Password ${ValidationMessages.MAX_CHAR}`,
    }),
});

export const verifySchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': `Token ${ValidationMessages.REQUIRED}`,
    }),
});

export const reverifySchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': `Email ${ValidationMessages.REQUIRED}`,
      'string.email': `${ValidationMessages.INVALID_EMAIL}`,
      'string.empty': `Email ${ValidationMessages.REQUIRED}`,
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': `Email ${ValidationMessages.REQUIRED}`,
      'string.email': `${ValidationMessages.INVALID_EMAIL}`,
      'string.empty': `Email ${ValidationMessages.REQUIRED}`,
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(30)
    .messages({
      'any.required': `Password ${ValidationMessages.REQUIRED}`,
      'string.min': `${ValidationMessages.PASSWORD_INVALID}`,
      'string.max': `${ValidationMessages.MAX_CHAR}`,
    }),
});

export const searchSchema = Joi.object({
  searchKey: Joi.string()
    .optional()
    .allow('', null)
    .messages({
      'any.required': `Query ${ValidationMessages.REQUIRED}`,
    }),
  limit: Joi.number()
    .optional()
    .messages({
      'number.base': `Limit ${ValidationMessages.INVALID_BASE_NUMBER}`,
    }),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .optional()
    .max(50)
    .messages({
      'any.required': `FirstName ${ValidationMessages.REQUIRED}`,
      'string.max': `FirstName ${ValidationMessages.MAX_CHAR_CUSTOM}`,
    }),
  lastName: Joi.string()
    .optional()
    .max(50)
    .messages({
      'any.required': `LastName ${ValidationMessages.REQUIRED}`,
      'string.max': `LastName ${ValidationMessages.MAX_CHAR_CUSTOM}`,
    }),
  userName: Joi.string()
    .optional()
    .min(4)
    .max(30)
    .alphanum()
    .messages({
      'any.required': `Username ${ValidationMessages.REQUIRED}`,
      'string.alphanum': `Username ${ValidationMessages.USERNAME_INVALID}`,
      'string.max': `Username ${ValidationMessages.MAX_CHAR}`,
      'string.min': `Username ${ValidationMessages.MIN_CHAR}`,
    }),
});

export { registrationSchema };
