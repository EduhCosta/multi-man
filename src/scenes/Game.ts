import { Vector2 } from 'pixi-spine';
import Scene from '../core/Scene';
import { HUD } from '../prefabs/Hud';
import { Application, Graphics, Point } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import * as RAPIER from '@dimforge/rapier2d';
import { Fan } from '../prefabs/Fan';
import { hudStore, minionMap } from '../store';
import Platform from '../prefabs/Platform';
import Endline from '../prefabs/EndLine';
import { Button } from '../prefabs/Button';

const gravity = {
  x: 0,
  y: -9.81,
};

const MINION_COUNT = 1;
const mToP = 32;

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

const debugGraphics = new Graphics();
export default class Game extends Scene {
  name = 'Game';
  public world: RAPIER.World;
  public state: GameSceneState = {
    spawnPoint: new Point(0, window.innerHeight),
    endPoint: new Point(window.innerWidth, window.innerHeight),
    minions: [],
    platforms: [],
    fans: [],
    buttons: [],
    endLine: null,

    minionsAlive: MINION_COUNT,
    minionsEnded: 0,
  };

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
    this.app = app;
    this.world = new RAPIER.World(gravity);
    this.app.stage.addChild(debugGraphics);
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
      { x: 200, y:500 },
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

  async start() {
    await this.utils.assetLoader.loadAssetsGroup('MainMenu');

    const hud = new HUD(new Vector2(1920, 1080), MINION_COUNT);
    this.addChild(hud.frame);
    hudStore.set(hud);

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

      const minion = new Minion(this.world, this.state.spawnPoint);
      this.addChild(minion);

      // Add minion to global minion map
      minionMap.get().set(minion.id, minion);

      this.state.minions.push(minion);
      spawnedMinions++;
    };

    const intervalId = setInterval(spawnMinion, spawnInterval);
  }

  updateMinionStatus() {
    let minionsAlive = MINION_COUNT;
    let minionsEnded = 0;

    this.state.minions.forEach((minion) => {
      if (minion.state.isDead) {
        minionsAlive--;
      }
      if (minion.state.hasEnded) {
        minionsEnded++;
      }
    });

    this.state.minionsAlive = minionsAlive;
    this.state.minionsEnded = minionsEnded;
  }

  checkWin() {
    if (this.state.minionsAlive === this.state.minionsEnded) {
      console.log('WIN PORRA');
    }
  }

  onResize(width: number, height: number) {
    this.state.platforms.forEach((platform) => {
      platform.onResize(width, height);
    });
    this.state.minions.forEach((minion) => {
      minion?.onResize(width, height);
    });
    this.state.fans.forEach((minion) => {
      minion?.onResize(width, height);
    });
  }

  update(delta: number) {
    // Step simulation forward
    this.world.step();
    debugGraphics.clear();

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

    // Check win
    this.updateMinionStatus();
    this.checkWin();

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
