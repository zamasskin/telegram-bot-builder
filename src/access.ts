import {BotsEntity} from './entities/bots.entity';
import {UsersEntity} from './entities/users.entity';
import {getConnection, getRepository} from 'typeorm';
import {AccessEntity, AccessType} from './entities/access.entity';
import {Message} from 'node-telegram-bot-api';

export async function checkAccess(bot: BotsEntity, user: UsersEntity) {
  if (bot.id === 1) {
    const accessed = await getRepository(AccessEntity).find({
      where: {bot},
      relations: ['user'],
    });
    if (accessed.length === 0) {
      const access = new AccessEntity();
      access.bot = bot;
      access.user = user;
      access.access = 'W';
      await getConnection().manager.save(access);
      return true;
    } else {
      const access = accessed.find(
        access => access.user && access.user.id === user.id
      );
      return !!access;
    }
  }
  return true;
}

export async function checkAccessByMsg(bot: BotsEntity, msg: Message) {
  const user = await getRepository(UsersEntity).findOne({
    where: [{telegramId: msg.from?.id}, {username: msg.from?.username}],
  });

  if (!user) {
    return false;
  }
  return checkAccess(bot, user);
}

export async function addAccess(
  bot: BotsEntity,
  username: string,
  access: AccessType
) {
  let user = await getRepository(UsersEntity).findOne({username});
  if (!user) {
    user = new UsersEntity();
    user.telegramId = 0;
    user.username = username;
    user.lastName = user.firstName = user.language = '';
    await getConnection().manager.save(user);
    return false;
  }
  const accessStorage = new AccessEntity();
  accessStorage.bot = bot;
  accessStorage.user = user;
  accessStorage.access = access;
  await getConnection().manager.save(accessStorage);
  return true;
}
