import { Graphics, Point } from 'pixi.js';
import { World } from '@dimforge/rapier2d';
import { PhysicsBody, pxToM } from './PhysicsBody';
import { DefaultMinion } from './DefaultMinion';
import { FatMinion } from './FatMinion';
import { MinionAnimation } from './MinionAnimation';
import { colliderToEntity } from '../store';

export enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

type AnimState = any;

export type MinionType = 'default' | 'fat' | 'thin';

// Variation interface
export interface MinionVariation {
  type: MinionType;
  WIDTH_PX: number;
  HEIGHT_PX: number;
  gravityScale: number;
  speed: number;
  turnDuration: number;
  decelerateDuration: number;
  scale: number;
  customBehavior(): void;
  drawMask(): Graphics;
  runAnimation(): MinionAnimation;
}

export class Minion extends PhysicsBody {
  static UID = 0;
  static WIDTH_PX = 50;
  static HEIGHT_PX = 200;

  id: number;
  variation: MinionVariation = new DefaultMinion();
  animation!: MinionAnimation;

  animStates: Record<string, AnimState> = {
    idle: {
      speed: 0.3,
      handler: () => {},
    },
    walk: {
      speed: 1,
      handler: this.walk.bind(this),
    },
    dead: {
      speed: 0,
      handler: () => {},
    },
  };
  currentState = this.animStates.idle;
  state = {
    direction: Directions.RIGHT,
    isGrounded: false,
    hasEnded: false,
    isDead: false,
  };

  constructor(
    world: World,
    spawnPoint: Point,
    initialVariation?: MinionVariation,
  ) {
    super(
      world,
      pxToM(Minion.WIDTH_PX),
      pxToM(Minion.HEIGHT_PX),
      new Point(spawnPoint.x, window.innerHeight - 300),
    );
    if (initialVariation) {
      this.variation = initialVariation;
    }
    this.id = Minion.UID++;

    // Call the animation and set this container as parent of object
    this.animation = this.variation.runAnimation();
    this.animation.setParent(this);

    this.setState(this.animStates.walk);
    this.updateGlobalMaps();
  }

  updateGlobalMaps() {
    // console.log(`Adding minion ${this.id} to global maps`);
    colliderToEntity.get().set(this.collider.handle, {
      type: 'minion',
      id: this.id,
    });
  }

  /**
   * Updates the current minion variation, mask and collider
   * @param newVariation New variation to set
   */
  setVariation(newVariation: MinionVariation) {
    this.variation = newVariation;

    // Update collider
    this.updateCollider(
      pxToM(newVariation.WIDTH_PX),
      pxToM(Minion.HEIGHT_PX),
      newVariation.gravityScale,
    );
    this.updateGlobalMaps();

    // Update animation
    this.animation.destroy();
    this.animation = this.variation.runAnimation();
    this.animation.setParent(this);
  }

  async move() {
    if (!this.state.isGrounded) {
      return;
    }
    const direction =
      this.rigidBody.linvel().x < 0 ? Directions.LEFT : Directions.RIGHT;

    if (
      this.animation.anim.sprite
    ) {
      this.animation.anim.sprite.scale.x = -direction;
      this.animation.anim.sprite.anchor.x = direction === Directions.RIGHT ? 1 : 0;
    }
    this.rigidBody.setLinvel(
      {
        x: this.variation.speed * direction,
        y: this.rigidBody.linvel().y,
      },
      true,
    );
  }

  setState(state: AnimState) {
    this.currentState = state;
  }

  walk() {
    this.move();
  }

  update() {
    super.update();
    this.currentState.handler();
    this.updateGrounded();
  }

  updateGrounded() {
    const e = 10;
    // reset to false if the minion has a positive y velocity
    if (Math.abs(this.rigidBody.linvel().y) < e) {
      this.state.isGrounded = true;
    } else {
      this.state.isGrounded = false;
    }
  }

  onClick() {
    if (this.variation instanceof DefaultMinion) {
      this.setVariation(new FatMinion());
    } else {
      this.setVariation(new DefaultMinion());
    }
  }

  kill() {
    this.setState(this.animStates.dead);
    this.state.isDead = true;
  }

  win() {
    this.setState(this.animStates.idle);
    this.animation.destroy();
    const minionAnimation = this.variation.runAnimation();
    minionAnimation.setState(MinionAnimation.animStates.idle);
    minionAnimation.setParent(this);
    this.state.hasEnded = true;
  }

  onResize(width: number, height: number) {
    console.log(width, height);
  }
}
