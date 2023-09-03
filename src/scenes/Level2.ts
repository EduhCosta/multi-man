import Scene from '../core/Scene';
import { Application,Point } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import { Fan } from '../prefabs/Fan';
import Platform from '../prefabs/Platform';
import Endline from '../prefabs/EndLine';
import { Button } from '../prefabs/Button';
import { sceneManager } from '../main';



export default class Game extends Scene {
  name = 'Level2';

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
  }

  loadPlatforms() {
    const ground = new Platform(
      this.world,
      { x: 0, y: 0 },
      { width: window.innerWidth, height: 100 },
    );

    this.state.platforms.push(ground);

    const platform1 = new Platform(
      this.world,
      { x: 200, y: 500 },
      { width: 200, height: 50 },
    );
    this.state.platforms.push(platform1);

    const platform2 = new Platform(
      this.world,
      { x: window.innerWidth - 300, y: 500 },
      { width: 300, height: 50 },
    );
    this.state.platforms.push(platform2);

    // Add platforms to stage
    this.state.platforms.forEach((platform) => {
      this.addChild(platform);
    });
  }

  loadEntities() {
    // Create entities
    const fan = new Fan(this.world, {
      x: window.innerWidth / 2,
      y: 0.75 * Fan.HEIGHT_PX,
    });
    this.state.fans.push(fan);
    this.addChild(fan);
    const button = new Button(
      { x: fan.x - Button.WIDTH_PX * 2, y: 100 + Button.HEIGHT_PX },
      fan,
    );
    this.state.buttons.push(button);
    this.addChild(button);

    // Create end point
    this.state.endLine = new Endline(this.world, {
      x: window.innerWidth - 2 * Endline.WIDTH_PX,
      y: window.innerHeight - 2 * Endline.HEIGHT_PX,
    });
    this.addChild(this.state.endLine);
  }

  async load() {
    this.loadPlatforms();
    this.loadEntities();
  }

  update(delta: number) {
    super.update(delta);

    // Update platforms
    this.state.platforms.forEach((platform) => {
      platform.update();
    });

    this.state.fans.forEach((fan) => {
      fan.update();
    });

    // Update minions
    this.state.minions.forEach((minion) => {
      minion.update();
    });

    // Update endline
    this.state.endLine?.update();
  }

  nextLevel() {
    sceneManager.switchScene('Level1');
  }
}
