import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getClearParams, selectCall, showCall} from '../helpers';
import * as calls from '../../call';
import {getConnection} from 'typeorm';

const prefix = '/command_call_';

export async function showCommandCalls(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  await showCall(bot, msg, settings, calls, prefix, 21, 20);
}

export async function selectCommandCall(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  await selectCall(bot, msg, settings, calls, prefix, false);
}

export async function clearCommandCall(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const command = settings.selectCommand;
  command.call = '';
  await getConnection().manager.save(command);
  const params = await getClearParams(bot, msg, settings);
  await bot.sendMessage(msg.chat.id, 'Скрипт удален!', params);
}
