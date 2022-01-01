import { getRepository } from 'typeorm';
import { ticketDetails } from '../controllers/user.controller';
import { Ticket } from '../entity/Ticket';

export const updateTicketOrder = async (
  ticketId: string,
  orderValue: number
) => {
  let ticket = await getRepository(Ticket).findOne({
    where: { id: ticketId, isActive: true },
  });
  ticket.order = orderValue;
  await getRepository(Ticket).save(ticket);
};

export const updateUnEstimatedTickets = async (
  unEstimatedTickets: Ticket[]
) => {
  for (let ticket of unEstimatedTickets) {
    ticket.isActive = false;
  }
  await getRepository(Ticket).save(unEstimatedTickets);
};
