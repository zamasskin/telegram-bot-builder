import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Telegram_users1616575970457 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'telegramId',
            type: 'int',
          },
          {
            name: 'username',
            type: 'varchar',
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'language',
            type: 'varchar',
          },
        ],
      })
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('telegram_users');
  }
}
