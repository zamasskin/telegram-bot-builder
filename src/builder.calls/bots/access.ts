import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getRepository} from 'typeorm';
import {addAccess, removeAccess} from '../../access';
import {callCommand} from '../../bot';
import {CommandsEntity} from '../../entities/commands.entity';

export async function addBotAccess(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  if (!msg.text) {
    await bot.sendMessage(chatId, 'Введите корректное имя пользователя');
    return;
  }
  await addAccess(settings.bot, msg.text, 'W');
  const command = await getRepository(CommandsEntity).findOne({
    where: {id: 1},
    relations: ['bot', 'menu'],
  });
  if (command) {
    await callCommand(bot, msg, settings, command);
  }
}

export async function removeBotAccess(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  if (!msg.text) {
    await bot.sendMessage(chatId, 'Введите корректное имя пользователя');
    return;
  }

  if (await removeAccess(settings.bot, msg.text)) {
    const command = await getRepository(CommandsEntity).findOne({
      where: {id: 1},
      relations: ['bot', 'menu'],
    });
    if (command) {
      await callCommand(bot, msg, settings, command);
    }
  } else {
    await bot.sendMessage(chatId, 'Доступ не найден');
  }
}
