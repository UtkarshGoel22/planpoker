export const FieldNames = {
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  USERNAME: 'Username',
  EMAIL: 'Email',
  PASSWORD: 'Password',
};

export const FieldConstraints = {
  FIRST_NAME: { MAX: 50 },
  LAST_NAME: { MAX: 50 },
  MEMBERS: { MIN: 2 },
  USERNAME: { MIN: 4, MAX: 30 },
  PASSWORD: { MIN: 6, MAX: 30 },
};
