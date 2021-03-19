import TelegramBot, {Message} from 'node-telegram-bot-api';
import {getRepository, getConnection} from 'typeorm';
import {SettingsEntity} from './entities/settings.entity';
import {BotsEntity} from './entities/bots.entity';
import {MenuEntity} from './entities/menu.entity';
import {getKeyboardButtonByParent, setKeyboardFromParams} from './helpers';
import {CommandsEntity} from './entities/commands.entity';
import {SendsEntity} from './entities/sends.entity';
import * as calls from './calls';
import {sendTelegram} from './sends';
import {HistoryEntity} from './entities/history.entity';

export async function callCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity,
  command: CommandsEntity
) {
  settings.command = command;
  if (command.call) {
    const callName = command.call;
    const callEntry = Object.entries(calls).find(
      ([key, val]) => key === callName
    );
    if (callEntry) {
      // settings.selectCommand = command;
      const [, call] = callEntry;
      await call.apply(null, [bot, msg, settings]);
    }
  } else {
    if (!settings.command.menu) {
      settings.command.menu = new MenuEntity();
      settings.command.menu.id = 0;
    }
    const keyboards = await getKeyboardButtonByParent(
      settings.command.menu,
      settings.bot
    );

    const sends = await getRepository(SendsEntity).find({
      where: {command},
    });
    await sendTelegram(msg, bot, sends, keyboards);
  }
}

export async function newBot(token: string) {
  const bot = new TelegramBot(token, {polling: true});
  const botStorage = await getRepository(BotsEntity).findOne({token});
  if (!botStorage) {
    throw new Error('Bot not found');
  }

  bot.on('message', async msg => {
    try {
      const chatId = msg.chat.id;

      let settings = await getRepository(SettingsEntity).findOne({
        where: {chatId, bot: botStorage},
        relations: [
          'bot',
          'selectBot',
          'selectCommand',
          'command',
          'command.menu',
          'command.alias',
          'command.alias.menu',
        ],
      });

      if (!settings) {
        settings = new SettingsEntity();
        settings.chatId = chatId;
        settings.bot = botStorage;
      }

      const history = new HistoryEntity();
      history.chatId = chatId;
      history.beforeCommand = settings.command;
      history.bot = settings.bot;
      history.message = JSON.stringify(msg);

      // await bot.sendMessage(chatId, '/command_call_randomQuote');

      // Сначала найдем комманду
      let command = await getRepository(CommandsEntity).findOne({
        where: {
          bot: settings.bot,
          command: msg.text,
        },
        relations: ['menu', 'alias', 'alias.menu'],
      });

      if (!command) {
        if (!settings.command) {
          settings.command = new CommandsEntity();
          settings.command.id = 0;
        }
        if (!settings.command.menu) {
          settings.command.menu = new MenuEntity();
          settings.command.menu.id = 0;
        }

        const menus = await getRepository(MenuEntity).find({
          where: {
            parent: settings.command.menu,
            bot: settings.bot,
          },
          relations: [
            'command',
            'command.menu',
            'command.alias',
            'command.alias.menu',
          ],
        });

        const selectMenu = menus.find(m => m.name === msg.text);
        if (selectMenu) {
          command = selectMenu.command;
        }
      }

      // Надо исполнить алиас а не комманду
      if (command && command.alias) {
        command = command.alias;
      }

      if (command) {
        await callCommand(bot, msg, settings, command);
      } else {
        if (
          settings.command &&
          settings.command.eachCall &&
          settings.command.eachCall in calls
        ) {
          const callName = settings.command.eachCall;
          const callEntry = Object.entries(calls).find(
            ([key]) => key === callName
          );
          if (callEntry) {
            const [, call] = callEntry;
            await call.apply(null, [bot, msg, settings]);
          }
        }
      }

      history.command = settings.command;
      await getConnection().manager.save(settings);
      await getConnection().manager.save(history);
    } catch (e) {
      console.log(e);
    }
  });

  return bot;
}
