import {MigrationInterface, QueryRunner} from 'typeorm';
import * as SqlString from 'sqlstring';
import axios from 'axios';
import {telegramToken as token} from '../settings';

export class Telegram_bots1615797093791 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    const url = `https://api.telegram.org/bot${token}/getMe`;
    const response = await axios.get(url);
    if (!response.data) {
      throw new Error('response not found');
    }
    const {data} = response;
    if (!data.ok || !data.result) {
      throw new Error('data not found');
    }
    const result = data.result;
    const sql = SqlString.format('INSERT INTO telegram_bots SET ?', {
      id: 1,
      // date: new Date(),
      token,
      telegramId: result.id,
      username: result.username,
      name: result.first_name,
    });
    await queryRunner.query(sql);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query('DELETE FROM telegram_commands WHERE ID = ?', [1]);
  }
}
