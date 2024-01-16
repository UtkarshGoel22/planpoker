import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { In } from 'typeorm';

import { ErrorMessages, ResponseMessages } from '../constants/message';
import { ImportByTypes, InviteStatus } from '../constants/enums';
import { getGroupsDetails } from '../entity/group/repository';
import { createPokerboard } from '../entity/pokerboard/repository';
import { findTickets, getTicketsDetails, saveTickets } from '../entity/ticket/repository';
import {
  findPokerboardsAssociatedToUser,
  findUserPokerboard,
  getUsersDetails,
  saveUserPokerboard,
} from '../entity/userPokerboard/repository';
import {
  importTicketsById,
  importTicketsByJQL,
  importTicketsBySprint,
  updateTicketsInPokerboard,
} from '../helpers/pokerboard.helper';
import { PokerboardDetails, TicketDetails } from '../types';
import { makeResponse } from '../utils/common';
import { setImportTicketResposneMessage } from '../utils/jira';
import { Ticket } from '../entity/ticket/model';

export const addTicketsToPokerboard = async (req: Request, res: Response) => {
  const pokerboard = req.pokerboard;
  let { tickets } = req.body;
  const ticketIds = tickets.map((ticket: TicketDetails) => ticket.id);
  const ticketsData = await findTickets({ where: { id: In(ticketIds) } });

  if (ticketsData.length === 0) {
    // All the tickets to be added do not exist in the database.
    await saveTickets(tickets, pokerboard);
    return res
      .status(StatusCodes.OK)
      .json(makeResponse(true, ResponseMessages.TICKETS_ADDED_SUCCESSFULLY));
  } else if (ticketsData.length === ticketIds.length) {
    // All the tickets to be added already exist in the database.
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(makeResponse(false, ErrorMessages.ALL_TICKETS_ALREADY_EXIST));
  } else {
    // Some tickets already exist in the database.
    const alreadyExistingTicketIds = ticketsData.map((ticket) => ticket.id);
    const data = { partialExist: alreadyExistingTicketIds };
    tickets = tickets.filter((ticket: TicketDetails) =>
      alreadyExistingTicketIds.includes(ticket.id),
    );
    await saveTickets(tickets, pokerboard);
    return res
      .status(StatusCodes.OK)
      .json(makeResponse(true, ResponseMessages.SOME_TICKETS_ADDED_SUCCESSFULLY, data));
  }
};

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

export const getPokerboardsAssociatedToUser = async (req: Request, res: Response) => {
  const pokerboards: PokerboardDetails[] = await findPokerboardsAssociatedToUser(req.user);
  res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.GET_POKERBOARDS_SUCCESS, pokerboards));
};

export const importTicketsInPokerboard = async (req: Request, res: Response) => {
  let { ticketsInput, importBy, startAt } = req.query;
  ticketsInput = ticketsInput.toString();
  importBy = importBy.toString();
  startAt = ticketsInput.toString();
  let result = {};

  try {
    if (importBy === ImportByTypes.ID) {
      result = await importTicketsById(ticketsInput);
    } else if (importBy === ImportByTypes.JQL) {
      result = await importTicketsByJQL(ticketsInput, startAt);
    } else if (importBy == ImportByTypes.SPRINT) {
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

export const updatePokerboardTickets = async (req: Request, res: Response) => {
  const tickets: Ticket[] = await updateTicketsInPokerboard(req.body.tickets);
  return res
    .status(StatusCodes.OK)
    .json(makeResponse(true, ResponseMessages.TICKETS_UPDATED_SUCCESSFULLY, tickets));
};
