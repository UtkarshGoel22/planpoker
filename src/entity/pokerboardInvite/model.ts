import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ColumnNames } from '../../constants/common';
import { Pokerboard } from '../pokerboard/model';

@Entity()
export class UserInviteToPokerboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  pokerboardId: string;

  @Column({ default: false, name: ColumnNames.IS_VERIFIED })
  isVerified: boolean;

  @CreateDateColumn({ type: 'timestamp', name: ColumnNames.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: ColumnNames.UPDATED_AT })
  updatedAt: Date;

  @ManyToOne(() => Pokerboard, (board) => board.unverifiedUsersInvite, { onDelete: 'CASCADE' })
  pokerboard: Promise<Pokerboard>;
}
