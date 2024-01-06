import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ColumnNames } from '../../constants/common';
import { Token } from '../token/model';
import { Group } from '../group/model';
import { UserPokerboard } from '../user_pokerboard/model';
import { UserTicket } from '../user_ticket/model';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: ColumnNames.FIRST_NAME })
  firstName: string;

  @Column({ name: ColumnNames.LAST_NAME })
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true, name: ColumnNames.IS_ACTIVE })
  isActive: boolean;

  @Column({ default: false, name: ColumnNames.IS_VERIFIED })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', name: ColumnNames.CREATED_AT })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: ColumnNames.UPDATED_AT })
  updateAt: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Promise<Token[]>;

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Promise<Group[]>;

  @OneToMany(() => UserPokerboard, (userPokerboard) => userPokerboard.user)
  userPokerboard: Promise<UserPokerboard[]>;

  @OneToMany(() => UserTicket, (userTicket) => userTicket.user)
  userTicket: Promise<UserTicket[]>;
}
