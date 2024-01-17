import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

import { Api } from '../constants/api';
import { ErrorMessages } from '../constants/message';
import config from '../settings/config';
import { JiraTicketCommentBody, JiraTicketEstimateBody } from '../types';

export const addCommentOnJira = async (issueId: string, comment: string) => {
  const commentBody: JiraTicketCommentBody = {
    body: {
      version: 1,
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: comment }] }],
    },
  };
  const result = await axios
    .post(`${Api.JIRA.BASE_URL}${Api.JIRA.V3_ISSUE}${issueId}${Api.JIRA.COMMENT}`, commentBody, {
      headers: {
        Authorization: `${Api.JIRA.HEADERS.BASIC} ${Buffer.from(process.env.JIRA_AUTH).toString(
          'base64',
        )}`,
        Accept: 'application/json',
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .then((_result) => {
      return true;
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((_err) => {
      return false;
    });
  return result;
};

export const addEstimateOnJira = async (issueId: string, estimate: number) => {
  const estimateBody: JiraTicketEstimateBody = {
    fields: { customfield_10016: estimate },
  };

  const result = await axios
    .put(`${Api.JIRA.BASE_URL}${Api.JIRA.V3_ISSUE}${issueId}`, estimateBody, {
      headers: {
        Authorization: `${Api.JIRA.HEADERS.BASIC} ${Buffer.from(process.env.JIRA_AUTH).toString(
          'base64',
        )}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .then((_result) => {
      return true;
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((_err) => {
      return false;
    });
  return result;
};

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

export const importComments = async (issueId: string) => {
  const fetchedComments = await axios
    .get(`${Api.JIRA.BASE_URL}${Api.JIRA.V3_ISSUE}${issueId}${Api.JIRA.COMMENT}`, {
      headers: {
        Authorization: `${Api.JIRA.HEADERS.BASIC} ${Buffer.from(config.JIRA_AUTH).toString(
          'base64',
        )}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      const comments = result.data.comments.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (comment: any) => comment.body.content[0].content[0].text,
      );
      return comments;
    })
    .catch((err) => {
      console.log('err', err.response.data);
      return err.response.data;
    });

  if (fetchedComments.errorMessages) {
    return [];
  } else {
    return fetchedComments;
  }
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
