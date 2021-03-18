import {MigrationInterface, QueryRunner} from 'typeorm';
import * as SqlString from 'sqlstring';

interface Command {
  id: number;
  command: string;
  botId: number;
  call?: string;
  eachCall?: string;
  selectMenuId: number;
}

const commands: Command[] = [
  {id: 1, command: '/start', botId: 1, selectMenuId: 0},
  {
    id: 2,
    command: '/my_bots',
    botId: 1,
    selectMenuId: 1,
    call: 'showBots',
    eachCall: 'selectBot',
  },
  {id: 3, command: '/instructions', botId: 1, selectMenuId: 0},
  {
    id: 4,
    command: '/addbot',
    botId: 1,
    selectMenuId: 3,
    eachCall: 'registerBot',
  },
  {id: 5, command: '/my_bots_back', botId: 1, selectMenuId: 0},
  {
    id: 6,
    command: '/create_new_bot_back',
    botId: 1,
    selectMenuId: 1,
    call: 'showBots',
  },
  {
    id: 7,
    command: '/select_bot',
    botId: 1,
    selectMenuId: 6,
  },
  {
    id: 8,
    command: '/my_comands',
    botId: 1,
    selectMenuId: 7,
    call: 'showCommands',
    eachCall: 'selectCommand',
  },
  {
    id: 9,
    command: '/select_bot_back',
    botId: 1,
    selectMenuId: 1,
    call: 'showBots',
  },
  {
    id: 10,
    command: '/create_command',
    botId: 1,
    selectMenuId: 9,
    eachCall: 'createCommand',
  },
  {
    id: 11,
    command: '/my_commands_back',
    botId: 1,
    selectMenuId: 6,
  },
  {
    id: 12,
    command: '/delete_bot',
    botId: 1,
    selectMenuId: 11,
    eachCall: 'unRegisterBot',
  },
  {
    id: 13,
    command: '/delete_bot_back',
    botId: 1,
    selectMenuId: 6,
  },
  {
    id: 14,
    command: '/create_command_back',
    botId: 1,
    selectMenuId: 7,
    call: 'showCommands',
  },
  {
    id: 15,
    command: '/select_command',
    botId: 1,
    selectMenuId: 14,
    eachCall: 'setCommandContent',
    call: 'showSelectCommand',
  },
  {
    id: 16,
    command: '/delete_command',
    botId: 1,
    selectMenuId: 15,
    eachCall: 'deleteCommand',
  },
  {
    id: 17,
    command: '/delete_command_back',
    botId: 1,
    selectMenuId: 14,
    call: 'showSelectCommand',
  },
  {
    id: 18,
    command: '/select_command_back',
    botId: 1,
    selectMenuId: 7,
    call: 'showCommands',
  },
  {
    id: 19,
    command: '/clearCommandContent',
    botId: 1,
    selectMenuId: 14,
    call: 'clearCommandContent',
  },
  {
    id: 20,
    command: '/my_command_call',
    botId: 1,
    selectMenuId: 14,
    call: 'callCommand',
  },

  {
    id: 21,
    command: '/add_command_call',
    botId: 1,
    selectMenuId: 20,
    call: 'showCommandCalls',
    eachCall: 'selectCommandCall',
  },
  {
    id: 22,
    command: '/add_command_call_back',
    botId: 1,
    selectMenuId: 14,
    call: 'showSelectCommand',
  },

  {
    id: 23,
    command: '/add_command_each_call',
    botId: 1,
    selectMenuId: 22,
    call: 'showCommandEachCalls',
    eachCall: 'selectCommandEachCall',
  },
  {
    id: 24,
    command: '/add_command_each_call_back',
    botId: 1,
    selectMenuId: 14,
    call: 'showSelectCommand',
  },
  {
    id: 25,
    command: '/delete_command_call',
    botId: 1,
    selectMenuId: 14,
    call: 'clearCommandCall',
  },
  {
    id: 26,
    command: '/remove_command_each_call',
    botId: 1,
    selectMenuId: 14,
    call: 'clearCommandEachCall',
  },
];

export class Telegram_commands1615797702146 implements MigrationInterface {
  async insertCommand(queryRunner: QueryRunner, params: Command) {
    await this.deterCommand(queryRunner, params.id);
    const sql = SqlString.format('INSERT INTO telegram_commands SET ?', params);
    return queryRunner.query(sql);
  }

  async deterCommand(queryRunner: QueryRunner, id: number) {
    return queryRunner.query('DELETE FROM telegram_commands WHERE ID = ?', [
      id,
    ]);
  }

  async up(queryRunner: QueryRunner) {
    const promises = commands.map(command =>
      this.insertCommand(queryRunner, command)
    );
    await Promise.all(promises);

    // Для пополнения системных данных
    const id = 99999;
    await this.insertCommand(queryRunner, {
      id: id,
      command: '/test',
      botId: 1,
      selectMenuId: 0,
    });
    await this.deterCommand(queryRunner, id);
  }

  async down(queryRunner: QueryRunner) {
    const promises = commands.map(command =>
      this.deterCommand(queryRunner, command.id)
    );
    await Promise.all(promises);
  }
}
