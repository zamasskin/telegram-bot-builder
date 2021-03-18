import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getRepository} from 'typeorm';
import {BotsEntity} from '../../entities/bots.entity';
import {MenuEntity} from '../../entities/menu.entity';
import {CommandsEntity} from '../../entities/commands.entity';
import {getKeyboardButtonByParent} from '../../helpers';
import {SendsEntity} from '../../entities/sends.entity';
import {sendTelegram} from '../../sends';

export async function selectBot(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const selectBot = await getRepository(BotsEntity).findOne({
    where: {username: msg.text?.substr(1)},
  });

  if (selectBot) {
    settings.selectBot = selectBot;
    const menu = new MenuEntity();
    menu.id = 6;

    const command = new CommandsEntity();
    command.id = 7;

    settings.command = command;

    const keyboards = await getKeyboardButtonByParent(menu, settings.bot);
    const sends = await getRepository(SendsEntity).find({
      where: {
        command,
      },
    });
    await sendTelegram(msg, bot, sends, keyboards);
  } else {
    await bot.sendMessage(chatId, 'Бот не найден');
  }
}
