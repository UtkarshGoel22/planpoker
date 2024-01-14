import customGetRepository from '../../utils/db';
import { Pokerboard } from '../pokerboard/model';
import { Ticket } from './model';

export const getTicketsDetails = async (pokerboard: Pokerboard) => {
  const ticketRepository = customGetRepository(Ticket);
  const tickets = ticketRepository.find({
    where: { isActive: true, pokerboard: { id: pokerboard.id } },
    select: ['id', 'description', 'estimate', 'order', 'summary', 'type'],
    order: { order: 'ASC' },
  });
  return tickets;
};
