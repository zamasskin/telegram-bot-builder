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
  'Добрый день, {{from.first_name}}!\n' +
  '{{botInfo.first_name}} поможет вам создать своего бота. С помощью {{botInfo.first_name}} вы сможете рассылать сообщения пользователям бота, создавать свои команды и красивые меню.\n' +
  'Чтобы добавить своего первого бота, используйте команду /addbot.';

const selectBotMessage = 'Укажите бота с которым хотите работать';

const createBotInstruction =
  "1️⃣ Перейдите к @BotFather. Для этого нажмите на его имя, а потом 'Send Message', если это потребуется.\n" +
  "2️⃣ Создайте нового бота у него. Для этого внутри @BotFather используйте команду 'newbot' (сначала вам нужно будет придумать название, оно может быть на русском; потом нужно придумать вашу ссылку, она должна быть на английском и обязательно заканчиваться на 'bot', например 'NewsBot').\n" +
  '3️⃣ Скопируйте API токен, который вам выдаст @BotFather\n' +
  '4️⃣ Возвращайтесь обратно в @{{botInfo.username}} и пришлите скопированный API токен в ответ на это сообщение.';

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

const instruction = `
* /help_add_bot - Инструкция по добавлентю бота
* /help_remove_bot - Инструкция по удалению бота
* /help_add_command - Инструкция по добавлентю комманды
* /help_remove_command - Инструкция по удалению комманды
* /help_edit_content_command - Инструкция по редактирования контента комманды

* /help_command_call - Описание скриптов комманды
* /help_command_each_call - Описание пошаговых скриптов комманды
`;

const iAddBot =
  'Для добавления новового бота используйте команду /addbot, ' +
  'или перейдите в Мои ботты > содать нового бота. Внутри следуйте инструкциям. ' +
  'После добавления вы поподаете в меню бота';

const iRemoveBot =
  'Для удаления бота перейдите в Мои боты, ' +
  'в данном меню выберте Вашего бота, даллее нажмите на пункт меню Удалить бота. ' +
  'В полее ввода наберите Да и или y. После удаления бота вы попадете в меню выбора бота.';

const iAddCommand =
  'Для создания комманды перейдите в Мои боты, ' +
  'в данном меню выберте Вашего бота, в меню бота перейдите в Мои комманда > Создать коммаду. ' +
  'В полле ввода введите название комманды, например /my_commands. ' +
  'После содания коммады Вы по попадаете в меню комманды';

const iRemoveCommand =
  'Для удаления комманды перейдите в Мои боты, ' +
  'в данном меню выберте Вашего бота, потом выберите коммаду которую хотите удалить. ' +
  'Даллее нажмите на пункт меню Удалить комманду. ' +
  'В полее ввода наберите Да и или y. После удаления коммадны вы попадете в меню выбора комманд.';

const iEditCommand =
  'Для редактирования комманды перейдите в Мои боты, ' +
  'в данном меню выберте Вашего бота, потом выберите коммаду которую хотите редактировать. \n\n' +
  'Вся информация введенная в поле ввода будет сохранена. Имеено эта информация будет показываться ' +
  'при вызове вашей комманды \n' +
  'Для сброса содержимого коммады нажмите на пункт меню «Очистить контент»\n\n' +
  'Также к команде вы можете прикрепить скрипт(/help_command_call) или пошаговый скрипт(/help_command_each_call)\n' +
  'Обычные скрипты(/help_command_call) блокируют вызов Вашего контента';

const iCall =
  'Данные скрипты пишутся разработчиками, ' +
  'и выполняются толко тогда, кода вы вызываете комманду.\n' +
  'Данные скрипты блокируют вывод контента комманды, и одают контент, который выводит скрипт';

const iEachCall =
  'Данные скрипты пишутся разработчиками, ' +
  'и выполняются после вызова коммады, когда вы что-то набираете в поле ввода и отправляете боту.\n' +
  'Данные скрипты не блокируют вывод контента';

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
  {id: 24, type: 'message', commandId: 3, content: instruction},
  {id: 25, type: 'message', commandId: 27, content: iAddBot},
  {id: 26, type: 'video', commandId: 27, content: 'assert/create_bot.mov'},
  {id: 27, type: 'message', commandId: 28, content: iRemoveBot},
  {id: 28, type: 'message', commandId: 29, content: iAddCommand},
  {id: 29, type: 'message', commandId: 30, content: iRemoveCommand},
  {id: 30, type: 'message', commandId: 31, content: iEditCommand},
  {id: 31, type: 'message', commandId: 32, content: iCall},
  {id: 32, type: 'message', commandId: 33, content: iEachCall},
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
