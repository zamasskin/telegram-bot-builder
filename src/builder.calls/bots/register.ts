import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import axios from 'axios';
import {BotsEntity} from '../../entities/bots.entity';
import {getConnection, getRepository} from 'typeorm';
import {startBot} from '../../process';
import {callCommand} from '../../bot';
import {CommandsEntity} from '../../entities/commands.entity';

export async function registerBot(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  try {
    if (!msg.text) {
      throw new Error('message not found');
    }
    const url = `https://api.telegram.org/bot${msg.text}/getMe`;
    const response = await axios.get(url);
    const {data} = response;
    if (!data.ok || !data.result) {
      throw new Error('response not found');
    }
    const {result} = data;

    const newBot = new BotsEntity();
    newBot.token = msg.text;
    newBot.telegramId = result.id;
    newBot.username = result.username;
    newBot.name = result.first_name;
    await getConnection().manager.save(newBot);
    if (newBot.id) {
      const newCommand = new CommandsEntity();
      newCommand.bot = newBot;
      newCommand.command = '/start';
      await getConnection().manager.save(newCommand);

      startBot(newBot.token);
      settings.selectBot = newBot;
      const command = await getRepository(CommandsEntity).findOne({
        where: {id: 7},
        relations: ['selectMenu', 'bot'],
      });
      if (command) {
        await callCommand(bot, msg, settings, command);
      }
    } else {
      await bot.sendMessage(chatId, 'Системная ошибка');
    }
  } catch (e) {
    console.log(e);
    await bot.sendMessage(chatId, 'не верно указана комманда');
  }
}
