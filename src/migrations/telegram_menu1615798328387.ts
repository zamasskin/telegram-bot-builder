import {MigrationInterface, QueryRunner} from 'typeorm';
import * as SqlString from 'sqlstring';

interface Menu {
  id: number;
  name: string;
  col: number;
  row: number;
  parentId: number;
  botId: number;
  commandId: number;
}

const menus: Menu[] = [
  {
    id: 1,
    name: 'Мои боты',
    col: 1,
    row: 1,
    parentId: 0,
    botId: 1,
    commandId: 2,
  },
  {
    id: 2,
    name: 'Инструкции',
    col: 1,
    row: 2,
    parentId: 0,
    botId: 1,
    commandId: 3,
  },
  {
    id: 3,
    name: 'Создать нового',
    col: 1,
    row: 1,
    parentId: 1,
    botId: 1,
    commandId: 4,
  },
  {
    id: 4,
    name: 'Назад',
    col: 1,
    row: 99999,
    parentId: 1,
    botId: 1,
    commandId: 5,
  },
  {
    id: 5,
    name: 'Назад',
    col: 1,
    row: 1,
    parentId: 3,
    botId: 1,
    commandId: 6,
  },
  {
    id: 6,
    name: 'Мой бот',
    col: 1,
    row: 1,
    parentId: -1,
    botId: 1,
    commandId: 7,
  },
  {
    id: 7,
    name: 'Мои комманды',
    col: 1,
    row: 1,
    parentId: 6,
    botId: 1,
    commandId: 8,
  },
  {
    id: 8,
    name: 'Назад',
    col: 1,
    row: 99999,
    parentId: 6,
    botId: 1,
    commandId: 9,
  },
  {
    id: 9,
    name: 'Создать комманду',
    col: 1,
    row: 1,
    parentId: 7,
    botId: 1,
    commandId: 10,
  },
  {
    id: 10,
    name: 'Назад',
    col: 1,
    row: 99999,
    parentId: 7,
    botId: 1,
    commandId: 11,
  },
  {
    id: 11,
    name: 'Удалить бота',
    col: 1,
    row: 99998,
    parentId: 6,
    botId: 1,
    commandId: 12,
  },
  {
    id: 12,
    name: 'Назад',
    col: 1,
    row: 1,
    parentId: 11,
    botId: 1,
    commandId: 13,
  },
  {
    id: 13,
    name: 'Назад',
    col: 1,
    row: 1,
    parentId: 9,
    botId: 1,
    commandId: 14,
  },
  {
    id: 14,
    name: 'Моя комманда',
    col: 1,
    row: 1,
    parentId: -1,
    botId: 1,
    commandId: 15,
  },
  {
    id: 15,
    name: 'Удалить комманду',
    col: 1,
    row: 99998,
    parentId: 14,
    botId: 1,
    commandId: 16,
  },
  {
    id: 16,
    name: 'Назад',
    col: 1,
    row: 1,
    parentId: 15,
    botId: 1,
    commandId: 17,
  },
  {
    id: 17,
    name: 'Назад',
    col: 1,
    row: 99999,
    parentId: 14,
    botId: 1,
    commandId: 18,
  },
  {
    id: 18,
    name: 'Очистить контент',
    col: 1,
    row: 1,
    parentId: 14,
    botId: 1,
    commandId: 19,
  },
  {
    id: 19,
    name: 'Проверить комманду',
    col: 1,
    row: 2,
    parentId: 14,
    botId: 1,
    commandId: 20,
  },

  {
    id: 20,
    name: 'Добавление скрипта',
    col: 1,
    row: 1,
    parentId: -1,
    botId: 1,
    commandId: 21,
  },
  {
    id: 21,
    name: 'Назад',
    col: 1,
    row: 1,
    parentId: 20,
    botId: 1,
    commandId: 22,
  },
  {
    id: 22,
    name: 'Добавление пошагового скрипта',
    col: 1,
    row: 1,
    parentId: -1,
    botId: 1,
    commandId: 23,
  },
  {
    id: 23,
    name: 'Назад',
    col: 1,
    row: 1,
    parentId: 22,
    botId: 1,
    commandId: 24,
  },
  {
    id: 24,
    name: 'Добавить скрипт',
    col: 1,
    row: 3,
    parentId: 14,
    botId: 1,
    commandId: 21,
  },
  {
    id: 25,
    name: 'Удалить скрипт',
    col: 1,
    row: 3,
    parentId: 14,
    botId: 1,
    commandId: 25,
  },
  {
    id: 26,
    name: 'Добавить пошаговый скрипт',
    col: 1,
    row: 4,
    parentId: 14,
    botId: 1,
    commandId: 23,
  },
  {
    id: 27,
    name: 'Удалить пошаговый скрипт',
    col: 1,
    row: 4,
    parentId: 14,
    botId: 1,
    commandId: 26,
  },
];

export class Telegram_menu1615798328387 implements MigrationInterface {
  async insertMenu(queryRunner: QueryRunner, params: Menu) {
    await this.deterMenu(queryRunner, params.id);
    const sql = SqlString.format('INSERT INTO telegram_menu SET ?', params);
    return queryRunner.query(sql);
  }

  async deterMenu(queryRunner: QueryRunner, id: number) {
    return queryRunner.query('DELETE FROM telegram_menu WHERE ID = ?', [id]);
  }

  async up(queryRunner: QueryRunner) {
    const promises = menus.map(menu => this.insertMenu(queryRunner, menu));
    await Promise.all(promises);

    const id = 99999;
    await this.insertMenu(queryRunner, {
      id,
      name: 'test',
      col: 1,
      row: 1,
      commandId: 0,
      parentId: -1,
      botId: 1,
    });
    await this.deterMenu(queryRunner, id);
  }

  async down(queryRunner: QueryRunner) {
    const promises = menus.map(menu => this.deterMenu(queryRunner, menu.id));
    await Promise.all(promises);
  }
}
