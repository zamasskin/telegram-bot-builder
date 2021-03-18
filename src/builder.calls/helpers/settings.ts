import {SettingsEntity} from '../../entities/settings.entity';
import {getRepository} from 'typeorm';

export async function selectOldCommand(settings: SettingsEntity) {
  const saveSettings = await getRepository(SettingsEntity).findOne({
    where: {id: settings.id},
    relations: ['command'],
  });

  if (saveSettings && saveSettings.command) {
    settings.command = saveSettings.command;
  }
}
