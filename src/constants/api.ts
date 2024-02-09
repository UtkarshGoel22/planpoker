export const Api = {
  JIRA: {
    BASE_URL: 'https://pokerplaner.atlassian.net/rest',
    V3_ISSUE: '/api/3/issue/',
    V3_JQL: '/api/3/search?jql=',
    V1_SPRINT: '/agile/1.0/sprint/',
    START_AT: '&startAt=',
    MAX_RESULTS: '&maxResults=5',
    COMMENT: '/comment',
    LIMIT: 5,
    HEADERS: {
      BASIC: 'Basic',
      POST: 'POST',
    },
  },
};
