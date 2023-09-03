import { Vector2 } from 'pixi-spine';
import Scene from '../core/Scene';
import { HUD } from '../prefabs/Hud';
import { Application, Graphics, Point } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import * as RAPIER from '@dimforge/rapier2d';
import { Fan } from '../prefabs/Fan';
import { minionMap } from '../store';
import Platform from '../prefabs/Platform';
import Endline from '../prefabs/EndLine';
import { Button } from '../prefabs/Button';
import BreakingPlatform from '../prefabs/BreakingPlatform';

const gravity = {
  x: 0,
  y: -9.81,
};

const MINION_COUNT = 1;
const mToP = 32;

const debugGraphics = new Graphics();
export default class Game extends Scene {
  name = 'Game';

  private spawnPoint = new Point(0, window.innerHeight);
  private platforms: Platform[] = [];
  private minions: Minion[] = [];
  public world: RAPIER.World;
  private endLine!: Endline;

  private fan!: Fan;

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
    this.app = app;
    this.world = new RAPIER.World(gravity);
    this.app.stage.addChild(debugGraphics);
  }

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');

    // Default example
    // this.defaultMinion = new MinionAnimation('default');
    // this.defaultMinion.x = window.innerWidth / 2 - this.defaultMinion.width / 2;
    // this.defaultMinion.y = window.innerHeight / 2;
    // // Thin examples
    // this.thinMinion = new MinionAnimation('thin');
    // this.thinMinion.x = window.innerWidth / 2 + this.defaultMinion.width / 2;
    // this.thinMinion.y = window.innerHeight / 2;

    // Create platforms
    const ground = new Platform(
      this.world,
      { x: 0, y: 0 },
      { width: window.innerWidth, height: 100 },
    );

    this.platforms.push(ground);
    this.addChild(ground);

    const platform1 = new Platform(
      this.world,
      { x: 300, y: 1000 },
      { width: 300, height: 50 },
    );
    this.platforms.push(platform1);
    this.addChild(platform1);
    const platform2 = new Platform(
      this.world,
      { x: window.innerWidth - 500, y: 1000 },
      { width: 500, height: 50 },
    );
    this.platforms.push(platform2);
    this.addChild(platform2);

    // Create entities
    this.fan = new Fan(this.world, {
      x: window.innerWidth / 2,
      y: 0.75 * Fan.HEIGHT_PX,
    });
    this.addChild(this.fan);

    const button = new Button(
      { x: this.fan.x - Button.WIDTH_PX * 2, y: 100 + Button.HEIGHT_PX },
      this.fan,
    );
    this.addChild(button);

    this.endLine = new Endline(this.world, {
      x: window.innerWidth - 2 * Endline.WIDTH_PX,
      y: window.innerHeight - 2 * Endline.HEIGHT_PX,
    });
    this.addChild(this.endLine);

    const breakingPlatform = new BreakingPlatform(this.world, {
      x: 800,
      y: 500,
    }, {
      width: 100,
      height: 50,
    });
    this.platforms.push(breakingPlatform);
    this.addChild(breakingPlatform);
  }

  async start() {
    await this.utils.assetLoader.loadAssetsGroup('MainMenu');

    const hud = new HUD(new Vector2(1920, 1080), 5);
    this.addChild(hud.frame);

    this.spawnMinions();
  }

  spawnMinions() {
    let spawnedMinions = 0;
    const spawnInterval = 500;

    const spawnMinion = () => {
      if (spawnedMinions >= MINION_COUNT) {
        clearInterval(intervalId); // Stop the interval when reaching MINION_COUNT
        return;
      }

      const minion = new Minion(this.world, this.spawnPoint);
      this.addChild(minion);

      // Add minion to global minion map
      minionMap.get().set(minion.id, minion);

      this.minions.push(minion);
      spawnedMinions++;
    };

    const intervalId = setInterval(spawnMinion, spawnInterval);
  }

  onResize(width: number, height: number) {
    this.platforms.forEach((platform) => {
      platform.onResize(width, height);
    });
    this.minions.forEach((minion) => {
      minion?.onResize(width, height);
    });
    this.fan.onResize(width, height);
  }

  update(delta: number) {
    // Step simulation forward
    this.world.step();
    debugGraphics.clear();

    // Update platforms
    // Here the grounded status of minions is updated
    this.platforms.forEach((platform) => {
      platform.update();
    });

    // Update fan
    this.fan.update();

    // Update minions
    this.minions.forEach((minion) => {
      minion.update();
    });

    // Update endline
    this.endLine.update();

    const buffers = this.world.debugRender();
    const vtx = buffers.vertices;
    const cls = buffers.colors;

    for (let i = 0; i < vtx.length / 4; i += 1) {
      const color = 0xffffff;
      debugGraphics.lineStyle(1.0, color, cls[i * 8 + 3], 0.5, true);
      debugGraphics.moveTo(vtx[i * 4] * mToP, -vtx[i * 4 + 1] * mToP);
      debugGraphics.lineTo(vtx[i * 4 + 2] * mToP, -vtx[i * 4 + 3] * mToP);
    }
  }

  unload() {}
}
