import TelegramBot, {Message, SendPollOptions} from 'node-telegram-bot-api';
import {SettingsEntity} from '../../entities/settings.entity';
import {SendsEntity} from '../../entities/sends.entity';
import {uploadPath} from '../../settings';
import {getConnection, getRepository} from 'typeorm';
import {downloadFile, removeFile, removeFileCallback} from '../../helpers';
import {selectOldCommand} from '../helpers';

export async function setCommandContent(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  const command = settings.selectCommand;
  const send = new SendsEntity();
  send.command = command;

  if (!command) {
    await bot.sendMessage(chatId, 'Комманда не найдена');
    return;
  }

  if (msg.text) {
    send.type = 'message';
    send.content = msg.text;
    await getConnection().manager.save(send);
  } else if (msg.photo) {
    const [file] = msg.photo;
    if (file) {
      send.type = 'photo';
      send.content = await downloadFile(bot, file.file_id);
      await getConnection().manager.save(send);
    }
  } else if (msg.sticker) {
    send.type = 'sticker';
    send.content = await downloadFile(bot, msg.sticker.file_id);
    await getConnection().manager.save(send);
  } else if (msg.document) {
    send.type = 'document';
    send.content = await downloadFile(bot, msg.document.file_id);
    await getConnection().manager.save(send);
  } else if (msg.video) {
    send.type = 'video';
    send.content = await downloadFile(bot, msg.video.file_id);
    await getConnection().manager.save(send);
  } else if (msg.poll) {
    send.type = 'poll';
    send.content = JSON.stringify({
      question: msg.poll.question,
      options: msg.poll.options.map(option => option.text),
    });
    const params: SendPollOptions = {};
    if ('is_anonymous' in msg.poll) {
      params.is_anonymous = msg.poll.is_anonymous;
    }
    if ('type' in msg.poll) {
      params.type = msg.poll.type;
    }
    if ('allows_multiple_answers' in msg.poll) {
      params.allows_multiple_answers = msg.poll.allows_multiple_answers;
    }
    if ('is_closed' in msg.poll) {
      params.is_closed = msg.poll.is_closed;
    }
    send.params = JSON.stringify(params);
    await getConnection().manager.save(send);
  } else {
    console.log(msg);
  }
}

export async function clearCommandContent(
  bot: TelegramBot,
  msg: Message,
  settings: SettingsEntity
) {
  const chatId = msg.chat.id;
  if (!settings.selectBot) {
    await bot.sendMessage(chatId, 'Бот не выбран');
    return;
  }
  if (!settings.selectCommand) {
    await bot.sendMessage(chatId, 'Комманда не выбрана');
    return;
  }

  const removeSend = async (send: SendsEntity) => {
    const filesTypes = ['photo', 'video', 'document', 'sticker'];
    const type = send.type;
    const path = send.content;
    await getRepository(SendsEntity).delete(send.id);
    if (filesTypes.includes(type)) {
      removeFileCallback(path, () => null);
    }
  };

  const sends = await getRepository(SendsEntity).find({
    command: settings.selectCommand,
  });
  const promises = sends.map(removeSend);
  await Promise.all(promises);

  await bot.sendMessage(chatId, 'Контент комманды успешно очищен');

  await selectOldCommand(settings);
}
