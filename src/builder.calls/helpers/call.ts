import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {sendTelegramByCmdMenu} from '../../sends';
import {getConnection, getRepository} from 'typeorm';
import {CommandsEntity} from '../../entities/commands.entity';
import {getSelectCommandMenu} from './command';
import {getKeyboardButtons, setKeyboardFromParams} from '../../helpers';
import {selectOldCommand} from './settings';

function getName(prefix: string, name: string) {
  return prefix + name;
}

function getCall(prefix: string, callName: string) {
  return callName.substr(prefix.length);
}

interface MyCallableFunction extends CallableFunction {
  description?: string;
}

export async function showCall(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity,
  calls: {[key: string]: MyCallableFunction},
  prefix: string,
  commandId: number,
  menuId: number
) {
  const chatId = msg.chat.id;
  const arMessage: string[] = [];
  for (const [name, call] of Object.entries(calls)) {
    const description =
      'description' in call ? call.description : 'Описание не указано';

    arMessage.push(`${getName(prefix, name)} - ${description}`);
  }

  await sendTelegramByCmdMenu(bot, msg, settings, commandId, menuId);
  await bot.sendMessage(chatId, arMessage.join('\n'));
}

export async function selectCall(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity,
  calls: {[key: string]: MyCallableFunction},
  prefix: string,
  each: boolean
) {
  const chatId = msg.chat.id;
  if (!settings.selectCommand.id) {
    await bot.sendMessage(msg.chat.id, 'Коммада не установлена');
    return;
  }
  const keys = Object.keys(calls).map(name => getName(prefix, name));
  if (keys.includes(msg.text || '')) {
    const command = await getRepository(CommandsEntity).findOne(
      settings.selectCommand.id
    );
    if (!command) {
      await bot.sendMessage(msg.chat.id, 'Комманда не найдена');
      return;
    }
    if (each) {
      command.eachCall = getCall(prefix, msg.text || '');
      await getConnection().manager.save(command);
      settings.selectCommand.eachCall = command.eachCall;
    } else {
      command.call = getCall(prefix, msg.text || '');
      await getConnection().manager.save(command);
      settings.selectCommand.call = command.call;
    }
    const menus = await getSelectCommandMenu(bot, msg, settings);
    const keyboards = getKeyboardButtons(menus);
    const params = setKeyboardFromParams(keyboards, {});
    await bot.sendMessage(chatId, 'Скрипт добавлен', params);
    settings.command = new CommandsEntity();
    settings.command.id = 15;
  } else {
    await bot.sendMessage(msg.chat.id, 'Скрипт не найден');
  }
}

export async function getClearParams(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  await selectOldCommand(settings);
  const menus = await getSelectCommandMenu(bot, msg, settings);
  const keyboards = getKeyboardButtons(menus);
  return setKeyboardFromParams(keyboards, {});
}
