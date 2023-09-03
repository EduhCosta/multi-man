import { Container, Graphics } from 'pixi.js';
import { mToPx, pxToM } from './PhysicsBody';
import {
  Collider,
  ColliderDesc,
  ColliderHandle,
  World,
} from '@dimforge/rapier2d';

export class Fan extends Container {
  static WIDTH_PX = 100;
  static HEIGHT_PX = 500;
  world: World;
  collider: Collider;
  colliderHandle: ColliderHandle;

  constructor(world: World) {
    super();
    this.world = world;

    // temporary mask
    const mask = new Graphics();
    mask.beginFill(0x0000ff);
    mask.drawRect(0, 0, 100, 100);
    mask.endFill();
    this.addChild(mask);

    // Create a cuboid collider
    const colliderDesc = ColliderDesc.cuboid(
      pxToM(Fan.WIDTH_PX),
      pxToM(Fan.HEIGHT_PX),
    );
    colliderDesc.setTranslation(
      pxToM(window.innerWidth - 300),
      pxToM(-1 * (window.innerHeight - 500)),
    );
    colliderDesc.setSensor(true);
    this.collider = this.world.createCollider(colliderDesc);
    this.colliderHandle = this.collider.handle;
  }

  onCollision(collider2: Collider) {
    const rigidBody = collider2.parent();
    if (!rigidBody) return;
    rigidBody.applyImpulse({ x: 0, y: 10 }, true);
  }

  update() {
    this.world.intersectionsWith(this.collider, (collider2) => {
      if (!collider2.handle) return true;
      this.onCollision(collider2);
      return true; // Return `false` instead if we want to stop searching for other colliders that contain this point.
    });

    this.x = mToPx(this.collider.translation().x) - Fan.WIDTH_PX / 2;
    this.y = mToPx(-1 * this.collider.translation().y) + Fan.HEIGHT_PX / 2;
  }
}
