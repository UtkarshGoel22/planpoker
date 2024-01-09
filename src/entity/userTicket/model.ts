import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ColumnNames, TableNames } from '../../constants/common';
import { Ticket } from '../ticket/model';
import { User } from '../user/model';

@Entity({ name: TableNames.USER_TICKET })
export class UserTicket {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  estimate: number;

  @CreateDateColumn({ type: 'timestamp', name: ColumnNames.ESTIMATE_DATE })
  estimateDate: Date;

  @Column({ nullable: true, name: ColumnNames.ESTIMATE_TIME })
  estimateTime: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  ticketId: string;

  @ManyToOne(() => User, (user) => user.userTicket, { onDelete: 'CASCADE' })
  user: Promise<User>;

  @ManyToOne(() => Ticket, (ticket) => ticket.userTicket, { onDelete: 'CASCADE' })
  ticket: Promise<Ticket>;
}
