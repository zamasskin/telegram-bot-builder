import {MigrationInterface, QueryRunner} from 'typeorm';
import * as SqlString from 'sqlstring';

interface Send {
  id: number;
  type: string;
  commandId: number;
  content: string;
  params?: string;
}

const helloMessage =
  'Добрый день, {{firstName}}!\n' +
  '{{botName}} поможет вам создать своего бота. С помощью {{botName}} вы сможете рассылать сообщения пользователям бота, создавать свои команды и красивые меню.\n' +
  'Чтобы добавить своего первого бота, используйте команду /addbot.';

const selectBotMessage = 'Укажите бота с которым хотите работать';

const createBotInstruction =
  "1️⃣ Перейдите к @BotFather. Для этого нажмите на его имя, а потом 'Send Message', если это потребуется.\n" +
  "2️⃣ Создайте нового бота у него. Для этого внутри @BotFather используйте команду 'newbot' (сначала вам нужно будет придумать название, оно может быть на русском; потом нужно придумать вашу ссылку, она должна быть на английском и обязательно заканчиваться на 'bot', например 'NewsBot').\n" +
  '3️⃣ Скопируйте API токен, который вам выдаст @BotFather\n' +
  '4️⃣ Возвращайтесь обратно в @TelegramBigBot и пришлите скопированный API токен в ответ на это сообщение.';

const myBotMessage = 'Добавьте новую комманду, или настройте бот';

const createCommands = 'Введите название комманды';

const myCommands = 'Укажите команду с которой хотите работать';

const unregisterBot = 'Удалить бота? Да/Нет';

const deleteCommand = 'Удалить комманду? Да/Нет';

const botMenu = 'Меню бота';
const commandMenu = 'Меню комманды';

const myCommandMessage = 'Тут будет описание комманды';

const clearCommandCont = 'Контент комманды успешно очищен';
const callCommandMess = 'Добавление контента';

const callMessage = 'Прикрепите скрипт из списка выше';
const callEachMessage = 'Прикрепите скрипт из списка выше';

const sends: Send[] = [
  {id: 1, type: 'message', commandId: 1, content: helloMessage},
  {id: 2, type: 'message', commandId: 2, content: selectBotMessage},
  {id: 3, type: 'message', commandId: 4, content: createBotInstruction},
  {id: 4, type: 'message', commandId: 5, content: 'Главное меню'},
  {id: 5, type: 'message', commandId: 6, content: 'Выбор ботов'},
  {id: 6, type: 'message', commandId: 7, content: myBotMessage},
  {id: 7, type: 'message', commandId: 8, content: myCommands},
  {id: 8, type: 'message', commandId: 9, content: 'Главное меню'},
  {id: 9, type: 'message', commandId: 10, content: createCommands},
  {id: 10, type: 'message', commandId: 11, content: botMenu},
  {id: 11, type: 'message', commandId: 12, content: unregisterBot},
  {id: 12, type: 'message', commandId: 13, content: botMenu},
  {id: 13, type: 'message', commandId: 14, content: botMenu},
  {id: 14, type: 'message', commandId: 15, content: myCommandMessage},
  {id: 15, type: 'message', commandId: 16, content: deleteCommand},
  {id: 16, type: 'message', commandId: 17, content: commandMenu},
  {id: 17, type: 'message', commandId: 18, content: commandMenu},
  {id: 18, type: 'message', commandId: 19, content: clearCommandCont},
  {id: 19, type: 'message', commandId: 20, content: callCommandMess},
  {id: 20, type: 'message', commandId: 21, content: callMessage},
  {id: 21, type: 'message', commandId: 22, content: commandMenu},
  {id: 22, type: 'message', commandId: 23, content: callEachMessage},
  {id: 23, type: 'message', commandId: 24, content: commandMenu},
];

export class Telegram_sends1615797752352 implements MigrationInterface {
  async insertSend(queryRunner: QueryRunner, params: Send) {
    await this.deterSend(queryRunner, params.id);
    const sql = SqlString.format('INSERT INTO telegram_sends SET ?', params);
    return queryRunner.query(sql);
  }

  async deterSend(queryRunner: QueryRunner, id: number) {
    return queryRunner.query('DELETE FROM telegram_sends WHERE ID = ?', [id]);
  }

  async up(queryRunner: QueryRunner) {
    const promises = sends.map(send => this.insertSend(queryRunner, send));
    await Promise.all(promises);

    const id = 99999;
    await this.insertSend(queryRunner, {
      id,
      type: 'message',
      commandId: 0,
      content: '',
    });
    await this.deterSend(queryRunner, id);
  }

  async down(queryRunner: QueryRunner) {
    const promises = sends.map(send => this.deterSend(queryRunner, send.id));
    await Promise.all(promises);
  }
}
