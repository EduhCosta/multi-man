import Scene from '../core/Scene';
import { Texture, AnimatedSprite } from 'pixi.js';
import { Minion } from '../prefabs/Minion';

export default class Game extends Scene {
  name = 'Game';

  private animation!: AnimatedSprite;
  private textures!: Array<{ texture: Texture; time: number }>;

  private minion!: Minion;

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');

    this.minion = new Minion();
    this.minion.x = window.innerWidth / 2;
    this.minion.y = window.innerHeight - 1.5 * this.minion.height;
    this.addChild(this.minion);
  }

  onResize(width: number, height: number) {
    if (this.animation) {
      this.animation.x = (width + this.animation.width) / 2;
      this.animation.y = height / 2;
    }
  }

  async start() {

  }

  update(delta: number) {
    this.minion.update();
  }

  unload() {}
}
