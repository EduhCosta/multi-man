import { System } from '../core/SystemRunner';
import { PhysicsBody, PhysicsState } from '../prefabs/PhysicsBody';
import Game from '../scenes/Game';

export class PhysicsSystem implements System {
  public static readonly SYSTEM_ID = 'PhysicsSystem';
  /**
   * The instance of the game the system is attached to.
   * This is automatically set by the system runner when the system is added to the game.
   */
  public game!: Game;

  /** The map containing all PhysicsBodies in the game, mapped by their unique IDs*/
  private readonly bodyMap = new Map<number, PhysicsBody>();

  /**
   * Called every frame.
   * The update method updates the position of all bodies based on their state
   * and checks for out of bounds or shot connect conditions.
   */
  public update() {
    // update position of all bodies based on their state
    this.bodyMap.forEach((body) => {
      const groundCollision = body.checkGroundCollision();
      console.log(groundCollision);
      
      if (body.getState() === PhysicsState.DYNAMIC && !groundCollision) {
        // apply gravity
        body.applyForce(0, PhysicsBody.GRAVITY * body.mass);
      }
      // update position based on velocity
      body.position.add(body.velocity);

      if (body.checkOutOfBounds()) {
        body.velocity.x *= -1;
      }

      if (groundCollision && body.velocity.y > 0) {
        body.velocity.y = 0;
      }
    });
  }

  /**
   * Adds a `PhysicsBody` to the bodyMap.
   * @param body - The PhysicsBody to add.
   */
  public addBody(body: PhysicsBody) {
    if (this.bodyMap.get(body.UID)) return;
    this.bodyMap.set(body.UID, body);
  }

  /**
   * Removes a `PhysicsBody` from the bodyMap.
   * @param body - The PhysicsBody to remove.
   */
  public removeBody(body: PhysicsBody) {
    this.bodyMap.delete(body.UID);
  }
}
