import Scene from '../core/Scene';
import { Application, Graphics } from 'pixi.js';
import { Minion } from '../prefabs/Minion';
import { SceneUtils } from '../core/SceneManager';
import * as RAPIER from '@dimforge/rapier2d';

const gravity = {
  x: 0,
  y: -9.81,
};

const mToP = 32; // Meter to pixels.
const groundGraphics = new Graphics();

export default class Game extends Scene {
  name = 'Game';

  private minion!: Minion;
  public world: RAPIER.World;

  constructor(app: Application, protected utils: SceneUtils) {
    super(app, utils);
    this.app = app;
    this.world = new RAPIER.World(gravity);

    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(
      window.innerWidth / mToP,
      1,
    );
    groundColliderDesc.setTranslation(0, (-1 * window.innerHeight) / mToP);
    const groundCollider = this.world.createCollider(groundColliderDesc);
    this.app.stage.addChild(groundGraphics);
  }

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('Game');
    this.minion = new Minion(this.world);
    this.minion.x = window.innerWidth / 2;
    this.minion.y = window.innerHeight - 1.5 * this.minion.height;
    this.addChild(this.minion);
  }

  onResize(width: number, height: number) {}
  async start() {}

  update(delta: number) {
    // Step simulation forward
    this.world.step();
    groundGraphics.clear();

    this.minion.update();

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
