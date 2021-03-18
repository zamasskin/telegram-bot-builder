import cluster, {fork, isMaster} from 'cluster';
import {getRepository, Not} from 'typeorm';
import {BotsEntity} from './entities/bots.entity';
import {newBot} from './bot';

export interface ProcessBot {
  pid: number;
  token: string;
}

let botProcessed: ProcessBot[] = [];

export function startBot(token: string) {
  const worker = fork({telegramToken: token});
  worker.on('message', msg => {
    if (msg.event === 'startProcess') {
      const {token, pid} = msg;
      botProcessed.push({token, pid});
    } else if (msg.event === 'restartBot') {
      stopBot(msg.token);
      startBot(msg.token);
    }
  });
}

export function restartBot(token: string) {
  if (process && process.send) {
    process.send({event: 'restartBot', token});
  }
}

export function addProcessBot(token: string, pid: number) {
  if (process && process.send) {
    process.send({event: 'startProcess', token, pid});
  }
}

export function stopBot(token: string) {
  const botProcess = botProcessed.find(p => p.token === token);
  if (botProcess) {
    removeProcessBot(token);
    process.kill(botProcess.pid);
    console.log(`stop process [${process.pid}]`);
  }
}

export function removeProcessBot(token: string) {
  botProcessed = botProcessed.filter(p => p.token !== token);
}

export async function startStorageBot() {
  const bots = await getRepository(BotsEntity).find({id: Not(1)});
  bots.forEach(bot => startBot(bot.token));
}

export async function onStartBotProcess() {
  try {
    if (!process.env.telegramToken) {
      throw new Error('env not found');
    }

    const token = process.env.telegramToken || '';

    const botStorage = await getRepository(BotsEntity).findOne({
      where: {
        token: token,
      },
    });

    if (!botStorage) {
      throw new Error('bot not found');
    }

    addProcessBot(token, process.pid);
    console.log(
      `start process [${process.pid}] from bot @${botStorage.username}`
    );

    const bot = await newBot(token);
    const restart = async (err: Error) => {
      console.error(`error: [${process.pid}] ${err.message}`);
      restartBot(token);
      await bot.close();
    };
    bot.on('error', restart);
    bot.on('polling_error', restart);

    cluster.on('exit', async () => {
      console.log(
        `stop process [${process.pid}] from bot @${botStorage.username}`
      );
      removeProcessBot(token);
      if (bot) {
        await bot.close();
      }
    });
  } catch (e) {
    console.log(e);
    process.kill(process.pid);
  }
}
