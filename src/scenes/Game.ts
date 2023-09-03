import { Vector2 } from 'pixi-spine';
import Scene from '../core/Scene';
import { MinionAnimation } from '../prefabs/MinionAnimation';
import { HUD } from '../prefabs/Hud';
import { sceneManager } from '../main';

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
    await this.utils.assetLoader.loadAssetsGroup('MainMenu');

    const hud = new HUD(new Vector2(1920, 1080), 5);
    
    this.addChild(this.defaultMinion, this.thinMinion);
    this.addChild(hud.frame);
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
