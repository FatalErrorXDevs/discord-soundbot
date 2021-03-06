import fs from 'fs';

import { config } from './Container';

const getSoundsFromSoundFolder = () => {
  const files = fs.readdirSync('sounds/');

  return files.filter(sound =>
    config.acceptedExtensions.some(extension => sound.endsWith(extension))
  );
};

const getSoundWithExtension = (sound: string) => {
  const [name, extension] = sound.split('.');

  return { extension, name };
};

export const getSoundsWithExtension = () => getSoundsFromSoundFolder().map(getSoundWithExtension);
export const getSounds = () => getSoundsWithExtension().map(sound => sound.name);
export const getExtensionForSound = (name: string) =>
  getSoundsWithExtension().find(sound => sound.name === name)!.extension;
export const getPathForSound = (sound: string) => {
  if (getSounds().includes(sound)) {
    return `sounds/${sound}.${getExtensionForSound(sound)}`
  }
  const soundToPlay = getSounds().filter(item => item.includes(sound));
  const item = soundToPlay[Math.floor(Math.random() * soundToPlay.length)];

  return `sounds/${item}.${getExtensionForSound(item)}`
};
export const existsSound = (name: string) => {

  const result = getSounds().includes(name);

  if(result) {
    return result
  }
  const soundToPlay = getSounds().filter(item => item.includes(`${name}_`));
  return soundToPlay.length >= 1;
};
