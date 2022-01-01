import axios from 'axios';
import { estmateBodyType } from '../constants/game';
import { JIRA_API, JIRA_API_HEADERS } from '../constants/jiraApi';

/**
 * Function to add Estimate
 * @param issueId
 * @param estimate
 */
export const addEstimateOnJira = async (issueId: string, estimate: number) => {
  let estimateBody: estmateBodyType = {
    fields: {
      customfield_10016: estimate,
    },
  };

  const result = await axios
    .put(`${JIRA_API.BASE_URL}${JIRA_API.V3_ISSUE}${issueId}`, estimateBody, {
      headers: {
        Authorization: `${JIRA_API_HEADERS.BASIC} ${Buffer.from(
          process.env.JIRA_AUTH
        ).toString(JIRA_API_HEADERS.BASE64)}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
  return result;
};
