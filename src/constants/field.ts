export const FieldNames = {
  DECK_TYPE: 'deckType',
  PASSWORD: 'password',
  MEMBERS: 'members',
};

export const FieldConstraints = {
  FIRST_NAME: { MAX: 50 },
  LAST_NAME: { MAX: 50 },
  MEMBERS: { MIN: 2 },
  USERNAME: { MIN: 4, MAX: 30 },
  PASSWORD: { MIN: 6, MAX: 30 },
  POKERBOARD_NAME: { MIN: 4, MAX: 30 },
  REQUIRED_FIELD: 1,
};
