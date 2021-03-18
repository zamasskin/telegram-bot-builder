import axios from 'axios';
import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../entities/settings.entity';

export async function randomQuote(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const response = await axios.get(
    'https://api.forismatic.com/api/1.0/?method=getQuote&format=json'
  );
  if (response.data) {
    await bot.sendMessage(chatId, response.data.quoteAuthor);
    await bot.sendMessage(chatId, response.data.quoteText);
  }
}

randomQuote.description = 'Случайная цитата';
