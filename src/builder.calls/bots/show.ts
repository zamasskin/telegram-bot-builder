import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {MenuEntity} from '../../entities/menu.entity';
import {getRepository, Not} from 'typeorm';
import {BotsEntity} from '../../entities/bots.entity';
import {getKeyboardButtons} from '../../helpers';
import {CommandsEntity} from '../../entities/commands.entity';
import {SendsEntity} from '../../entities/sends.entity';
import {sendTelegram} from '../../sends';

export async function showBots(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const parentMenu = new MenuEntity();
  parentMenu.id = 1;
  const menus = await getRepository(MenuEntity).find({
    where: {
      bot: settings.bot,
      parent: parentMenu,
    },
  });

  let startRow = 1;
  const getMenuEntity = (name: string) => {
    const menu = new MenuEntity();
    menu.name = name;
    menu.col = 1;
    menu.row = ++startRow;
    return menu;
  };

  const bots = await getRepository(BotsEntity).find({id: Not(1)});
  bots.forEach(bot => menus.push(getMenuEntity('@' + bot.username)));

  const keyboards = getKeyboardButtons(menus);
  const command = new CommandsEntity();
  command.id = 2;

  const sends = await getRepository(SendsEntity).find({
    where: {command},
  });
  settings.command = command;
  await sendTelegram(msg, bot, sends, keyboards);
}
