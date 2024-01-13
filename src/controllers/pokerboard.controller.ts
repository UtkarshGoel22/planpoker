import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseMessages } from '../constants/message';
import { createPokerboard } from '../entity/pokerboard/repository';
import { makeResponse } from '../utils/common';

export const createUserPokerboard = async (req: Request, res: Response) => {
  const pokerboard = await createPokerboard(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json(makeResponse(true, ResponseMessages.POKERBOARD_CREATE_SUCCESS, pokerboard));
};
