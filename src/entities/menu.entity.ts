import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  AfterInsert,
} from 'typeorm';
import {BotsEntity} from './bots.entity';
import {CommandsEntity} from './commands.entity';

@Entity({name: 'telegram_menu'})
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  col: number;

  @Column()
  row: number;

  @OneToOne(() => MenuEntity)
  @JoinColumn()
  parent: MenuEntity;

  @OneToOne(() => BotsEntity)
  @JoinColumn()
  bot: BotsEntity;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  command: CommandsEntity;
}
