import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorMessages, ResponseMessages } from '../constants/message';
import { ImportByType, InviteStatus } from '../constants/enums';
import { getGroupsDetails } from '../entity/group/repository';
import { createPokerboard } from '../entity/pokerboard/repository';
import { getTicketsDetails } from '../entity/ticket/repository';
import {
  importTicketsById,
  importTicketsByJQL,
  importTicketsBySprint,
} from '../helpers/pokerboard.helper';
import {
  findUserPokerboard,
  getUsersDetails,
  saveUserPokerboard,
} from '../entity/userPokerboard/repository';
import { makeResponse } from '../utils/common';
import { setImportTicketResposneMessage } from '../utils/jira';

export const acceptPokerboardInvite = async (req: Request, res: Response) => {
  const { pokerboardId } = req.query;
  const userId = req.user.id;
  const userPokerboard = await findUserPokerboard({
    where: { pokerboardId: pokerboardId.toString(), userId },
  });

  if (!userPokerboard) {
    const errorData = { invite: ErrorMessages.NOT_INVITED_TO_POKERBOARD };
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.NOT_INVITED_TO_POKERBOARD, errorData));
  }

  if (
    userPokerboard.inviteStatus === InviteStatus.ACCEPTED ||
    userPokerboard.inviteStatus === InviteStatus.REJECTED
  ) {
    const message =
      userPokerboard.inviteStatus === InviteStatus.ACCEPTED
        ? ErrorMessages.INVITE_ALREADY_ACCEPTED
        : ErrorMessages.INVITE_ALREADY_REJECTED;
    const errorData = { invite: message };
    return res.status(StatusCodes.BAD_REQUEST).json(makeResponse(false, message, errorData));
  }

  userPokerboard.inviteStatus = InviteStatus.ACCEPTED;
  await saveUserPokerboard(userPokerboard);

  return res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.ACCEPT_POKERBOARD_INVITE_SUCCESS));
};

export const createUserPokerboard = async (req: Request, res: Response) => {
  const pokerboard = await createPokerboard(req.body);
  return res
    .status(StatusCodes.CREATED)
    .json(makeResponse(true, ResponseMessages.POKERBOARD_CREATE_SUCCESS, pokerboard));
};

export const getPokerboard = async (req: Request, res: Response) => {
  const pokerboard = req.pokerboard;
  const groups = getGroupsDetails(pokerboard);
  const tickets = getTicketsDetails(pokerboard);
  const users = getUsersDetails(pokerboard);
  const pokerboardData = {
    id: pokerboard.id,
    name: pokerboard.name,
    manager: pokerboard.manager,
    deckType: pokerboard.deckType,
    status: pokerboard.status,
    groups: groups,
    tickets: tickets,
    users: users,
  };
  res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.GET_POKERBOARD_SUCCESS, pokerboardData));
};

export const importTicketsInPokerboard = async (req: Request, res: Response) => {
  let { ticketsInput, importBy, startAt } = req.query;
  ticketsInput = ticketsInput.toString();
  importBy = importBy.toString();
  startAt = ticketsInput.toString();
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
