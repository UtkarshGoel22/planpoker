import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validateSearchData } from '../helpers/search.helper';
import { makeResponse } from '../utils/common';

export const searchValidation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = validateSearchData(req.query);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, error.message, error.data));
  }

  next();
};
