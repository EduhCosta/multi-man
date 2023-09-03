import Scene from '../core/Scene';
import { Application, Graphics } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import * as RAPIER from '@dimforge/rapier2d';
import { Fan } from '../prefabs/Fan';
import { pxToM } from '../prefabs/PhysicsBody';
import { DefaultMinion } from '../prefabs/DefaultMinion';
import { FatMinion } from '../prefabs/FatMinion';
import { minionMap } from '../store';

const gravity = {
  x: 0,
  y: -9.81,
};

const MINION_COUNT = 5;
const mToP = 32;
const groundGraphics = new Graphics();

export default class Game extends Scene {
  name = 'Game';

  private minions!: Minion[];
  public world: RAPIER.World;
  private groundColliderDesc: RAPIER.ColliderDesc;
  private groundCollider: RAPIER.Collider;
  private fan!: Fan;

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
    this.app = app;
    this.world = new RAPIER.World(gravity);

    this.groundColliderDesc = RAPIER.ColliderDesc.cuboid(
      pxToM(window.innerWidth),
      10,
    );
    this.groundColliderDesc.setTranslation(0, -1 * pxToM(window.innerHeight));
    this.groundCollider = this.world.createCollider(this.groundColliderDesc);
    this.app.stage.addChild(groundGraphics);
  }

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');
    this.minions = Array.from({ length: MINION_COUNT }, () => {
      const minion = new Minion(this.world);
      this.addChild(minion);

      // Add minion to global minion map
      minionMap.get().set(minion.id, minion);
      return minion;
    });

    this.fan = new Fan(this.world);
    this.addChild(this.fan);
  }

  onResize(width: number, height: number) {
    this.world.removeCollider(this.groundCollider, true);
    this.groundColliderDesc = RAPIER.ColliderDesc.cuboid(pxToM(width), 10);
    this.groundColliderDesc.setTranslation(0, -1 * pxToM(window.innerHeight));
    this.groundCollider = this.world.createCollider(this.groundColliderDesc);
    this.minions.forEach((minion) => {
      minion.onResize(width, height);
    });
    this.fan.onResize(width, height);
  }

  async start() {}

  update(delta: number) {
    // Step simulation forward
    this.world.step();
    groundGraphics.clear();

    // Update fan
    this.fan.update();

    // Update minions
    this.minions.forEach((minion) => {
      minion.update();
    });

    const buffers = this.world.debugRender();
    const vtx = buffers.vertices;
    const cls = buffers.colors;

    for (let i = 0; i < vtx.length / 4; i += 1) {
      const color = 0xffffff;
      groundGraphics.lineStyle(1.0, color, cls[i * 8 + 3], 0.5, true);
      groundGraphics.moveTo(vtx[i * 4] * mToP, -vtx[i * 4 + 1] * mToP);
      groundGraphics.lineTo(vtx[i * 4 + 2] * mToP, -vtx[i * 4 + 3] * mToP);
    }
  }

  unload() {}
}
