import {SendsEntity} from './entities/sends.entity';
import TelegramBot, {KeyboardButton, Message} from 'node-telegram-bot-api';
import {
  getFile,
  getFilePath,
  getKeyboardButtons,
  setKeyboardFromParams,
} from './helpers';
import {SettingsEntity} from './entities/settings.entity';
import {CommandsEntity} from './entities/commands.entity';
import {MenuEntity} from './entities/menu.entity';
import {getRepository} from 'typeorm';
import Mustache from 'mustache';

interface poolContent {
  question: string;
  options: string[];
}

let botInfo: TelegramBot.User;
async function getBotInfo(bot: TelegramBot) {
  if (!botInfo) {
    botInfo = await bot.getMe();
  }
  return botInfo;
}

export async function sendTelegram(
  msg: Message,
  bot: TelegramBot,
  sends: SendsEntity[],
  keyboards: KeyboardButton[][]
) {
  const chatId = msg.chat.id;
  const botInfo = await getBotInfo(bot);
  for (const send of sends) {
    const params = setKeyboardFromParams(
      keyboards,
      send.params ? JSON.parse(send.params) : {}
    );
    switch (send.type) {
      case 'message':
        await bot.sendMessage(
          chatId,
          Mustache.render(send.content, {...msg, botInfo: {...botInfo}}),
          params
        );
        break;
      case 'photo':
        try {
          await bot.sendPhoto(chatId, getFile(send.content), params);
        } catch (e) {
          console.log(e);
        }
        break;
      case 'sticker':
        try {
          await bot.sendSticker(chatId, getFilePath(send.content), params);
        } catch (e) {
          console.log(e);
        }
        break;
      case 'document':
        try {
          await bot.sendDocument(chatId, getFilePath(send.content), params);
        } catch (e) {
          console.log(e);
        }
        break;
      case 'video':
        try {
          await bot.sendVideo(chatId, getFilePath(send.content), params);
        } catch (e) {
          console.log(e);
        }
        break;
      case 'poll':
        try {
          const {question, options}: poolContent = JSON.parse(send.content);
          await bot.sendPoll(chatId, question, options, params);
        } catch (e) {
          console.log(e);
        }
        break;
    }
  }
}

export async function sendTelegramByCmdMenu(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity,
  commandId: number,
  menuId: number
) {
  const command = new CommandsEntity();
  command.id = commandId;

  const parentMenu = new MenuEntity();
  parentMenu.id = menuId;

  const sends = await getRepository(SendsEntity).find({command});
  const menus = await getRepository(MenuEntity).find({
    where: {
      bot: settings.bot,
      parent: parentMenu,
    },
  });
  const keyboards = getKeyboardButtons(menus);
  await sendTelegram(msg, bot, sends, keyboards);
  settings.command = command;
}

export async function sendTelegramByCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity,
  command: CommandsEntity
) {
  let parentMenu = command.menu;
  if (!parentMenu) {
    parentMenu = new MenuEntity();
    parentMenu.id = 0;
  }
  const sends = await getRepository(SendsEntity).find({command});
  const menus = await getRepository(MenuEntity).find({
    where: {
      bot: settings.bot,
      parent: parentMenu,
    },
  });
  const keyboards = getKeyboardButtons(menus);
  await sendTelegram(msg, bot, sends, keyboards);
  settings.command = command;
}

export async function sendTelegramByCommandNoMenu(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity,
  command: CommandsEntity
) {
  let parentMenu = command.menu;
  if (!parentMenu) {
    parentMenu = new MenuEntity();
    parentMenu.id = 0;
  }
  const sends = await getRepository(SendsEntity).find({command});
  await sendTelegram(msg, bot, sends, []);
  settings.command = command;
}
