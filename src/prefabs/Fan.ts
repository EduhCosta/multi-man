import { Container, Graphics, Rectangle, Sprite } from 'pixi.js';
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
  static WIDTH_PX = 175;
  static HEIGHT_PX = 500;
  world: World;
  colliderDesc: ColliderDesc;
  collider: Collider;
  colliderHandle: ColliderHandle;

  fan: Sprite;
  wind: Sprite;

  state = {
    enabled: false,
    destroyed: false,
  };

  constructor(world: World, position: { x: number; y: number }) {
    super();
    this.world = world;

    this.sortableChildren = true;

    this.fan = Sprite.from('Game/images/fan.png');
    this.fan.zIndex = 1;
    this.fan.anchor.set(.3, -.5);

    this.wind = Sprite.from('Game/images/wind.png');
    this.wind.zIndex = -1;
    this.wind.visible = this.state.enabled;
    this.wind.position.y -= 1000;
    this.wind.position.x -= 100;

    this.addChild(this.fan);
    this.addChild(this.wind);

    this.sortChildren();
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
    rigidBody.applyImpulse({ x: 0, y: 2.5 }, true);
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
    const enabled = this.state.enabled && !this.state.destroyed;
    this.wind.visible = enabled;
  }

  drawMask() {
    // temporary mask
    const mask = new Graphics();
    const color =
      this.state.enabled && !this.state.destroyed ? 0x00ff00 : 0xff0000;
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
