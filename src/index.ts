import {isMaster} from 'cluster';
import {telegramToken} from './settings';
import {newBot} from './bot';
import {createConnection, Connection} from 'typeorm';
import ormConfig from './ormconfig';
import {onStartBotProcess, startStorageBot} from './process';

async function app() {
  await createConnection(ormConfig);
  if (isMaster) {
    console.log('start bot builder' + new Date());
    await newBot(telegramToken);
    await startStorageBot();
  } else {
    await onStartBotProcess();
  }
}
app();
