import { Color } from 'pixi.js';
import Scene from '../core/Scene';
import { Panel } from '../prefabs/Panel';
import { Vector2 } from 'pixi-spine';
import { SpriteButton } from '../prefabs/SpriteButton';
import { sceneManager } from '../main';

export default class MainMenu extends Scene {
  name = 'MainMenu';

  private panel!: Panel;

  async load() {
    this.panel = new Panel(new Vector2(800, 500), new Color('#242424'));
  }

  async start() {
    // We should load all scene assets here
    await this.utils.assetLoader.loadAssetsGroup('MainMenu');
    await this.utils.assetLoader.loadAssetsGroup('Game');

    const startButton = new SpriteButton('Start', this.startGame).element;

    // Add elements to panel
    this.panel.append(startButton);
    
    // Add elements to screen
    this.addChild(this.panel.frame);
  }

  onResize(width: number, height: number) {
    this.panel.centralize();
  }

  update(delta: number): void {}
  unload(): void {}

  /** 
   *  ########## Game Events ##########
   */

  async startGame() {
    await sceneManager.switchScene('Game');
  }
}
