import { FindManyOptions } from 'typeorm';
import customGetRepository from '../../utils/db';
import { UserTicket } from './model';

export const findUserTickets = async (
  findOptions: FindManyOptions<UserTicket>,
): Promise<UserTicket[]> => {
  const userTicketRepository = customGetRepository(UserTicket);
  return userTicketRepository.find(findOptions);
};

export const saveUserTickets = async (userTickets: UserTicket[]): Promise<void> => {
  const userTicketRepository = customGetRepository(UserTicket);
  userTicketRepository.save(userTickets);
};
