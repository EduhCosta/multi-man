import { Graphics, Rectangle } from 'pixi.js';
import { World } from '@dimforge/rapier2d';
import { PhysicsBody, pxToM } from './PhysicsBody';
import { DefaultMinion } from './DefaultMinion';
import { FatMinion } from './FatMinion';

export enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

type AnimState = any;

// Variation interface
export interface MinionVariation {
  WIDTH_PX: number;
  HEIGHT_PX: number;
  gravityScale: number;
  speed: number;
  turnDuration: number;
  decelerateDuration: number;
  scale: number;
  customBehavior(): void;
  drawMask(): Graphics;
}

export class Minion extends PhysicsBody {
  static WIDTH_PX = 50;
  static HEIGHT_PX = 200;

  variation: MinionVariation = new DefaultMinion();

  animStates: Record<string, AnimState> = {
    idle: {
      speed: 0.3,
      handler: () => {},
    },
    walk: {
      speed: 1,
      handler: this.walk.bind(this),
    },
  };
  currentState = this.animStates.idle;

  state = {
    direction: Directions.RIGHT,
  };

  debugMask: Graphics;

  constructor(world: World, initialVariation?: MinionVariation) {
    super(world, pxToM(Minion.WIDTH_PX), pxToM(Minion.HEIGHT_PX));
    if (initialVariation) {
      this.variation = initialVariation;
    }

    this.debugMask = this.variation.drawMask();
    this.debugMask.onclick = this.onClick.bind(this);
    this.addChild(this.debugMask);
    this.setState(this.animStates.walk);
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

    // Update mask
    this.removeChild(this.debugMask);
    this.debugMask = this.variation.drawMask();
    this.debugMask.onclick = this.onClick.bind(this);
    this.addChild(this.debugMask);
  }

  async move() {
    const direction =
      this.rigidBody.linvel().x < 0 ? Directions.LEFT : Directions.RIGHT;
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
  }

  onClick() {
    if (this.variation instanceof DefaultMinion) {
      this.setVariation(new FatMinion());
    } else {
      this.setVariation(new DefaultMinion());
    }
  }

  onResize(width: number, height: number) {}
}
