import {ConnectionOptions} from 'typeorm';
import {dbHost, dbPort, dbUser, dbPass, dbDatabase} from './settings';
import path from 'path';

const config: ConnectionOptions = {
  type: 'mysql',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPass,
  database: dbDatabase,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '/migrations/', '*{.ts,.js}')],
};

export default config;
