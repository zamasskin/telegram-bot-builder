import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {sendTelegram} from '../../sends';
import {getRepository} from 'typeorm';
import {SendsEntity} from '../../entities/sends.entity';
import {selectOldCommand} from '../helpers';
import * as calls from '../../calls';

export async function callCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const selectCommand = settings.selectCommand;
  if (selectCommand.call) {
    const callName = selectCommand.call;
    const callEntry = Object.entries(calls).find(
      ([key, val]) => key === callName
    );
    if (callEntry) {
      const [, call] = callEntry;
      await call.apply(null, [bot, msg, settings]);
    } else {
      await bot.sendMessage(chatId, 'Системная ошибка: Коммвнда не найдена');
    }
    // callCommand(bot, msg, settings, selectCommand);
  } else {
    const sends = await getRepository(SendsEntity).find({
      command: selectCommand,
    });
    await sendTelegram(msg, bot, sends, []);
  }
  await selectOldCommand(settings);
}
