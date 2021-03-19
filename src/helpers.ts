import {MenuEntity} from './entities/menu.entity';
import TelegramBot, {KeyboardButton} from 'node-telegram-bot-api';
import {getRepository} from 'typeorm';
import {BotsEntity} from './entities/bots.entity';
import {uploadPath} from './settings';
import path from 'path';
import fs, {NoParamCallback} from 'fs';

export function getKeyboardButtons(menu: MenuEntity[]): KeyboardButton[][] {
  const maxRows = Math.max(...menu.map(m => m.row));
  const maxCols = Math.max(...menu.map(m => m.col));

  const cols = [];
  for (let i = 0; i <= maxRows; i++) {
    const rows: string | any[] = [];
    for (let j = 0; j <= maxCols; j++) {
      const menuItems = menu
        .filter(m => m.row === i && m.col === j)
        .map(m => ({text: m.name}));
      rows.push(...menuItems);
    }
    if (rows.length > 0) {
      cols.push(rows);
    }
  }
  return cols;
}

export async function getKeyboardButtonByParent(
  parent: MenuEntity | MenuEntity[],
  bot: BotsEntity
) {
  const menus = await getRepository(MenuEntity).find({
    where: {parent, bot},
  });
  return getKeyboardButtons(menus);
}

export function setKeyboardFromParams(
  keyboard: KeyboardButton[][],
  params: any
) {
  if (keyboard.length === 0) {
    return params;
  }

  if (!('reply_markup' in params)) {
    params.reply_markup = {};
  }
  if ('keyboard' in params.reply_markup) {
    params.reply_markup.keyboard.push(...keyboard);
  } else {
    params.reply_markup.keyboard = keyboard;
  }

  return params;
}

export function datePath() {
  const date = new Date();
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2)
  );
}

export async function downloadFile(bot: TelegramBot, id: string) {
  const pathFile = path.resolve(uploadPath, datePath());
  if (!fs.existsSync(pathFile)) {
    fs.mkdirSync(pathFile);
  }
  const filePath = await bot.downloadFile(id, pathFile);
  return filePath.substr(uploadPath.length + 1);
}

export function getFilePath(filePath: string) {
  return path.resolve(uploadPath, filePath);
}

export function getFile(filePath: string) {
  return fs.readFileSync(getFilePath(filePath));
}

export function removeFile(filePath: string) {
  fs.unlinkSync(getFilePath(filePath));
}

export function removeFileCallback(path: string, callback: NoParamCallback) {
  fs.unlink(getFilePath(path), callback);
}

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
