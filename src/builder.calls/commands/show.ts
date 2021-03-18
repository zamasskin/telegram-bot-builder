import TelegramBot, {Message} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {getRepository} from 'typeorm';
import {CommandsEntity} from '../../entities/commands.entity';
import {MenuEntity} from '../../entities/menu.entity';
import {getKeyboardButtons} from '../../helpers';
import {SendsEntity} from '../../entities/sends.entity';
import {sendTelegram} from '../../sends';
import {getSelectCommandMenu} from '../helpers';

export async function showCommands(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const parentMenu = new MenuEntity();
  parentMenu.id = 7;
  const menus = await getRepository(MenuEntity).find({
    where: {
      bot: settings.bot,
      parent: parentMenu,
    },
  });

  const commands = await getRepository(CommandsEntity).find({
    where: {
      bot: settings.selectBot,
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

  commands.forEach(command =>
    menus.push(getMenuEntity('* ' + command.command))
  );

  const keyboards = getKeyboardButtons(menus);
  const command = new CommandsEntity();
  command.id = 8;

  const sends = await getRepository(SendsEntity).find({
    where: {command},
  });
  settings.command = command;
  await sendTelegram(msg, bot, sends, keyboards);
}

export async function showSelectCommand(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  if (!settings.selectCommand) {
    await bot.sendMessage(chatId, 'Комманда не выбрана');
  }

  const command = new CommandsEntity();
  command.id = 15;

  const menus = await getSelectCommandMenu(bot, msg, settings);

  const sends = await getRepository(SendsEntity).find({
    where: {command: command},
  });

  settings.command = command;
  const keyboards = getKeyboardButtons(menus);
  await sendTelegram(msg, bot, sends, keyboards);
}
