import { testUserRepository } from './user.repository.test';

export const testRepositories = () => {
  describe('Test User Repository', testUserRepository);
};
