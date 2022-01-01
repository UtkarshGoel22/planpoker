import { Response } from 'express';

export const sendResponseBack = (
  res: Response,
  statusCode: number,
  body: any
) => {
  res.status(statusCode).json(body);
};
