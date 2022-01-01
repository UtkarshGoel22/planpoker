import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({
    nullable: true,
    name: 'expired_at',
  })
  expiredAt!: Date;

  @Column({
    type: 'datetime',
    name: 'expiry_date',
  })
  expiryDate: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // many to one with user
  @ManyToOne(() => User, (user) => user.tokens)
  user: Promise<User>;
}
