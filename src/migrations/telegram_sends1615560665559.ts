import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Telegram_sends1615560665559 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_sends',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'commandId',
            type: 'int',
          },
          {
            name: 'content',
            type: 'text',
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
  async down(queryRunner: QueryRunner) {}
}
