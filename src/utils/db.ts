import { EntityTarget, Repository } from 'typeorm';

import config from '../settings/config';
import dataSource from '../settings/ormconfig';
import { Environments } from '../constants/common';

const customGetRepository = <T>(entity: EntityTarget<T>): Repository<T> => {
  dataSource.AppDataSource.getRepository(entity);
  return config.NODE_ENV === Environments.TEST
    ? dataSource.TestDataSource.getRepository(entity)
    : dataSource.AppDataSource.getRepository(entity);
};

export default customGetRepository;
