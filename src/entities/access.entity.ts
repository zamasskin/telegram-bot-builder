import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import {UsersEntity} from './users.entity';
import {BotsEntity} from './bots.entity';

export type AccessType = 'R' | 'W';

@Entity({name: 'telegram_access'})
export class AccessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UsersEntity)
  @JoinColumn()
  user: UsersEntity;

  @OneToOne(() => BotsEntity)
  @JoinColumn()
  bot: BotsEntity;

  @Column()
  access: AccessType;
}
