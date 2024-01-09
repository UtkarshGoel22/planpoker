import { DataSource } from 'typeorm';

import { User } from '../src/entity/user/model';
import dataSource from '../src/settings/ormconfig';
import customGetRepository from '../src/utils/db';
import { TestData } from './test.data';
import { TestUser } from './test.types';

export const createTestingConnections = async (): Promise<DataSource> => {
  return dataSource.TestDataSource.initialize();
};

export const closeTestingConnections = async (connection: DataSource): Promise<void> => {
  return connection.isInitialized ? connection.destroy() : undefined;
};

export const clearTestingDatabases = async (connection: DataSource) => {
  const entities = connection.entityMetadatas;
  await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);
  for (const entity of entities) {
    await customGetRepository(entity.name).clear();
  }
  await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);
};

export const dropTestingDatabases = async (connection: DataSource): Promise<void> => {
  return connection.dropDatabase();
};

export const createTestUser = async (data: TestUser = {}) => {
  const userData = { ...TestData.USER, ...data };
  const userRepository = customGetRepository(User);
  const user = userRepository.create(userData);
  await userRepository.save(user);
};
