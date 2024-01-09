import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ColumnNames } from '../../constants/common';
import { Pokerboard } from '../pokerboard/model';
import { User } from '../user/model';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  admin: string;

  @Column({ name: ColumnNames.COUNT_OF_MEMBERS })
  countOfMembers: number;

  @Column({ default: true, name: ColumnNames.IS_ACTIVE })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', name: ColumnNames.CREATED_AT })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: ColumnNames.UPDATED_AT })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.groups, { onDelete: 'CASCADE' })
  users: Promise<User[]>;

  @ManyToMany(() => Pokerboard, (pokerboard) => pokerboard.groups, { onDelete: 'CASCADE' })
  pokerboards: Promise<Pokerboard[]>;
}
