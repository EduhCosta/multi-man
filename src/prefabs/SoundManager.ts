import { Sound } from '@pixi/sound';

export class SoundManager {
  private static instance: SoundManager;
  sound!: Sound;
  sfx!: Sound;
  private constructor() { }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }

    return SoundManager.instance;
  }

  play(path: string) {
    this.pause();

    this.sound = Sound.from(path);
    this.sound.loop = true;
    this.sound.singleInstance = true;
    this.sound.play();
  }

  pause() {
    if(this.sound) this.sound.pause();
  }

  playSfx(path: string) {
    this.pauseSfx();

    this.sfx = Sound.from(path);
    this.sfx.loop = true;
    this.sfx.singleInstance = true;
    this.sfx.play();
  }

  pauseSfx() {
    if(this.sfx) this.sfx.pause();
  }
}
