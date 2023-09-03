import { Graphics } from 'pixi.js';
import { World } from '@dimforge/rapier2d';
import { PhysicsBody, pxToM } from './PhysicsBody';

export enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

type AnimState = any;

export class Minion extends PhysicsBody {
  static WIDTH_PX = 100;
  static HEIGHT_PX = 200;


  config = {
    speed: 5,
    turnDuration: 0.15,
    decelerateDuration: 0.1,
    scale: 1,
  };

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

  constructor(world: World) {
    super(world, pxToM(Minion.WIDTH_PX), pxToM(Minion.HEIGHT_PX));

    // temporary mask
    const mask = new Graphics();

    const getRandomHex = () => {
      return Math.floor(Math.random() * 255);
    };
    mask.beginFill(
      (getRandomHex() << 16) | (getRandomHex() << 8) | getRandomHex(),
    );
    mask.drawRect(0, 0, Minion.WIDTH_PX, Minion.HEIGHT_PX);
    mask.endFill();
    this.addChild(mask);

    this.setState(this.animStates.walk);
  }

  async move() {
    const direction =
      this.rigidBody.linvel().x < 0 ? Directions.LEFT : Directions.RIGHT;
    this.rigidBody.setLinvel(
      {
        x: (this.config.speed - 2 * Math.random() )* direction,
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
}
