import * as http from 'http';
import { DataSource } from 'typeorm';

import server from '../src/app';
import { testControllers } from './controllers/test.controllers';
import { testRepositories } from './entity/test.repositories';
import { testHelpers } from './helpers/test.helpers';
import { testMiddlewares } from './middlewares/test.middlewares';
import { sendMailMock } from './test.mocks';
import { TestConfig } from './test.settings';
import {
  clearTestingDatabases,
  closeTestingConnections,
  createTestingConnections,
  dropTestingDatabases,
} from './test.util';
import { testUtils } from './utils/test.utils';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({ sendMail: sendMailMock })),
}));

describe('Main', () => {
  let connection: DataSource;
  let testServer: http.Server;

  beforeAll(async () => {
    // Initialize database connection.
    connection = await createTestingConnections();

    // Initialize test server.
    testServer = server.listen(TestConfig.PORT, () =>
      console.log('Test server started listening on port', TestConfig.PORT),
    );

    try {
      await connection.runMigrations();
      console.log('Migrations ran successfully');
    } catch (error) {
      await dropTestingDatabases(connection);
      await closeTestingConnections(connection);
      throw error;
    }
  });

  afterAll(async () => {
    testServer.close(() => console.log('Test server stopped listening'));
    jest.clearAllMocks();
    await dropTestingDatabases(connection);
    await closeTestingConnections(connection);
  });

  afterEach(async () => {
    await clearTestingDatabases(connection);
  });

  describe('Controllers', testControllers);
  describe('Helpers', testHelpers);
  describe('Middlewares', testMiddlewares);
  describe('Repositories', testRepositories);
  describe('Utils', testUtils);
});
