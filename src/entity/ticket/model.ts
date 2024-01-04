import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

import { TicketTypes } from "../../constants/enums";
import { ColumnNames } from "../../constants/common";
import { Pokerboard } from "../pokerboard/model";
import { UserTicket } from "../user_ticket/model";

@Entity()
export class Ticket {
  @PrimaryColumn()
  id: string;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  estimate: number;

  @Column()
  type: TicketTypes;

  @Column()
  order: number;

  @Column({ default: true, name: ColumnNames.IS_ACTIVE })
  isActive: boolean;

  @ManyToOne(() => Pokerboard, (pokerboard) => pokerboard.tickets)
  pokerboard: Promise<Pokerboard>;

  @OneToMany(() => UserTicket, (userTicket) => userTicket.ticket)
  userTicket: Promise<UserTicket>;
}
