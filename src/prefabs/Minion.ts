import { Container, Graphics } from 'pixi.js';
import { PhysicsBody, PhysicsState } from './PhysicsBody';

export enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

type AnimState = any;

export class Minion extends Container {
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

  public physicsBody: PhysicsBody;

  constructor() {
    super();
    this.physicsBody = new PhysicsBody(this);
    this.physicsBody.setState(PhysicsState.DYNAMIC);
    this.physicsBody.position.set(this.position.x, this.position.y);

    const mask = new Graphics();
    // Add the rectangular area to show
    mask.beginFill(0xff0000);
    mask.drawRect(0, 0, 200, 200);
    mask.endFill();
    this.addChild(mask);

    this.setState(this.animStates.walk);
  }

  async move() {
    const walkSpeed = this.config.speed;
    if (Math.abs(this.physicsBody.velocity.x) < walkSpeed) {
      this.physicsBody.applyForce(walkSpeed, 0);
    }
  }

  setState(state: AnimState) {
    this.currentState = state;
  }

  walk() {
    this.move();
  }

  update() {
    this.currentState.handler();
    // this.physicsBody.update();
    this.position.set(this.physicsBody.x, this.physicsBody.y);
  }
}
