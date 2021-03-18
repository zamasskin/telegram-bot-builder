import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const env = process.env;

export const rootPath = path.resolve(__dirname, '../../');
export const dbHost = env.DB_HOST || 'localhost';
export const dbPort = Number(env.DB_PORT) || 3306;
export const dbUser = env.DB_USER || 'root';
export const dbPass = env.DB_PASS || '';
export const dbDatabase = env.DB_NAME || '';
export const telegramToken = env.TELEGRAM_TOKEN || '';
export const botName = env.BOT_NAME || 'BigBot';

export const uploadPath = path.resolve(rootPath, env.UPLOAD_PATH || './upload');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}
