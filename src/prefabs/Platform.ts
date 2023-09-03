import { Collider, ColliderDesc, World } from '@dimforge/rapier2d';
import { Container, Graphics } from 'pixi.js';
import { pxToM } from './PhysicsBody';

export default class Platform extends Container {
  private colliderDesc: ColliderDesc;
  private groundCollider: Collider;
  private world: World;
  private groundGraphics: Graphics;

  /**
   *
   * @param world
   * @param position position in pixel coordinates
   * @param size size in pixel coordinates
   */
  constructor(
    world: World,
    position: { x: number; y: number },
    size: { width: number; height: number },
  ) {
    super();

    this.world = world;
    this.colliderDesc = ColliderDesc.cuboid(
      pxToM(size.width),
      pxToM(size.height),
    );
    this.colliderDesc.setTranslation(
      pxToM(position.x),
      pxToM(position.y - window.innerHeight),
    );
    this.groundCollider = this.world.createCollider(this.colliderDesc);

    this.groundGraphics = new Graphics();
    this.addChild(this.groundGraphics);
  }

  onResize(width: number, height: number) {
    this.world.removeCollider(this.groundCollider, true);
    this.colliderDesc = ColliderDesc.cuboid(pxToM(width), 10);
    this.colliderDesc.setTranslation(0, -1 * pxToM(height));
    this.groundCollider = this.world.createCollider(this.colliderDesc);
  }
}
