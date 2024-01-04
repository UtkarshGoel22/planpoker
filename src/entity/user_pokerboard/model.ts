import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { ColumnNames, TableNames } from "../../constants/common";
import { InviteStatus, UserRoles } from "../../constants/enums";
import { User } from "../user/model";
import { Pokerboard } from "../pokerboard/model";

@Entity({ name: TableNames.USER_POKERBOARD })
export class UserPokerboard {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  role: UserRoles;

  @Column({ name: ColumnNames.INVITE_STATUS })
  inviteStatus: InviteStatus;

  @Column({ default: true, name: ColumnNames.IS_ACTIVE })
  isActive: boolean;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  pokerboardId: string;

  @ManyToOne(() => User, (user) => user.userPokerboard)
  user!: Promise<User>;

  @ManyToOne(() => Pokerboard, (pokerboard) => pokerboard.userPokerboard)
  pokerboard!: Promise<Pokerboard>;
}
