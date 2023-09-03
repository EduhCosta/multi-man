import Scene from '../core/Scene';
import { MinionAnimation } from '../prefabs/MinionAnimation';

export default class Game extends Scene {
  name = 'Game';

  private defaultMinion!: MinionAnimation;
  private thinMinion!: MinionAnimation;

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');

    // Default example
    this.defaultMinion = new MinionAnimation('default');
    this.defaultMinion.x = (window.innerWidth / 2) - this.defaultMinion.width / 2;
    this.defaultMinion.y = window.innerHeight / 2;
    // Thin examples
    this.thinMinion = new MinionAnimation('thin');
    this.thinMinion.x = (window.innerWidth / 2) + this.defaultMinion.width / 2;
    this.thinMinion.y = window.innerHeight / 2;
  }

  async start() {
    this.addChild(this.defaultMinion, this.thinMinion);
  }

  onResize(width: number, height: number) {
    this.defaultMinion.x = (width / 2) - this.defaultMinion.width / 2;
    this.defaultMinion.y = height / 2;

    this.thinMinion.x = (width / 2) + this.defaultMinion.width / 2;
    this.thinMinion.y = height / 2;
  }

  update(delta: number) {}

  unload() {}
}
