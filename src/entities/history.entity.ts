import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {BotsEntity} from './bots.entity';
import {CommandsEntity} from './commands.entity';

@Entity({name: 'telegram_history'})
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @OneToOne(() => BotsEntity)
  @JoinColumn()
  bot: BotsEntity;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  command: CommandsEntity;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  beforeCommand: CommandsEntity;

  @Column()
  message: string;
}
