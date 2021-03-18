import {MigrationInterface, QueryRunner, Table} from 'typeorm';
export class Telegram_history1616076484546 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_history',
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
            name: 'botId',
            type: 'int',
          },
          {
            name: 'beforeCommandId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'commandId',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'date',
            type: 'timestamp',
          },
        ],
      })
    );
  }
  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('telegram_history');
  }
}
