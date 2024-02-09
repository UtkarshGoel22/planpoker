import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ColumnNames } from '../../constants/common';
import { User } from '../user/model';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true, name: ColumnNames.IS_ACTIVE })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', name: ColumnNames.CREATED_AT })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: ColumnNames.EXPIRED_AT })
  expiredAt!: Date;

  @Column({ type: 'timestamp', name: ColumnNames.EXPIRY_DATE })
  expiryDate: Date;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: Promise<User>;
}
