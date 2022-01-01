import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DECK_TYPE, POKER_BOARD_STATUS } from '../constants/customTypes';
import { Group } from './Group';
import { UserInviteToPokerboard } from './PokerboardInvite';
import { Ticket } from './Ticket';
import { UserPokerboard } from './UserPokerboard';

// TO-DO: Add column validations
// Use camelCase naming for columns

@Entity()
export class Pokerboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  manager: string;

  @Column({
    name: 'deck_type',
  })
  deckType: DECK_TYPE;

  @Column({
    name: 'status',
  })
  status: POKER_BOARD_STATUS;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // many to many with group
  @ManyToMany(() => Group, (group) => group.pokerboards)
  @JoinTable()
  groups: Promise<Group[]>;

  // many to many with ticket
  @OneToMany(() => Ticket, (ticket) => ticket.pokerboard)
  tickets: Promise<Ticket[]>;

  // one to many with user_pokerboard
  @OneToMany(
    () => UserPokerboard,
    (userPokerboard) => userPokerboard.pokerboard
  )
  userPokerboard: Promise<UserPokerboard[]>;

  @OneToMany(() => UserInviteToPokerboard, (invite) => invite.pokerboard)
  unverifiedUsersInvite: Promise<UserInviteToPokerboard[]>;
}
