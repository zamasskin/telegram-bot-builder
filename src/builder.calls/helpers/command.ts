import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {MenuEntity} from '../../entities/menu.entity';
import {getRepository} from 'typeorm';

export async function getSelectCommandMenu(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const menu = new MenuEntity();
  menu.id = 14;

  let menus = await getRepository(MenuEntity).find({
    where: {
      bot: settings.bot,
      parent: menu,
    },
    relations: ['command'],
  });

  menus = menus.filter(
    menu => menu.command.id !== (settings.selectCommand.call ? 21 : 25)
  );

  menus = menus.filter(
    menu => menu.command.id !== (settings.selectCommand.eachCall ? 23 : 26)
  );

  if (settings.selectCommand.command === '/start') {
    menus = menus.filter(menu => menu.command.id !== 16);
  }

  settings.command = menu.command;

  return menus;
}
