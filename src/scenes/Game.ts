import Scene from '../core/Scene';
import { Texture, AnimatedSprite } from 'pixi.js';

export default class Game extends Scene {
  name = 'Game';

  private animation!: AnimatedSprite;
  private textures!: Array<{ texture: Texture; time: number }>;

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');

    this.textures = [];

    for (let i = 0; i < 17; i++) {
      const tmpSprite = Texture.from(`/Game/players/idle-${i}.png`);
      this.textures.push({ texture: tmpSprite, time: 60 });
    }

    this.animation = new AnimatedSprite(this.textures);
  }

  async start() {
    this.animation.anchor.set(0.5);
    this.animation.scale.set(0.5);
    this.animation.x = (this.app.screen.width + this.animation.width) / 2;
    this.animation.y = this.app.screen.height / 2;
    this.animation.play();
    this.addChild(this.animation);
  }

  onResize(width: number, height: number) {
    this.animation.x = (width + this.animation.width) / 2;
    this.animation.y = height / 2;
  }

  update(delta: number) {}

  unload() {}
}
