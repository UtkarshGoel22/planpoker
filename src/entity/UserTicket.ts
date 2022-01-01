import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TableName } from '../constants/message';
import { Ticket } from './Ticket';
import { User } from './User';

@Entity({ name: TableName.userTicket })
export class UserTicket {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  estimate: number;

  @CreateDateColumn({ type: 'timestamp', name: 'estimate_date' })
  estimateDate: Date;

  @Column({
    nullable: true,
    name: 'estimate_time',
  })
  estimateTime: number;

  @Column({
    nullable: true,
  })
  userId: string;

  @Column({
    nullable: true,
  })
  ticketId: string;

  // many to one with user
  @ManyToOne(() => User, (user) => user.userTicket)
  user: Promise<User>;

  // many to one with ticket
  @ManyToOne(() => Ticket, (ticket) => ticket.userTicket)
  ticket: Promise<Ticket>;
}
