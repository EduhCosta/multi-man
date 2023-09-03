import Scene from '../core/Scene';
import { Application, Point } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import { Fan } from '../prefabs/Fan';
import Platform from '../prefabs/Platform';
import Endline from '../prefabs/EndLine';
import { Button } from '../prefabs/Button';
import { sceneManager } from '../main';
import BreakingPlatform from '../prefabs/BreakingPlatform';

export default class Level1 extends Scene {
  name = 'Level1';

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
  }

  loadPlatforms() {
    const ground = new Platform(
      this.world,
      { x: 0, y: 0 },
      { width: 1920, height: 10 },
    );

    this.state.platforms.push(ground);

    const platform1 = new Platform(
      this.world,
      { x: 200, y: 700 },
      { width: 210, height: 10 },
    );
    this.state.platforms.push(platform1);

    const secondLevelHeight = 300;
    const breakablePlatformWidth = 400;
    const secondLevelWidth = (1920 / 2) - breakablePlatformWidth / 2;
    const offset = -300;


    const platform2 = new Platform(
      this.world,
      { x: (secondLevelWidth / 2) + offset / 2, y: secondLevelHeight },
      { width: (secondLevelWidth / 2) + offset /2, height: 10 },
    );
    this.state.platforms.push(platform2);

    const platform3 = new Platform(
      this.world,
      { x: 1920 - secondLevelWidth/2 + offset/2, y: secondLevelHeight },
      { width: secondLevelWidth / 2 + -1 * offset/2, height: 10 },
    );
    this.state.platforms.push(platform3);

    const platform4 = new BreakingPlatform(
      this.world,
      { x: secondLevelWidth + breakablePlatformWidth / 2 + offset, y: secondLevelHeight },
      { width: breakablePlatformWidth/2, height: 10 },
    );
    this.state.platforms.push(platform4);
    // endline:24:25:28

    // Add platforms to stage
    this.state.platforms.forEach((platform) => {
      this.addChild(platform);
    });
  }

  loadEntities() {
    // Create end point
    this.state.endLine = new Endline(this.world, {
      x: window.innerWidth - 2 * Endline.WIDTH_PX,
      y: 2 * Endline.HEIGHT_PX,
    });
    this.addChild(this.state.endLine);
  }

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');
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
    sceneManager.switchScene('Level2');
  }
}
