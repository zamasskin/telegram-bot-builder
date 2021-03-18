import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getRepository} from 'typeorm';
import {CommandsEntity} from '../../entities/commands.entity';
import {callCommand} from '../../bot';
import {showCommands} from './show';

export async function deleteCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const message = msg.text?.toLocaleLowerCase();
  if (message === 'y' || message === 'да') {
    if (!settings.selectBot) {
      await bot.sendMessage(chatId, 'Не выбран бот для удаления');
      return;
    }
    if (!settings.selectCommand) {
      await bot.sendMessage(chatId, 'Не выбрана комманда для удаления');
      return;
    }

    if (settings.selectCommand.command === '/start') {
      await bot.sendMessage(chatId, 'Нельзя удалять данную команду');
      return;
    }
    await getRepository(CommandsEntity).delete(settings.selectCommand);
    settings.selectCommand = new CommandsEntity();
    settings.selectCommand.id = 0;

    await showCommands(bot, msg, settings);
  } else if (message === 'n' || message === 'нет') {
    const command = await getRepository(CommandsEntity).findOne({
      where: {id: 17},
      relations: ['selectMenu', 'bot'],
    });
    if (command) {
      await callCommand(bot, msg, settings, command);
    }
  }
}
