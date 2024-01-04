import { z } from "zod";

import { CustomResponse, ValidationIssue } from "../types";

export const formatValidationErrors = (
  validationErrors: ValidationIssue[]
): { [key: string]: string } => {
  let formattedValidationErrors = {};
  validationErrors.forEach((validationError) => {
    let key = validationError.path.join(".");
    formattedValidationErrors[key] = formattedValidationErrors[key]
      ? formattedValidationErrors[key] + ". " + validationError.message
      : validationError.message;
  });
  return formattedValidationErrors;
};

export const makeResponse = (success: boolean, message: string, data: any): CustomResponse => {
  return { success, message, data };
};

export const validateData = (
  schema: z.ZodEffects<z.ZodObject<any>> | z.ZodObject<any>,
  data: any
): { [key: string]: string } | null => {
  let errorData = null;
  const result = schema.safeParse(data);
  if (!result.success) {
    errorData = formatValidationErrors(result["error"].issues);
  }
  return errorData;
};
