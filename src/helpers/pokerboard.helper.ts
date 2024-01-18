import { StatusCodes } from 'http-status-codes';

import { Api } from '../constants/api';
import { EmailSubject } from '../constants/enums';
import { EmailMessages, ErrorMessages } from '../constants/message';
import { Pokerboard } from '../entity/pokerboard/model';
import { createPokerboardInvites } from '../entity/pokerboardInvite/repository';
import { User } from '../entity/user/model';
import {
  acceptPokerboardInviteSchema,
  createPokerboardSchema,
  pokerboardIdSchema,
} from '../schemas/pokerboard.schema';
import { validateData } from '../utils/common';
import { getTicketsFromJIRA } from '../utils/jira';
import { sendBulkMails } from '../utils/notification';

export const importTicketsById = async (ticketsInput: string) => {
  const url: string = `${Api.JIRA.V3_ISSUE}${ticketsInput}`;
  const result = await getTicketsFromJIRA(url);
  if (result.data) {
    const ticketData = [
      {
        id: result.data.key,
        type: result.data.fields.issuetype.name,
        summary: result.data.fields.summary,
        description: result.data.fields.description
          ? result.data.fields.description.content[0].content[0].text
          : '',
      },
    ];
    return { ticketData, pagination: undefined };
  }
};

export const importTicketsByJQL = async (ticketsInput: string, startAt: string) => {
  const startAtVal: string | number = startAt ? startAt : 0;
  const url: string = `${Api.JIRA.V3_JQL}${ticketsInput}&startAt=${startAtVal}&maxResults=${Api.JIRA.LIMIT}`;
  const result = await getTicketsFromJIRA(url);
  if (result.data.issues) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ticketData = result.data.issues.map((issue: any) => {
      return {
        id: issue.key,
        type: issue.fields.issuetype.name,
        summary: issue.fields.summary,
        description: issue.fields.description
          ? issue.fields.description.content[0].content[0].text
          : '',
      };
    });
    return {
      ticketData,
      pagination: {
        startAt: result.data.startAt,
        maxResults: result.data.maxResults,
        total: result.data.total,
      },
    };
  } else {
    throw { response: { status: StatusCodes.NOT_FOUND } };
  }
};

export const importTicketsBySprint = async (ticketsInput: string, startAt: string) => {
  const startAtVal: string | number = startAt ? startAt : 0;
  const url: string = `${Api.JIRA.V1_SPRINT}${ticketsInput}/issue?startAt=${startAtVal}&maxResults=${Api.JIRA.LIMIT}`;
  const result = await getTicketsFromJIRA(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ticketData = result.data.issues.map((issue: any) => {
    return {
      id: issue.key,
      type: issue.fields.issuetype.name,
      summary: issue.fields.summary,
      description: issue.fields.description ? issue.fields.description : '',
    };
  });
  return {
    ticketData,
    pagination: {
      startAt: result.data.startAt,
      maxResults: result.data.maxResults,
      total: result.data.total,
    },
  };
};

export const sendInvitationMailToUnregisteredUsers = async (
  unregisteredUserEmails: string[],
  pokerboard: Pokerboard,
) => {
  if (unregisteredUserEmails.length === 0) {
    return;
  }
  await createPokerboardInvites(unregisteredUserEmails, pokerboard);
  sendBulkMails(
    EmailSubject.SIGN_UP_TO_JOIN_POKERBOARD,
    EmailMessages.INVITE_FOR_SIGN_UP(pokerboard.name),
    unregisteredUserEmails,
  );
};

export const sendInvitationMailToVerifiedUsers = async (users: User[], pokerboard: Pokerboard) => {
  const receiverEmails = users
    .filter((user) => user.id !== pokerboard.manager)
    .map((user) => user.email);
  sendBulkMails(
    EmailSubject.POKERBOARD_INVITE,
    EmailMessages.POKERBOARD_INVITATION(pokerboard.name, pokerboard.id),
    receiverEmails,
  );
};

export const validateAcceptPokerboardInviteData = (data: object) => {
  try {
    return validateData(acceptPokerboardInviteSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validateCreatePokerboardData = (data: object) => {
  try {
    return validateData(createPokerboardSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};

export const validatePokerboardId = (data: object) => {
  try {
    return validateData(pokerboardIdSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
