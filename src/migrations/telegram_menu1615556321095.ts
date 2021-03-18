import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Telegram_menu1615556321095 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_menu',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'col',
            type: 'int',
          },
          {
            name: 'row',
            type: 'int',
          },
          {
            name: 'parentId',
            type: 'int',
            default: 0,
          },
          {
            name: 'botId',
            type: 'int',
          },
          {
            name: 'commandId',
            type: 'int',
            isNullable: true,
          },
        ],
      })
    );
  }
  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('telegram_menu');
  }
}
