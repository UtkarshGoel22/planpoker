import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { Api } from '../constants/api';
import { ErrorMessages } from '../constants/message';
import config from '../settings/config';

export const getTicketsFromJIRA = async (url: string) => {
  return await axios.get(`${Api.JIRA.BASE_URL}${url}`, {
    headers: {
      Authorization: `${Api.JIRA.HEADERS.BASIC} ${Buffer.from(config.JIRA_AUTH).toString(
        'base64',
      )}`,
      Accept: 'application/json',
    },
  });
};

export const setImportTicketResposneMessage = (statusCode: number, statusText: string) => {
  if (statusCode == StatusCodes.BAD_REQUEST) {
    return ErrorMessages.INCORRECT_INPUT;
  } else if (statusCode == StatusCodes.NOT_FOUND) {
    return ErrorMessages.NO_TICKETS_FOUND;
  } else {
    return statusText;
  }
};
