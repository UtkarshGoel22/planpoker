import { Request, Response } from 'express';
import { ErrorMessage, SuccessMessage } from '../constants/message';
import { InviteStatus } from '../constants/customTypes';
import { PokerboardErrorType } from '../constants/PokerboardErrorTypes';
import { Pokerboard } from '../entity/Pokerboard';
import { Ticket } from '../entity/Ticket';
import { User } from '../entity/User';
import { generateCustomResponse } from '../middlewares/user.validation';
import { IRequest } from '../models/RequestInterface';
import ResponseMessage from '../models/ResponseMessage';
import {
  createPokerboardHelper,
  getGroupDetails,
  getTicketDetails,
  getUserDetails,
  getUserPokerboardByUserIdAndPokerboardId,
  saveUserPokerboard,
  addTicketToPokerboardHelper,
  updateTicketsInDbService,
  updateRoleHelper,
} from '../repositories/pokerBoard.repository';
import {
  isManagerHavePermissionToPokerboard,
  isNotPokerboard,
} from '../services/pokerboard.validation.helper';

export const createPokerBoard = async (req: Request, res: Response) => {
  const responseMessage: ResponseMessage = {
    data: undefined,
    message: SuccessMessage.POKER_BOARD_CREATED_SUCCESSFULLY,
    success: true,
  };

  const body = req.body;

  if (body.users.length === 0 && body.groups.length === 0) {
    let errorData: any = {};
    errorData[PokerboardErrorType.MINIMUM_MEMBER] =
      ErrorMessage.AT_LEAST_GROUP_OR_USER;
    responseMessage.success = false;
    responseMessage.data = errorData;
    responseMessage.message = ErrorMessage.AT_LEAST_GROUP_OR_USER;
    return res.status(400).json(responseMessage);
  }

  try {
    let pokerBoard = await createPokerboardHelper(req.body);
    responseMessage.data = {
      ...pokerBoard,
    };
    return res.status(201).json(responseMessage);
  } catch (_) {
    let errorData: any = {};
    errorData[PokerboardErrorType.SOMETHING_WENT_WRONG] =
      ErrorMessage.SOMETHING_WENT_WRONG_WHILE_CREATING_POKER_BOARD;
    responseMessage.success = false;
    responseMessage.data = errorData;
    responseMessage.message =
      ErrorMessage.SOMETHING_WENT_WRONG_WHILE_CREATING_POKER_BOARD;
    return res.status(400).json(responseMessage);
  }
};

export const acceptJoiningRequest = async (req: Request, res: Response) => {
  let { pokerBoardId, userId } = req.query;

  // check if user is invited to a poker-board or not
  const userPokerBoard = await getUserPokerboardByUserIdAndPokerboardId(
    userId.toString(),
    pokerBoardId.toString()
  );

  let responseMessage: ResponseMessage = {
    data: undefined,
    message: '',
    success: false,
  };

  if (!userPokerBoard) {
    let errorData: any = {};
    errorData[PokerboardErrorType.INVITE] =
      ErrorMessage.YOU_ARE_NOT_INVITED_TO_THIS_GAME;
    responseMessage.data = errorData;
    responseMessage.message = ErrorMessage.YOU_ARE_NOT_INVITED_TO_THIS_GAME;
    return res.status(400).json(responseMessage);
  }

  if (
    userPokerBoard.inviteStatus === InviteStatus.ACCEPTED ||
    userPokerBoard.inviteStatus === InviteStatus.REJECTED
  ) {
    let errorData: any = {};
    let message =
      userPokerBoard.inviteStatus === InviteStatus.ACCEPTED
        ? ErrorMessage.YOU_HAVE_ALREADY_ACCEPTED_YOUR_INVITATION
        : ErrorMessage.YOU_HAVE_ALREADY_REJECTED_THE_INVITE;
    errorData[PokerboardErrorType.INVITE] = message;
    responseMessage.data = errorData;
    responseMessage.message = message;
    return res.status(400).json(responseMessage);
  }

  // now we can accept the invitation
  userPokerBoard.inviteStatus = InviteStatus.ACCEPTED;
  await saveUserPokerboard(userPokerBoard);
  responseMessage.success = true;
  responseMessage.message = SuccessMessage.ACCEPT_BOARD_INVITATION;

  return res.status(200).json(responseMessage);
};

export const getPokerboardDetail = async (req: IRequest, res: Response) => {
  let responseMessage: ResponseMessage = {
    data: undefined,
    message: '',
    success: true,
  };

  const pokerboard: Pokerboard = req.pokerboard;

  if (!pokerboard) {
    let errorData: any = {};
    errorData[PokerboardErrorType.POKER_BOARD_ID] =
      ErrorMessage.INVALID_POKERBOARD_ID;
    responseMessage.success = false;
    responseMessage.data = errorData;
    responseMessage.message = ErrorMessage.INVALID_POKERBOARD_ID;
    return res.status(400).json(responseMessage);
  }

  const groups = await getGroupDetails(pokerboard);
  const tickets = await getTicketDetails(pokerboard);
  const users = await getUserDetails(pokerboard);
  responseMessage.data = {
    id: pokerboard.id,
    name: pokerboard.name,
    manager: pokerboard.manager,
    deckType: pokerboard.deckType,
    status: pokerboard.status,
    groups: groups,
    tickets: tickets,
    users: users,
  };

  return res.status(200).json(responseMessage);
};

export const addTicketsToPokerboard = async (req: IRequest, res: Response) => {
  let loggedInUser: User = req.user;

  let { tickets: ticketsFromBody } = req.body;

  const pokerboard = req.pokerboard;

  let errorMessage = isNotPokerboard(pokerboard);
  if (errorMessage) {
    return res.status(400).json(errorMessage);
  }

  try {
    let responseMessage: ResponseMessage = await addTicketToPokerboardHelper(
      ticketsFromBody,
      pokerboard
    );
    return res.status(201).json(responseMessage);
  } catch (err) {
    return res
      .status(400)
      .json(generateCustomResponse(false, err.message, err.errData));
  }
};

export const updateTickets = async (req: IRequest, res: Response) => {
  const loggedInUser = req.user;
  let { tickets: ticketsFromBody } = req.body;

  const pokerboard = req.pokerboard;

  let errorMessage = isNotPokerboard(pokerboard);

  if (errorMessage) {
    return res.status(400).json(errorMessage);
  }

  try {
    let tickets: Ticket[] = await updateTicketsInDbService(ticketsFromBody);
    return res
      .status(200)
      .json(
        generateCustomResponse(true, SuccessMessage.TICKETS_UPDATE, tickets)
      );
  } catch (error) {
    return res
      .status(500)
      .json(generateCustomResponse(false, error.message, error.errData));
  }
};

export const updatePokerboardUsers = async (req: IRequest, res: Response) => {
  let { users } = req.body;
  let id: string = req.params.id;

  try {
    let responseMessage: ResponseMessage = await updateRoleHelper(id, users);
    return res.status(200).json(responseMessage);
  } catch (error) {
    return res
      .status(500)
      .json(generateCustomResponse(false, error.message, error.errData));
  }
};
