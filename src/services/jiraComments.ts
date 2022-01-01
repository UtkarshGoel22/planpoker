import axios from 'axios';
import { commentBodyType } from '../constants/game';
import { JIRA_API, JIRA_API_HEADERS } from '../constants/jiraApi';

/**
 * Function for importing commments of a ticket
 * @param issueId
 */
export const importComments = async (issueId: string) => {
  const importCommentsResult = await axios
    .get(
      `${JIRA_API.BASE_URL}${JIRA_API.V3_ISSUE}${issueId}${JIRA_API.COMMENT}`,
      {
        headers: {
          Authorization: `${JIRA_API_HEADERS.BASIC} ${Buffer.from(
            process.env.JIRA_AUTH
          ).toString(JIRA_API_HEADERS.BASE64)}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
    .then((result) => {
      let comments = result.data.comments.map(
        (comment: any) => comment.body.content[0].content[0].text
      );
      return comments;
    })
    .catch((err) => {
      console.log('err', err.response.data);
      return err.response.data;
    });

  if (importCommentsResult.errorMessages) {
    return [];
  } else {
    return importCommentsResult;
  }
};

/**
 * Function for adding comments on Jira
 * @param issueId
 * @param comment
 */
export const addCommentOnJira = async (issueId: string, comment: string) => {
  let commentBody: commentBodyType = {
    body: {
      version: 1,
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: comment }] },
      ],
    },
  };
  const result = await axios
    .post(
      `${JIRA_API.BASE_URL}${JIRA_API.V3_ISSUE}${issueId}${JIRA_API.COMMENT}`,
      commentBody,
      {
        headers: {
          Authorization: `${JIRA_API_HEADERS.BASIC} ${Buffer.from(
            process.env.JIRA_AUTH
          ).toString(JIRA_API_HEADERS.BASE64)}`,
          Accept: 'application/json',
        },
      }
    )
    .then((result) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
  return result;
};
