import {Entity, PrimaryGeneratedColumn, Column, AfterInsert} from 'typeorm';
import {MenuEntity} from './menu.entity';

@Entity({name: 'telegram_bots'})
export class BotsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  telegramId: number;

  @Column({default: new Date()})
  date: Date;

  @Column()
  username: string;

  @Column()
  name: string;
}
