import { Application, Container, Graphics, Point } from 'pixi.js';
import type { SceneUtils } from './SceneManager';
import { World } from '@dimforge/rapier2d';
import config from '../config';
import { Minion } from '../prefabs/Minion';
import { hudStore, minionMap } from '../store';
import { HUD } from '../prefabs/Hud';
import { Vector2 } from 'pixi-spine';
import { sceneManager } from '../main';
import { Fan } from '../prefabs/Fan';
import Platform from '../prefabs/Platform';
import { Button } from '../prefabs/Button';
import Endline from '../prefabs/EndLine';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructorType<T> = new (...args: any[]) => T;

export interface IScene {
  /** Called before start the scene */
  load?(): void | Promise<void>;
  /** Called whent the 'removeScene' is triggered */
  unload?(): void | Promise<void>;
  /** Called after loading the scene */
  start?(): void | Promise<void>;
  /** Called always the navigator changes the screen size */
  onResize?(width: number, height: number): void;
  /** It's the game-loop event */
  update?(delta: number): void;
}

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
const mToP = 32;

export abstract class Scene extends Container implements IScene {
  abstract name: string;
  app: Application;
  public world: World;
  public state: GameSceneState = {
    spawnPoint: new Point(0, window.innerHeight),
    endPoint: new Point(window.innerWidth, window.innerHeight),
    minions: [],
    platforms: [],
    fans: [],
    buttons: [],
    endLine: null,

    minionsAlive: config.minionCount,
    minionsEnded: 0,
  };
  private config = config;

  constructor(app: Application, protected utils: SceneUtils) {
    super();
    this.app = app;
    this.config = utils.config;
    this.state.minionsAlive = utils.config.minionCount;
    this.world = new World(this.config.gravity);
    if (this.config.debug) {
      this.app.stage.addChild(debugGraphics);
    }
  }

  abstract load(): void | Promise<void>;

  async start() {
    await this.utils.assetLoader.loadAssetsGroup('MainMenu');

    const hud = new HUD(
      new Vector2(1920, 1080),
      this.config.minionCount,
      this.nextLevel.bind(this),
      this.exitGame.bind(this),
      Minion.UID,
    );
    this.addChild(hud.frame);

    this.spawnMinions();
    hudStore.set(hud);
  }

  spawnMinions() {
    let spawnedMinions = 0;
    const spawnInterval = 500;

    const spawnMinion = () => {
      if (spawnedMinions >= this.config.minionCount) {
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
    let minionsAlive = this.config.minionCount;
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

  update(delta: number) {
    // Step simulation forward
    this.world.step();
    debugGraphics.clear();

    // Check win
    this.updateMinionStatus();
    this.checkWin();

    // Draw Collider Debug
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

  unload() {
    debugGraphics.clear();
  }

  resetSceneState() {
    this.state = {
      spawnPoint: new Point(0, window.innerHeight),
      endPoint: new Point(window.innerWidth, window.innerHeight),
      minions: [],
      platforms: [],
      fans: [],
      buttons: [],
      endLine: null,

      minionsAlive: this.config.minionCount,
      minionsEnded: 0,
    };
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

  abstract nextLevel(): void | Promise<void>;
  async exitGame() {
    await sceneManager.switchScene('MainMenu');
  }
}

export default Scene;
