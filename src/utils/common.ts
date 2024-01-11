import { z } from 'zod';

import { CustomResponse, ValidationIssue } from '../types';

export const formatValidationErrors = (
  validationErrors: ValidationIssue[],
): { [key: string]: string } => {
  const formattedValidationErrors = {};
  validationErrors.forEach((validationError) => {
    const key = validationError.path.join('.');
    formattedValidationErrors[key] = formattedValidationErrors[key]
      ? formattedValidationErrors[key] + '. ' + validationError.message
      : validationError.message;
  });
  return formattedValidationErrors;
};

export const makeResponse = (
  success: boolean,
  message: string,
  data: object | undefined = undefined,
): CustomResponse => {
  return { success, message, data };
};

export const validateData = (
  schema: z.ZodEffects<z.ZodObject<any>> | z.ZodObject<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  data: object,
): { [key: string]: string } => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorData = formatValidationErrors(result['error'].issues);
    throw { data: errorData };
  }
  return result.data;
};
