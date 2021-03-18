import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Telegram_settings1615562778219 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'chatId',
            type: 'int',
          },
          {
            name: 'commandId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'botId',
            type: 'int',
          },
          {
            name: 'selectBotId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'selectCommandId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'params',
            type: 'text',
            isNullable: true,
          },
        ],
      })
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('telegram_settings');
  }
}
