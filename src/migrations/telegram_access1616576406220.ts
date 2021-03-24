import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Telegram_access1616576406220 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_access',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'botId',
            type: 'int',
          },
          {
            name: 'access',
            type: 'char',
            length: '1',
          },
        ],
      })
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('telegram_access');
  }
}
