import Platform, { getHeightFromVelocity } from './Platform';
import { Collider, ColliderDesc, World } from '@dimforge/rapier2d';
import { Container, Graphics, Rectangle } from 'pixi.js';
import { mToPx, pxToM } from './PhysicsBody';
import { colliderToEntity, minionMap } from '../store';
import { Minion } from './Minion';

export default class BreakingPlatform extends Platform {
  state = {
    broken: false,
  };
  debugMask: Graphics;

  constructor(
    world: World,
    position: { x: number; y: number },
    size: { width: number; height: number },
  ) {
    super(world, position, size);

    this.debugMask = this.drawMask();
    this.addChild(this.debugMask);

    this.x = mToPx(this.collider.translation().x) - size.width / 2;
    this.y = -mToPx(this.collider.translation().y) - size.height / 2;
  }

  onCollision(collider2: Collider): void {
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

    // Minion is falling and has collided with the ground
    if (!minion.state.isGrounded && minion.variation.type === 'fat') {
      minion.state.isGrounded = true;
      const velocity = rigidBody.linvel();
      const height = getHeightFromVelocity(velocity.y);
      if (height > pxToM(2 * Minion.HEIGHT_PX)) {
        this.destroyPlatform();
        minion.kill();
      }
    }
  }

  destroyPlatform() {
    this.state.broken = true;
    this.debugMask.destroy();
    this.world.removeCollider(this.collider, true);
    this.world.removeCollider(this.groundCollider, true);
  }

  drawMask() {
    if (this.debugMask) {
      this.debugMask.destroy();
    }

    // temporary mask
    const mask = new Graphics();
    const color = this.state.broken ? 0x000000 : 0xff0000;

    mask.beginFill(color);
    mask.drawRect(0, 0, this.size.width, this.size.height);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new Rectangle(0, 0, this.size.width, this.size.height);
    return mask;
  }
}
