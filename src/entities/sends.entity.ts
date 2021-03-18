import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  BeforeRemove,
} from 'typeorm';
import {CommandsEntity} from './commands.entity';

@Entity({name: 'telegram_sends'})
export class SendsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToOne(() => CommandsEntity)
  @JoinColumn()
  command: CommandsEntity;

  @Column()
  content: string;

  @Column()
  params: string;
}
