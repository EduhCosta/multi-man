import { Container, Graphics, Rectangle } from 'pixi.js';
import { mToPx, pxToM } from './PhysicsBody';
import {
  Collider,
  ColliderDesc,
  ColliderHandle,
  World,
} from '@dimforge/rapier2d';
import { colliderToEntity, minionMap } from '../store';
import { Toggleable } from './types';

export class Fan extends Container implements Toggleable {
  static WIDTH_PX = 100;
  static HEIGHT_PX = 500;
  world: World;
  colliderDesc: ColliderDesc;
  collider: Collider;
  colliderHandle: ColliderHandle;
  debugMask: Graphics;

  state = {
    enabled: true,
    destroyed: false,
  };

  constructor(world: World, position: { x: number; y: number }) {
    super();
    this.world = world;

    this.debugMask = this.drawMask();
    this.addChild(this.debugMask);

    // Create a cuboid collider
    this.colliderDesc = ColliderDesc.cuboid(
      pxToM(Fan.WIDTH_PX),
      pxToM(Fan.HEIGHT_PX),
    );
    this.colliderDesc.setTranslation(
      pxToM(position.x),
      pxToM(position.y - window.innerHeight),
    );

    this.colliderDesc.setSensor(true);
    this.collider = this.world.createCollider(this.colliderDesc);
    this.colliderHandle = this.collider.handle;

    this.update();
  }

  onCollision(collider2: Collider) {
    if (!this.state.enabled || this.state.destroyed) return;

    const rigidBody = collider2.parent();
    const minionId = colliderToEntity.get().get(collider2.handle);
    if (!minionId) {
      console.error('No minionId found for collider2', collider2.handle);
      return;
    }
    const minion = minionMap.get().get(minionId.id);
    if (!rigidBody || !minion) {
      console.error('No rigidBody or minion found for minionId', minionId);
      return;
    }

    if (minion.variation.type === 'fat') {
      minion.kill();
      this.destroy();
    }
    rigidBody.applyImpulse({ x: 0, y: 4 }, true);
  }

  enable() {
    this.state.enabled = true;
    this.updateMask();
  }

  disable() {
    this.state.enabled = false;
    this.updateMask();
  }

  updateMask() {
    // Update mask
    if (this.debugMask) {
      this.removeChild(this.debugMask);
    }
    this.debugMask = this.drawMask();
    this.addChild(this.debugMask);
  }

  drawMask() {
    // temporary mask
    const mask = new Graphics();
    const color = this.state.enabled && !this.state.destroyed ? 0x00ff00 : 0xff0000;
    mask.beginFill(color);
    mask.drawRect(0, 0, Fan.WIDTH_PX, Fan.HEIGHT_PX);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new Rectangle(0, 0, Fan.WIDTH_PX, Fan.HEIGHT_PX);
    mask.drawRect(0, 0, 200, 200);
    return mask;
  }

  destroy() {
    this.state.destroyed = true;
    this.updateMask();
  }

  update() {
    this.world.intersectionsWith(this.collider, (collider2) => {
      if (!collider2.handle) return true;
      this.onCollision(collider2);
      return true; // Return `false` instead if we want to stop searching for other colliders that contain this point.
    });

    const colliderOffsetY = Fan.HEIGHT_PX - 100;
    this.x = mToPx(this.collider.translation().x) - Fan.WIDTH_PX / 2;
    this.y =
      -mToPx(this.collider.translation().y) -
      Fan.HEIGHT_PX / 2 +
      colliderOffsetY;
  }

  onResize(width: number, height: number) {
    this.colliderDesc.setTranslation(
      pxToM(width * 0.7),
      pxToM(-1 * (height - 500)),
    );
  }
}
