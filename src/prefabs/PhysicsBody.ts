import { Container } from 'pixi.js';
import { Vector2 } from '../utils/maths/Vector2';
import { Directions } from './Minion';

export enum PhysicsState {
  /** Not affected by forces and stays in the same position unless manually moved */
  STATIC,
  /** Affected by forces and changes its position */
  DYNAMIC,
  /** Affected by forces but with a pre-defined motion */
  KINEMATIC,
}

export class PhysicsBody {
  public static GRAVITY = 9.8 * (1 / 60);

  public UID = 0;

  public readonly mass = -1;

  /** Current position of the body. */
  public position = new Vector2();
  /** Current velocity of the body, used to apply constant force in a given direction. */
  public velocity = new Vector2();

  /** Current force applied to the body. This data is stored for easy data assignment on added force. */
  private readonly force = new Vector2();
  /** Current physics state of the body. */
  private state: PhysicsState = PhysicsState.STATIC;

  private entity: Container;

  constructor(entity: Container) {
    this.entity = entity;
  }

  /**
   * Applies a force to the body.
   * @param forceX X component of the force.
   * @param forceY Y component of the force.
   */
  public applyForce(forceX: number, forceY: number) {
    // Only apply force if not a static object
    if (this.state !== PhysicsState.STATIC) {
      // Set force to force object, prevents need for creating new vector each time
      this.force.set(forceX, forceY);
      // Add force divided by mass to velocity
      this.velocity.add(this.force.divideScalar(this.mass));
    }
  }

  /** Sets the velocity of the body to zero. */
  public zeroVelocity() {
    this.force.setScalar(0);
    this.velocity.setScalar(0);
  }

  /** Resets the physics body to its initial state. */
  public reset() {
    this.force.set(0, 0);
    this.position.set(0, 0);
    this.velocity.set(0, 0);
    this.state = PhysicsState.STATIC;
  }

  public update() {
    const groundCollision = this.checkGroundCollision();
    if (this.state === PhysicsState.DYNAMIC && !groundCollision) {
      // apply gravity
      this.applyForce(0, PhysicsBody.GRAVITY * this.mass);
    }

    // update position based on velocity
    this.position.add(this.velocity);

    if (this.checkOutOfBounds()) {
      this.velocity.x *= -1;
    }

    if (groundCollision && this.velocity.y > 0) {
      this.velocity.y = 0;
    }
  }

  public setState(value: number) {
    // If the body is set to static, nullify constant forces
    if (value === PhysicsState.STATIC) {
      this.zeroVelocity();
    }
    this.state = value;
  }

  public get x() {
    return this.position.x;
  }

  public get y(): number {
    return this.position.y;
  }

  checkOutOfBounds = (): boolean => {
    const direction = this.velocity.x > 0 ? Directions.RIGHT : Directions.LEFT;
    const boundary =
      direction === Directions.LEFT ? 0 : window.innerWidth - this.entity.width;
    if (
      (direction === Directions.LEFT && this.x <= boundary) ||
      (direction === Directions.RIGHT && this.x >= boundary)
    ) {
      return true;
    }
    return false;
  };

  checkGroundCollision = (): boolean => {
    const groundHeight = 50;
    const boundary = window.innerHeight - this.entity.height - groundHeight;
    if (this.y >= boundary) {
      return true;
    }
    return false;
  };
}
