import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({name: 'telegram_users'})
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  language: string;
}
