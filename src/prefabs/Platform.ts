import { Collider, ColliderDesc, World } from '@dimforge/rapier2d';
import { Container, Graphics, Sprite, Texture, TilingSprite } from 'pixi.js';
import { mToPx, pxToM } from './PhysicsBody';
import { colliderToEntity, minionMap } from '../store';
import { Minion } from './Minion';

export function getHeightFromVelocity(
  velocity: number,
  initialVelocity: number = 0,
  gravity: number = 9.8,
) {
  return (Math.pow(velocity, 2) - Math.pow(initialVelocity, 2)) / (2 * gravity);
}

export default class Platform extends Container {
  private colliderDesc: ColliderDesc;
  public collider: Collider;

  private groundColliderDesc: ColliderDesc;
  public groundCollider: Collider;

  public world: World;
  private groundGraphics: Graphics;

  public size: { width: number; height: number };

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
    textureSrc: { src: string, height: number, } = { src: 'Game/images/l1_plat_float.png', height: 120},
  ) {
    super();
    this.size = size;
    this.world = world;
    this.colliderDesc = ColliderDesc.cuboid(
      pxToM(size.width),
      pxToM(size.height),
    );
    this.colliderDesc.setTranslation(
      pxToM(position.x),
      pxToM(position.y - window.innerHeight),
    );
    this.collider = this.world.createCollider(this.colliderDesc);

    this.groundColliderDesc = ColliderDesc.cuboid(pxToM(size.width), pxToM(10));
    this.groundColliderDesc.setTranslation(
      pxToM(position.x),
      pxToM(position.y - window.innerHeight + size.height),
    );
    this.groundColliderDesc.setSensor(true);
    this.groundCollider = this.world.createCollider(this.groundColliderDesc);

    this.groundGraphics = new Graphics();
    this.addChild(this.groundGraphics);

    // Setting sprite
    const translation = this.collider.translation();
    this.x = mToPx(translation.x) - this.width / 2;
    this.y = -mToPx(translation.y) - this.height / 2;

    const texture = Texture.from(textureSrc.src);
    const tilingSprite = new TilingSprite(texture, 2 * size.width, textureSrc.height);
    tilingSprite.anchor.set(0.5, 1);
    this.addChild(tilingSprite);
  }

  onCollision(collider2: Collider) {
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
    if (!minion.state.isGrounded) {
      minion.state.isGrounded = true;
      const velocity = rigidBody.linvel();
      const height = getHeightFromVelocity(velocity.y);
      if (height > pxToM(5 * Minion.HEIGHT_PX)) {
        minion.kill();
      }
    }
  }

  onResize(width: number, height: number) {
    this.world.removeCollider(this.collider, true);
    this.colliderDesc = ColliderDesc.cuboid(pxToM(width), 10);
    this.colliderDesc.setTranslation(0, -1 * pxToM(height));
    this.collider = this.world.createCollider(this.colliderDesc);
  }

  update() {
    this.world.intersectionsWith(this.groundCollider, (collider2) => {
      if (!collider2.handle) return true;
      this.onCollision(collider2);
      return true; // Return `false` instead if we want to stop searching for other colliders that contain this point.
    });
  }
}
