import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {BotsEntity} from './bots.entity';
import {MenuEntity} from './menu.entity';

@Entity({name: 'telegram_commands'})
export class CommandsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  command: string;

  @OneToOne(() => BotsEntity)
  @JoinColumn()
  bot: BotsEntity;

  @Column()
  call: string;

  @Column()
  eachCall: string;

  @OneToOne(() => MenuEntity)
  @JoinColumn()
  selectMenu: MenuEntity;

  @OneToOne(() => MenuEntity, menu => menu.command)
  menu: MenuEntity;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  alias: BotsEntity;
}
