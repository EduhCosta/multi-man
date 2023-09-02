import Scene from '../core/Scene';
import { Application } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SystemRunner } from '../core/SystemRunner';
import { SceneUtils } from '../core/SceneManager';
import { PhysicsSystem } from '../systems/PhysicsSystem';

export default class Game extends Scene {
  name = 'Game';

  private minion!: Minion;
  public systems: SystemRunner;

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
    this.app = app;
    this.systems = new SystemRunner(this);
  }


  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');

    this.minion = new Minion();
    this.minion.x = window.innerWidth / 2;
    this.minion.y = window.innerHeight - 1.5 * this.minion.height;
    this.addChild(this.minion);


    this.systems.addSystem(PhysicsSystem);
    this.systems.init();

    // Add minion
    this.systems.get(PhysicsSystem).addBody(this.minion.physicsBody);
  }

  onResize(width: number, height: number) {}

  async start() {

  }

  update(delta: number) {
    // Update all systems
    this.systems.update(delta);
    this.minion.update();
  }

  unload() {}
}
