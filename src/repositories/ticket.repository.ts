import { getRepository, In } from 'typeorm';
import { playerEstimatesType } from '../constants/game';
import { Ticket } from '../entity/Ticket';
import { User } from '../entity/User';
import { UserTicket } from '../entity/UserTicket';

export type saveTicketEstimateDBInput = {
  ticketId: string;
  managerId: string;
  estimate: number;
  playerEstimates: playerEstimatesType;
};

export const saveTicketEstimateDB = async (
  input: saveTicketEstimateDBInput
) => {
  let { ticketId, estimate, managerId, playerEstimates } = input;
  const ticketRepo = getRepository(Ticket);
  const ticket = await ticketRepo.findOne({
    where: { id: ticketId, isActive: true },
  });
  await setTicketEstimate(ticket, estimate);
  await createAndSaveUserTicket(ticket, managerId, estimate, playerEstimates);
};

const setTicketEstimate = async (ticket: Ticket, estimate: number) => {
  const ticketRepo = getRepository(Ticket);
  ticket.estimate = estimate;
  await ticketRepo.save(ticket);
};

const createAndSaveUserTicket = async (
  ticket: Ticket,
  managerId: string,
  estimate: number,
  playerEstimates: playerEstimatesType
) => {
  const userTicketRepo = getRepository(UserTicket);

  let users = Object.keys(playerEstimates);
  users.push(managerId);

  let savedUsers = await getRepository(User).find({
    id: In(users),
  });

  let savedUsersTicket = await userTicketRepo.find({
    where: { userId: In(users), ticketId: ticket.id },
  });

  if (savedUsersTicket.length != 0) {
    for (const user of savedUsers) {
      const index = savedUsersTicket.findIndex(
        (savedUserTicket) => savedUserTicket.userId == user.id
      );

      if (savedUsersTicket[index].userId == managerId) {
        savedUsersTicket[index].estimate = estimate;
      } else {
        savedUsersTicket[index].estimate = playerEstimates[user.id].estimate;
        savedUsersTicket[index].estimateTime =
          playerEstimates[user.id].timeTaken;
      }
    }
    await userTicketRepo.save(savedUsersTicket);
  } else {
    let userTickets: UserTicket[] = [];
    for (const user of savedUsers) {
      const newUserTicket = userTicketRepo.create();
      newUserTicket.user = Promise.resolve(user);
      newUserTicket.ticket = Promise.resolve(ticket);
      if (user.id == managerId) {
        newUserTicket.estimate = estimate;
      } else {
        newUserTicket.estimate = playerEstimates[user.id].estimate;
        newUserTicket.estimateTime = playerEstimates[user.id].timeTaken;
      }
      userTickets.push(newUserTicket);
    }
    await userTicketRepo.save(userTickets);
  }
};
