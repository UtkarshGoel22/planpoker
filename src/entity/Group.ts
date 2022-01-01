import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pokerboard } from './Pokerboard';
import { User } from './User';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  admin: string;

  @Column({
    name: 'count_of_members',
  })
  countOfMembers: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // many to many with user
  @ManyToMany(() => User, (user) => user.groups)
  users: Promise<User[]>;

  // many to many with pokerboard
  @ManyToMany(() => Pokerboard, (pokerboard) => pokerboard.groups)
  pokerboards: Promise<Pokerboard[]>;
}
