import Scene from '../core/Scene';
import { Application, Point } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import { Fan } from '../prefabs/Fan';
import Platform from '../prefabs/Platform';
import Endline from '../prefabs/EndLine';
import { Button } from '../prefabs/Button';
import { sceneManager } from '../main';
import Background from '../prefabs/Background';

export type GameSceneState = {
  // Scene
  spawnPoint: Point;
  minions: Minion[];
  platforms: Platform[];
  fans: Fan[];
  buttons: Button[];
  endPoint: Point;
  endLine: Endline | null;

  // Game State
  minionsAlive: number;
  minionsEnded: number;
};

export default class Level1 extends Scene {
  name = 'Level1';

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
  }

  loadPlatforms() {
    const ground = new Platform(
      this.world,
      { x: 0, y: 0 },
      { width: window.innerWidth, height: 30 },
      { src: 'Game/images/l1_plat.png', height: 250 },
    );

    this.state.platforms.push(ground);

    const platform1 = new Platform(
      this.world,
      { x: 200, y: 500 },
      { width: 200, height: 30 },
    );
    this.state.platforms.push(platform1);

    // Add platforms to stage
    this.state.platforms.forEach((platform) => {
      this.addChild(platform);
      platform.zIndex = 99;
    });
  }

  loadEntities() {
    // Create end point
    this.state.endLine = new Endline(this.world, {
      x: window.innerWidth - 2 * Endline.WIDTH_PX,
      y: 2 * Endline.HEIGHT_PX,
    });
    this.state.endLine.zIndex = 101;
    this.addChild(this.state.endLine);
  }

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');
    this.loadPlatforms();
    this.loadEntities();

    const bg = new Background();
    bg.zIndex = -99;
    this.sortableChildren = true;
    this.sortChildren();
    this.addChild(bg);
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
    localStorage.setItem('@multi-man/next-level', 'Level2');
    sceneManager.switchScene('WinGame');
  }
}
