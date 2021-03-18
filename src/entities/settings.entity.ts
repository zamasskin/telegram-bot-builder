import {Entity, PrimaryColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import {BotsEntity} from './bots.entity';
import {MenuEntity} from './menu.entity';
import {CommandsEntity} from './commands.entity';

@Entity({name: 'telegram_settings'})
export class SettingsEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  chatId: number;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  command: CommandsEntity;

  @OneToOne(() => BotsEntity)
  @JoinColumn()
  bot: BotsEntity;

  @OneToOne(() => BotsEntity)
  @JoinColumn()
  selectBot: BotsEntity;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  selectCommand: CommandsEntity;
}
