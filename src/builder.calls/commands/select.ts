import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getRepository} from 'typeorm';
import {CommandsEntity} from '../../entities/commands.entity';
import {callCommand} from '../../bot';

export async function selectCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  console.log('select command');
  const chatId = msg.chat.id;
  const selectCommand = await getRepository(CommandsEntity).findOne({
    bot: settings.selectBot,
    command: msg.text?.substr(2),
  });
  if (!selectCommand) {
    await bot.sendMessage(chatId, 'Комменда не найдена');
    return;
  }

  settings.selectCommand = selectCommand;
  const command = await getRepository(CommandsEntity).findOne({
    where: {id: 15},
    relations: ['bot', 'menu'],
  });

  if (command) {
    settings.command = command;
    await callCommand(bot, msg, settings, command);
  } else {
    await bot.sendMessage(chatId, 'Системная ошибка');
  }
}
