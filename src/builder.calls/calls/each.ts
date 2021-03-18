import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getClearParams, selectCall, showCall} from '../helpers';
import * as calls from '../../each.calls';
import {getConnection} from 'typeorm';

const prefix = '/command_each_call_';

export async function showCommandEachCalls(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  await showCall(bot, msg, settings, calls, prefix, 23, 22);
}

export async function selectCommandEachCall(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  console.log();
  await selectCall(bot, msg, settings, calls, prefix, true);
}

export async function clearCommandEachCall(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const command = settings.selectCommand;
  command.eachCall = '';
  await getConnection().manager.save(command);
  const params = await getClearParams(bot, msg, settings);
  await bot.sendMessage(msg.chat.id, 'Пошаговый скрипт удален!', params);
}
