import { Text } from 'pixi.js';
import Scene from '../core/Scene';

export default class Loading extends Scene {
  name = 'Loading';

  async load() {
    const text = new Text('Loading...', {
      fontFamily: 'Verdana',
      fontSize: 50,
      fill: 'white',
    });

    text.anchor.set(0);
    text.position.set(window.innerWidth / 2, window.innerHeight / 2);
    text.resolution = 2;
    this.addChild(text);
  }

  async start() {
    // We should load all scene assets here
    await this.utils.assetLoader.loadAssetsGroup('MainMenu');
  }

  onResize(width: number, height: number) {}
  update(delta: number): void {}
  unload(): void {}
  nextLevel(): void | Promise<void> {}
}
