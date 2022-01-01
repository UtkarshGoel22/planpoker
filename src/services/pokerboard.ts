import { getRepository } from 'typeorm';
import { POKER_BOARD_STATUS } from "../constants/customTypes";
import { Pokerboard } from '../entity/Pokerboard';
import { Ticket } from '../entity/Ticket';
import { getPokerboardById } from '../repositories/pokerBoard.repository';
import { updateUnEstimatedTickets } from './tickets';

export const updateUnestimatedTicketsAndPokerboardStatus = async (
  tickets: Ticket[],
  currentTicketIndex: number,
  pokerboardId: string,
  status: POKER_BOARD_STATUS
) => {
  const len = tickets.length;
  let unEstimatedTickets: Ticket[] = [];
  if (!tickets[currentTicketIndex].estimate) {
    unEstimatedTickets = tickets.slice(currentTicketIndex);
  } else {
    if (
      currentTicketIndex != len - 1 &&
      !tickets[currentTicketIndex + 1].estimate
    ) {
      unEstimatedTickets = tickets.slice(currentTicketIndex + 1);
    }
  }
  await updateUnEstimatedTickets(unEstimatedTickets);
  await updatePokerboardStatus(pokerboardId, status);
};

export const updatePokerboardStatus = async (
  pokerboardId: string,
  status: POKER_BOARD_STATUS
) => {
  const pokerboard = await getPokerboardById(pokerboardId);
  pokerboard.status = status;
  await getRepository(Pokerboard).save(pokerboard);
};
