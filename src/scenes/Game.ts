import Scene from '../core/Scene';
import { Application, Graphics, Point } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import * as RAPIER from '@dimforge/rapier2d';
import { Fan } from '../prefabs/Fan';
import { minionMap } from '../store';
import Platform from '../prefabs/Platform';
import { pxToM } from '../prefabs/PhysicsBody';
import Endline from '../prefabs/EndLine';

const gravity = {
  x: 0,
  y: -9.81,
};

const MINION_COUNT = 5;
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


    this.spawnMinions();

    // Create entities
    this.fan = new Fan(this.world, { x: window.innerWidth / 2, y: .75 * Fan.HEIGHT_PX });
    this.addChild(this.fan);

    this.endLine = new Endline(this.world, {
      x: window.innerWidth - 2 * Endline.WIDTH_PX,
      y: window.innerHeight - 2 * Endline.HEIGHT_PX,
    });
    this.addChild(this.endLine);
  }

  spawnMinions() {
    let spawnedMinions = 0;
    const spawnInterval = 500; // 1000ms or 1 second

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
      minion.onResize(width, height);
    });
    this.fan.onResize(width, height);
  }

  async start() {}

  update(delta: number) {
    // Step simulation forward
    this.world.step();
    debugGraphics.clear();

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
