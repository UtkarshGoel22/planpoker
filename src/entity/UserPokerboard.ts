import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TableName } from '../constants/message';
import { INVITE_STATUS, ROLE_TYPE } from '../constants/customTypes';
import { Pokerboard } from './Pokerboard';
import { User } from './User';

@Entity({ name: TableName.userPokerboard })
export class UserPokerboard {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  role: ROLE_TYPE;

  @Column({
    name: 'invite_status',
  })
  inviteStatus: INVITE_STATUS;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    nullable: true,
  })
  userId: string;

  @Column({
    nullable: true,
  })
  pokerboardId: string;

  // many to one with user
  @ManyToOne(() => User, (user) => user.userPokerboard)
  user!: Promise<User>;

  // many to one with pokerboard
  @ManyToOne(() => Pokerboard, (pokerboard) => pokerboard.userPokerboard)
  pokerboard!: Promise<Pokerboard>;
}
