import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../entities/settings.entity';
import {getRandomIntInclusive} from '../helpers';

export async function guessNumber(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const falseText = 'Не правильно повторите попытку';
  const trueText = 'Поздравляем! Вы угадали';
  const num = getRandomIntInclusive(1, 3);
  if (!msg.text) {
    await bot.sendMessage(chatId, falseText);
    return;
  }
  if (Number(msg.text) === num) {
    await bot.sendMessage(chatId, trueText);
  } else {
    await bot.sendMessage(chatId, falseText);
  }
}
guessNumber.description = 'Угадай число от 1 до 3';
