import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ColumnNames } from "../../constants/common";
import { DeckTypes, PokerBoardStatus } from "../../constants/enums";
import { Group } from "../group/model";
import { Ticket } from "../ticket/model";
import { UserPokerboard } from "../user_pokerboard/model";
import { UserInviteToPokerboard } from "../pokerboard_invite/model";

@Entity()
export class Pokerboard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  manager: string;

  @Column({ name: ColumnNames.DECK_TYPE })
  deckType: DeckTypes;

  @Column({ name: ColumnNames.STATUS })
  status: PokerBoardStatus;

  @Column({ default: true, name: ColumnNames.IS_ACTIVE })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp", name: ColumnNames.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: ColumnNames.UPDATED_AT })
  updatedAt: Date;

  @ManyToMany(() => Group, (group) => group.pokerboards)
  @JoinTable()
  groups: Promise<Group[]>;

  @OneToMany(() => Ticket, (ticket) => ticket.pokerboard)
  tickets: Promise<Ticket[]>;

  @OneToMany(() => UserPokerboard, (userPokerboard) => userPokerboard.pokerboard)
  userPokerboard: Promise<UserPokerboard[]>;

  @OneToMany(() => UserInviteToPokerboard, (invite) => invite.pokerboard)
  unverifiedUsersInvite: Promise<UserInviteToPokerboard[]>;
}
