import { Container } from 'pixi.js';
import { PhysicsBody } from './PhysicsBody';

export class Fan extends Container {
  public physicsBody: PhysicsBody;

  constructor() {
    super();
    this.physicsBody = new PhysicsBody(this);
  }


  update() {
  }

}
