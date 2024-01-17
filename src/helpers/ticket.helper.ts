import { In } from 'typeorm';

import { PlayerEstimates, TicketEstimateData } from '../constants/game';
import { ErrorMessages } from '../constants/message';
import { Ticket } from '../entity/ticket/model';
import { findTicket, updateTickets } from '../entity/ticket/repository';
import { findUsers } from '../entity/user/repository';
import { TicketsSchema } from '../schemas/ticket.schema';
import { validateData } from '../utils/common';
import { findUserTickets, saveUserTickets } from '../entity/userTicket/repository';
import { UserTicket } from '../entity/userTicket/model';
import customGetRepository from '../utils/db';

const createAndSaveUserTicket = async (
  ticket: Ticket,
  managerId: string,
  estimate: number,
  playerEstimates: PlayerEstimates,
) => {
  const userIds = Object.keys(playerEstimates);
  userIds.push(managerId);

  const users = await findUsers({ where: { id: In(userIds) } });
  const userTickets = await findUserTickets({
    where: { userId: In(userIds), ticketId: ticket.id },
  });

  if (userTickets.length != 0) {
    users.forEach((user) => {
      const index = userTickets.findIndex((userTicket) => userTicket.userId === user.id);
      if (userTickets[index].userId === managerId) {
        userTickets[index].estimate = estimate;
      } else {
        userTickets[index].estimate = playerEstimates[user.id].estimate;
        userTickets[index].estimateTime = playerEstimates[user.id].timeTaken;
      }
    });

    await saveUserTickets(userTickets);
  } else {
    const newUserTickets: UserTicket[] = [];
    const userTicketRepository = customGetRepository(UserTicket);

    users.forEach((user) => {
      const newUserTicket = userTicketRepository.create();
      newUserTicket.user = Promise.resolve(user);
      newUserTicket.ticket = Promise.resolve(ticket);
      if (user.id === managerId) {
        newUserTicket.estimate = estimate;
      } else {
        newUserTicket.estimate = playerEstimates[user.id].estimate;
        newUserTicket.estimateTime = playerEstimates[user.id].timeTaken;
      }
      newUserTickets.push(newUserTicket);
    });

    await userTicketRepository.save(newUserTickets);
  }
};

export const saveTicketEstimate = async (ticketEstimateData: TicketEstimateData) => {
  const { ticketId, estimate, managerId, playerEstimates } = ticketEstimateData;

  const ticket = await findTicket({ where: { id: ticketId, isActive: true } });
  ticket.estimate = estimate;
  await updateTickets([ticket]);

  await createAndSaveUserTicket(ticket, managerId, estimate, playerEstimates);
};

export const validateTicketData = (data: object) => {
  try {
    return validateData(TicketsSchema, data);
  } catch (error) {
    throw { message: ErrorMessages.INVALID_REQUEST_DATA, data: error.data };
  }
};
