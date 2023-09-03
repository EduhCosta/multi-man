import { Container, Point } from 'pixi.js';
import {
  World,
  RigidBodyDesc,
  ColliderDesc,
  RigidBodyHandle,
  ColliderHandle,
  RigidBody,
  Collider,
} from '@dimforge/rapier2d';

export enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

export function pxToM(px: number) {
  return px / 32;
}

export function mToPx(m: number) {
  return m * 32;
}

const collisionGroups = {
  minion: 0x0001,
};

export class PhysicsBody extends Container {
  DEFAULT_GRAVITY_SCALE = 1;

  // Rapier physics properties
  world: World;
  rigidBodyDesc: RigidBodyDesc;
  rigidBody: RigidBody;
  bodyHandle: RigidBodyHandle;
  colliderDesc: ColliderDesc;
  collider: Collider;
  colliderHandle: ColliderHandle;

  // Define a collision group just for minions.
  MINION_GROUP = 0x0001; // First bit represents minion group
  EVERYTHING_BUT_MINION = 0xfffe; // All bits set except the minion group bit

  constructor(world: World, width: number, height: number, spawnPosition: Point) {
    super();
    this.world = world;

    // Create a dynamic rigid-body.
    this.rigidBodyDesc = RigidBodyDesc.dynamic()
      .setTranslation(pxToM(spawnPosition.x), pxToM(spawnPosition.y - window.innerHeight/2))
      .lockRotations(); // prevent rotations.

    this.rigidBody = this.world.createRigidBody(this.rigidBodyDesc);

    this.bodyHandle = this.rigidBody.handle;

    // Create a cuboid collider attached to the dynamic rigidBody.
    this.colliderDesc = ColliderDesc.cuboid(width / 2, height / 2)
      .setCollisionGroups(
        (this.MINION_GROUP << 16) | this.EVERYTHING_BUT_MINION,
      )
      .setSolverGroups((this.MINION_GROUP << 16) | this.EVERYTHING_BUT_MINION); // Set the membership and filter
    this.collider = this.world.createCollider(
      this.colliderDesc,
      this.rigidBody,
    );
    this.collider.setDensity(1.0);
    this.colliderHandle = this.collider.handle;
  }

  // Update the position of the sprite based on the physics body.
  update() {
    const translation = this.rigidBody.translation();
    this.x = mToPx(translation.x) - this.width / 2;
    this.y = -mToPx(translation.y) - this.height / 2;
    this.checkXBounds();
  }

  // Check if the sprite is out of bounds and reverse the velocity if so.
  checkXBounds() {
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

  updateCollider(widthM: number, heightM: number, gravityScale: number) {
    // Remove old collider
    this.world.removeCollider(this.collider, true);

    // Create new collider
    this.colliderDesc = ColliderDesc.cuboid(widthM / 2, heightM / 2)
      .setCollisionGroups(
        (this.MINION_GROUP << 16) | this.EVERYTHING_BUT_MINION,
      )
      .setSolverGroups((this.MINION_GROUP << 16) | this.EVERYTHING_BUT_MINION); // Set the membership and filter
    this.collider = this.world.createCollider(
      this.colliderDesc,
      this.rigidBody,
    );
    this.collider.setDensity(1.0);
    this.rigidBody.setGravityScale(gravityScale, true);
    this.colliderHandle = this.collider.handle;
  }

  setMass(newMass: number) {
    this.rigidBody.setGravityScale(newMass, true);
  }
}
