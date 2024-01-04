import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ColumnNames, TableNames } from "../../constants/common";
import { User } from "../user/model";
import { Ticket } from "../ticket/model";

@Entity({ name: TableNames.USER_TICKET })
export class UserTicket {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  estimate: number;

  @CreateDateColumn({ type: "timestamp", name: ColumnNames.ESTIMATE_DATE })
  estimateDate: Date;

  @Column({ nullable: true, name: ColumnNames.ESTIMATE_TIME })
  estimateTime: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  ticketId: string;

  @ManyToOne(() => User, (user) => user.userTicket)
  user: Promise<User>;

  @ManyToOne(() => Ticket, (ticket) => ticket.userTicket)
  ticket: Promise<Ticket>;
}
