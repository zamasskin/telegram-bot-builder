import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {sendTelegram} from '../../sends';
import {getRepository} from 'typeorm';
import {SendsEntity} from '../../entities/sends.entity';
import {selectOldCommand} from '../helpers';

export async function callCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const selectCommand = settings.selectCommand;
  const sends = await getRepository(SendsEntity).find({command: selectCommand});
  await sendTelegram(msg, bot, sends, []);
  await selectOldCommand(settings);
}
