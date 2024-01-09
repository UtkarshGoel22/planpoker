import { testUserMiddleware } from './user.middleware.test';

export const testMiddlewares = () => {
  describe('Test User Registration Middleware', testUserMiddleware);
};
