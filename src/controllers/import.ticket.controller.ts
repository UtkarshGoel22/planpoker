import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import ResponseMessage from '../models/ResponseMessage';
import { JIRA_API } from '../constants/jiraApi';
import { ErrorMessage, SuccessMessage } from '../constants/message';
import { ImportByType } from '../constants/customTypes';
import { getJiraTickets, setResponseMessage } from '../services/jiraTickets';

dotenv.config();

export type jiraTicket = {
  id: number;
  type: string;
  summary: string;
  description: string;
};

export const importTicket = async (req: Request, res: Response) => {
  let { ticketsInput, importBy, startAt } = req.query;
  const responseMessage: ResponseMessage = {
    success: false,
    message: '',
    data: undefined,
  };
  if (importBy == ImportByType.ID) {
    const url: string = `${JIRA_API.V3_ISSUE}${ticketsInput}`;
    await getJiraTickets(url)
      .then((result) => {
        // console.log(
        //   'result',
        //   result.data.fields.description.content[0].content[0].text
        // );
        if (result.data) {
          let data: jiraTicket = {
            id: result.data.key,
            type: result.data.fields.issuetype.name,
            summary: result.data.fields.summary,
            description: result.data.fields.description
              ? result.data.fields.description.content[0].content[0].text
              : '',
          };
          let ticket = [];
          ticket.push(data);
          responseMessage.success = true;
          responseMessage.message =
            SuccessMessage.IMPORTED_TICKETS_SUCCESSFULLY;
          responseMessage.data = {
            ticketData: ticket,
            pagination: undefined,
          };
          res.status(200).json(responseMessage);
        }
      })
      .catch((err) => {
        if (err.response) {
          let status = err.response.status;
          responseMessage.message = setResponseMessage(
            status,
            err.response.statusText
          );
          res.status(status).json(responseMessage);
        } else if (err.request) {
          responseMessage.message = ErrorMessage.NO_TICKETS_FOUND;
          res.status(404).json(responseMessage);
        } else {
          responseMessage.message = ErrorMessage.SOMETHING_WENT_WRONG;
          res.status(500).json(responseMessage);
        }
      });
  } else if (importBy == ImportByType.JQL) {
    let startAtVal = startAt ? startAt : 0;
    const url = `${JIRA_API.V3_JQL}${ticketsInput}&startAt=${startAtVal}&maxResults=${JIRA_API.LIMIT}`;
    await getJiraTickets(url)
      .then((result) => {
        if (result.data.issues) {
          let data = result.data.issues.map((issue: any) => {
            return {
              id: issue.key,
              type: issue.fields.issuetype.name,
              summary: issue.fields.summary,
              description: issue.fields.description
                ? issue.fields.description.content[0].content[0].text
                : '',
            };
          });
          responseMessage.success = true;
          responseMessage.message =
            SuccessMessage.IMPORTED_TICKETS_SUCCESSFULLY;
          responseMessage.data = {
            ticketData: data,
            pagination: {
              startAt: result.data.startAt,
              maxResults: result.data.maxResults,
              total: result.data.total,
            },
          };
          res.status(200).json(responseMessage);
        } else {
          responseMessage.message = ErrorMessage.NO_TICKETS_FOUND;
          res.status(404).json(responseMessage);
        }
      })
      .catch((err) => {
        if (err.response) {
          let status = err.response.status;
          responseMessage.message = setResponseMessage(
            status,
            err.response.statusText
          );
          res.status(err.response.status).json(responseMessage);
        } else if (err.request) {
          responseMessage.message = ErrorMessage.NO_TICKETS_FOUND;
          res.status(404).json(responseMessage);
        } else {
          responseMessage.message = ErrorMessage.SOMETHING_WENT_WRONG;
          res.status(500).json(responseMessage);
        }
      });
  } else if (importBy == ImportByType.SPRINT) {
    let startAtVal = startAt ? startAt : 0;
    const url: string = `${JIRA_API.V1_SPRINT}${ticketsInput}/issue?startAt=${startAtVal}&maxResults=${JIRA_API.LIMIT}`;
    await getJiraTickets(url)
      .then((result) => {
        let data = result.data.issues.map((issue: any) => {
          return {
            id: issue.key,
            type: issue.fields.issuetype.name,
            summary: issue.fields.summary,
            description: issue.fields.description
              ? issue.fields.description
              : '',
          };
        });
        responseMessage.success = true;
        responseMessage.message = SuccessMessage.IMPORTED_TICKETS_SUCCESSFULLY;
        responseMessage.data = {
          ticketData: data,
          pagination: {
            startAt: result.data.startAt,
            maxResults: result.data.maxResults,
            total: result.data.total,
          },
        };
        res.status(200).json(responseMessage);
      })
      .catch((err) => {
        if (err.response) {
          let status = err.response.status;
          responseMessage.message = setResponseMessage(
            status,
            err.response.statusText
          );
          res.status(err.response.status).json(responseMessage);
        } else if (err.request) {
          responseMessage.message = ErrorMessage.NO_TICKETS_FOUND;
          res.status(404).json(responseMessage);
        } else {
          responseMessage.message = ErrorMessage.SOMETHING_WENT_WRONG;
          res.status(500).json(responseMessage);
        }
      });
  }
};
