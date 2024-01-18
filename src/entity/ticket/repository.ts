import { FindManyOptions } from 'typeorm';

import { TicketDetails } from '../../types';
import customGetRepository from '../../utils/db';
import { Pokerboard } from '../pokerboard/model';
import { Ticket } from './model';

export const findTickets = async (findOptions: FindManyOptions<Ticket>): Promise<Ticket[]> => {
  const ticketRepository = customGetRepository(Ticket);
  return ticketRepository.find(findOptions);
};

export const getTicketsDetails = async (pokerboard: Pokerboard): Promise<Ticket[]> => {
  const ticketRepository = customGetRepository(Ticket);
  const tickets = ticketRepository.find({
    where: { isActive: true, pokerboard: { id: pokerboard.id } },
    select: ['id', 'description', 'estimate', 'order', 'summary', 'type'],
    order: { order: 'ASC' },
  });
  return tickets;
};

export const saveTickets = async (tickets: TicketDetails[], pokerboard: Pokerboard) => {
  const ticketRepository = customGetRepository(Ticket);
  const newTickets: Ticket[] = [];
  let count = (await pokerboard.tickets).length;
  tickets.forEach((ticket) => {
    const newTicket = ticketRepository.create();
    newTicket.id = ticket.id;
    newTicket.type = ticket.type;
    newTicket.summary = ticket.summary;
    newTicket.description = ticket.description;
    newTicket.order = count + 1;
    newTicket.pokerboard = Promise.resolve(pokerboard);
    count += 1;
    newTickets.push(newTicket);
  });
  ticketRepository.save(newTickets);
};
