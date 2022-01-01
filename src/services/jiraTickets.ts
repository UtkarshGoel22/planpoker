import axios from 'axios';
import * as dotenv from 'dotenv';
import { JIRA_API_HEADERS } from '../constants/jiraApi';
import { ErrorMessage } from '../constants/message';
dotenv.config();

export async function getJiraTickets(url: string) {
  return await axios.get(`${process.env.JIRA_BASE_URL}${url}`, {
    headers: {
      Authorization: `${JIRA_API_HEADERS.BASIC} ${Buffer.from(
        process.env.JIRA_AUTH
      ).toString(JIRA_API_HEADERS.BASE64)}`,
      Accept: 'application/json',
    },
  });
}

export function setResponseMessage(statusCode: number, statusText: string) {
  if (statusCode == 400) {
    return ErrorMessage.INCORRECT_INPUT;
  } else if (statusCode == 404) {
    return ErrorMessage.NO_TICKETS_FOUND;
  } else {
    return statusText;
  }
}
