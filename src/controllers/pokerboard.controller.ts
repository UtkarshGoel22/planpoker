import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ResponseMessages } from '../constants/message';
import { ImportByType } from '../constants/enums';
import { createPokerboard } from '../entity/pokerboard/repository';
import {
  importTicketsById,
  importTicketsByJQL,
  importTicketsBySprint,
} from '../helpers/pokerboard.helper';
import { makeResponse } from '../utils/common';
import { setImportTicketResposneMessage } from '../utils/jira';

export const createUserPokerboard = async (req: Request, res: Response) => {
  const pokerboard = await createPokerboard(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json(makeResponse(true, ResponseMessages.POKERBOARD_CREATE_SUCCESS, pokerboard));
};

export const importTicketsInPokerboard = async (req: Request, res: Response) => {
  let { ticketsInput, importBy, startAt } = req.query;
  ticketsInput = ticketsInput?.toString();
  importBy = importBy?.toString();
  startAt = startAt?.toString();
  let result = {};

  try {
    if (importBy === ImportByType.ID) {
      result = await importTicketsById(ticketsInput);
    } else if (importBy === ImportByType.JQL) {
      result = await importTicketsByJQL(ticketsInput, startAt);
    } else if (importBy == ImportByType.SPRINT) {
      result = await importTicketsBySprint(ticketsInput, startAt);
    }
    res
      .status(StatusCodes.OK)
      .json(makeResponse(true, ResponseMessages.IMPORT_TICKET_SUCCESS, result));
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = setImportTicketResposneMessage(status, error.response.statusText);
      res.status(status).json(makeResponse(false, message));
    } else if (error.request) {
      res.status(StatusCodes.NOT_FOUND).json(makeResponse(false, ErrorMessages.NO_TICKETS_FOUND));
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(makeResponse(false, ErrorMessages.SOMETHING_WENT_WRONG));
    }
  }
};
