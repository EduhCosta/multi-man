import { Collider, ColliderDesc, World } from '@dimforge/rapier2d';
import { Container, Graphics, Rectangle, Sprite } from 'pixi.js';
import { mToPx, pxToM } from './PhysicsBody';
import { colliderToEntity, minionMap } from '../store';
import { centerObjects } from '../utils/misc';

export default class Endline extends Container {
  static WIDTH_PX = 100;
  static HEIGHT_PX = 100;
  private colliderDesc: ColliderDesc;
  private collider: Collider;
  private world: World;

  constructor(world: World, position: { x: number; y: number }) {
    super();
    this.world = world;
    this.colliderDesc = ColliderDesc.cuboid(
      pxToM(Endline.WIDTH_PX),
      pxToM(Endline.HEIGHT_PX),
    );
    this.colliderDesc.setTranslation(pxToM(position.x), pxToM(position.y - window.innerHeight)).setSensor(true);
    this.collider = this.world.createCollider(this.colliderDesc);

    // Setting sprite
    const sprite = Sprite.from('Game/images/bau.png');
    sprite.anchor.set(0.3);

    this.addChild(sprite);

    const light = Sprite.from('Game/images/light.png');
    light.anchor.set(0.5);

    this.addChild(sprite);
    this.addChild(light);

    this.x = mToPx(this.collider.translation().x) - Endline.WIDTH_PX / 2;
    this.y = -mToPx(this.collider.translation().y) - Endline.HEIGHT_PX / 2;
  }

  drawMask() {
    // temporary mask
    const mask = new Graphics();
    mask.beginFill(0xff55ff);
    mask.drawRect(0, 0, Endline.WIDTH_PX, Endline.HEIGHT_PX);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new Rectangle(0, 0, Endline.WIDTH_PX, Endline.HEIGHT_PX);
    mask.drawRect(0, 0, 200, 200);
    return mask;
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
    minion.win();
  }

  update() {
    this.world.intersectionsWith(this.collider, (collider2) => {
      if (!collider2.handle) return true;
      this.onCollision(collider2);
      return true; // Return `false` instead if we want to stop searching for other colliders that contain this point.
    });
  }
}
