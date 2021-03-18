import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {CommandsEntity} from '../../entities/commands.entity';
import {MenuEntity} from '../../entities/menu.entity';
import {getConnection, getRepository} from 'typeorm';
import {callCommand} from '../../bot';

export async function createCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  if (!msg.text) {
    await bot.sendMessage(chatId, 'Вы не указали название комманды');
    return;
  }

  const newCommand = new CommandsEntity();
  newCommand.command = msg.text;
  newCommand.bot = settings.selectBot;
  newCommand.selectMenu = new MenuEntity();
  newCommand.selectMenu.id = 0;
  await getConnection().manager.save(newCommand);

  settings.selectCommand = newCommand;

  const command = await getRepository(CommandsEntity).findOne({
    where: {id: 15},
    relations: ['selectMenu', 'bot'],
  });
  if (command) {
    await callCommand(bot, msg, settings, command);
  } else {
    await bot.sendMessage(chatId, 'Системная ошибка');
  }
}
