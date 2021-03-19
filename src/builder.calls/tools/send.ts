import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {selectOldCommand} from '../helpers';
import {sendTelegram, sendTelegramByCommand} from '../../sends';
import {getRepository} from 'typeorm';
import {SendsEntity} from '../../entities/sends.entity';

export async function sendAndSelectBackCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const sends = await getRepository(SendsEntity).find({
    command: settings.command,
  });
  await sendTelegram(msg, bot, sends, []);
  await selectOldCommand(settings);
}
