import { Container } from 'pixi.js';
import {
  World,
  RigidBodyDesc,
  ColliderDesc,
  RigidBodyHandle,
  ColliderHandle,
  RigidBody,
  Collider,
} from '@dimforge/rapier2d';
import { Directions } from './Minion';

export function pxToM(px: number) {
  return px / 32;
}

export function mToPx(m: number) {
  return m * 32;
}

export class PhysicsBody extends Container {
  // Rapier physics properties
  world: World;
  rigidBody: RigidBody;
  bodyHandle: RigidBodyHandle;
  collider: Collider;
  colliderHandle: ColliderHandle;

  constructor(world: World, width: number, height: number) {
    super();
    this.world = world;

    // Create a dynamic rigid-body.
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setTranslation(0.0, 0)
      .lockRotations(); // prevent rotations.

    this.rigidBody = this.world.createRigidBody(rigidBodyDesc);
    this.bodyHandle = this.rigidBody.handle;

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.cuboid(width / 2, height / 2);
    this.collider = this.world.createCollider(colliderDesc, this.rigidBody);
    this.colliderHandle = this.collider.handle;
  }

  // Update the position of the sprite based on the physics body.
  update() {
    const translation = this.rigidBody.translation();
    this.x = mToPx(translation.x) - this.width / 2;
    this.y = -mToPx(translation.y) - this.height / 2;

    this.checkBounds();
  }

  // Check if the sprite is out of bounds and reverse the velocity if so.
  checkBounds() {
    const direction =
      this.rigidBody.linvel().x < 0 ? Directions.LEFT : Directions.RIGHT;
    if (
      (direction === Directions.LEFT && this.x < 0) ||
      (direction === Directions.RIGHT &&
        this.x > window.innerWidth - this.width)
    ) {
      const { x: curX, y: curY } = this.rigidBody.linvel();
      this.rigidBody.setLinvel({ x: -1 * curX, y: curY }, true);
    }
  }
}
