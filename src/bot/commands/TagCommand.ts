import { Message, Permissions } from 'discord.js';

import DatabaseAdapter from '@util/db/DatabaseAdapter';
import LocaleService from '@util/i18n/LocaleService';
import { getSounds } from '@util/SoundUtil';
import Command from './base/Command';

export default class TagCommand implements Command {
  public readonly TRIGGERS = ['tag'];
  public readonly NUMBER_OF_PARAMETERS = 1;
  public readonly USAGE = 'Usage: !tag <sound> [<tag> ... <tagN> | clear]';

  private readonly localeService: LocaleService;
  private readonly db: DatabaseAdapter;

  constructor(localeService: LocaleService, db: DatabaseAdapter) {
    this.localeService = localeService;
    this.db = db;
  }

  public run(message: Message, params: string[]) {
    if (params.length < this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const sound = params.shift()!;
    if (!getSounds().includes(sound)) {
      message.channel.send(this.localeService.t('commands.tag.notFound', { sound }));
      return;
    }

    if (!params.length) {
      const tags = this.db.sounds.listTags(sound).join(', ');
      message.author.send(this.localeService.t('commands.tag.found', { sound, tags }));
      return;
    }

    if (params[0] === 'clear') {
      if (!message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;
      this.db.sounds.clearTags(sound);
      return;
    }

    this.db.sounds.addTags(sound, params);
  }
}
