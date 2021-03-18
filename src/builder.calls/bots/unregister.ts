import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getConnection, getRepository} from 'typeorm';
import {CommandsEntity} from '../../entities/commands.entity';
import {BotsEntity} from '../../entities/bots.entity';
import {showBots} from './show';
import {callCommand} from '../../bot';
import {stopBot} from '../../process';

export async function unRegisterBot(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const message = msg.text?.toLocaleLowerCase();
  if (message === 'y' || message === 'да') {
    if (settings.selectBot) {
      stopBot(settings.selectBot.token);
      const commands = await getRepository(CommandsEntity).find({
        where: {
          bot: settings.selectBot,
        },
      });

      await Promise.all([
        getConnection().query(
          'DELETE FROM telegram_sends WHERE commandId IN (?)',
          [commands.map(command => command.id)]
        ),
        getConnection().query('DELETE FROM telegram_commands WHERE botId = ?', [
          settings.selectBot.id,
        ]),
        getConnection().query('DELETE FROM telegram_menu WHERE botId = ?', [
          settings.selectBot.id,
        ]),
        getConnection().query('DELETE FROM telegram_bots WHERE id = ?', [
          settings.selectBot.id,
        ]),
      ]);
      settings.selectBot = new BotsEntity();
      settings.selectBot.id = 0;
      settings.selectCommand = new CommandsEntity();
      settings.selectCommand.id = 0;
      await showBots(bot, msg, settings);
    } else {
      await bot.sendMessage(chatId, 'Не выбран бот для удаления');
    }
  } else if (message === 'n' || message === 'нет') {
    const command = await getRepository(CommandsEntity).findOne({
      where: {id: 7},
      relations: ['selectMenu', 'bot'],
    });
    if (command) {
      await callCommand(bot, msg, settings, command);
    }
  }
}
