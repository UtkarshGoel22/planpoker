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
import { Group } from './Group';
import { Token } from './Token';
import { UserPokerboard } from './UserPokerboard';
import { UserTicket } from './UserTicket';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_verified',
  })
  isVerified: boolean;

  @Column({ unique: true, name: 'user_name' })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // one to many with token
  @OneToMany(() => Token, (token) => token.user)
  tokens: Promise<Token[]>;

  // many to many with group
  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Promise<Group[]>;

  // one to many with user_pokerboard
  @OneToMany(() => UserPokerboard, (userPokerboard) => userPokerboard.user)
  userPokerboard: Promise<UserPokerboard[]>;

  // one to many with user_ticket
  @OneToMany(() => UserTicket, (userTicket) => userTicket.user)
  userTicket: Promise<UserTicket[]>;
}
