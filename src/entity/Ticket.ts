import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Pokerboard } from './Pokerboard';
import { UserTicket } from './UserTicket';
import { TICKET_TYPE } from '../constants/customTypes';

@Entity()
export class Ticket {
  @PrimaryColumn()
  id: string;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column({
    nullable: true,
  })
  estimate: number;

  @Column()
  type: TICKET_TYPE;

  @Column()
  order: number;

  // many to many with pokerboard
  @ManyToOne(() => Pokerboard, (pokerboard) => pokerboard.tickets)
  pokerboard: Promise<Pokerboard>;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;

  // one to many with user_ticket
  @OneToMany(() => UserTicket, (userTicket) => userTicket.ticket)
  userTicket: Promise<UserTicket>;
}
