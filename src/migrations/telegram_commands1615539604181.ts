import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class Telegram_commands1615539604181 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'telegram_commands',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            generationStrategy: 'increment',
            isGenerated: true,
          },
          {
            name: 'command',
            type: 'varchar',
          },
          {
            name: 'botId',
            type: 'int',
          },
          {
            name: 'call',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'eachCall',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'selectMenuId',
            type: 'int',
            default: 0,
          },
          {
            name: 'aliasId',
            type: 'int',
            isNullable: true,
          },
        ],
      })
    );
  }
  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable('telegram_commands');
  }
}
