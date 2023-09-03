import { Vector2 } from 'pixi-spine';
import { Color, Container, Graphics } from 'pixi.js';
import { centerObjects } from '../utils/misc';

export class Panel extends Container {
  frame!: Graphics;
  private dimensions!: Vector2;
  private padding: number = 30; 

  constructor(size: Vector2, color: Color) {
    super();
    this.frame = new Graphics();
    this.setup(size, color);
    
    // Save values
    this.dimensions = size;
  }

  private setup(size: Vector2, color: Color) {
    this.frame.beginFill(color);
    this.frame.drawRect(0, 0, size.x, size.y);
    this.centralize();
  }

  /**
   * Centralize the frame at the screen
   */
  public centralize() {
    centerObjects(this.frame);
    this.updatePosition(new Vector2(-this.frame.width / 2, -this.frame.height / 2));
    this.centralizeChildren();
  }

  /**
   * Centralize children on vertical center
   */
  public centralizeChildren() {
    let prevSize = this.padding + 30;

    this.frame.children.forEach(obj => {
      obj.x = this.dimensions.x / 2; 
      obj.y = prevSize;

      if (obj instanceof Container) prevSize += this.padding + obj.height;
      else prevSize += this.padding;
    });
  }

  /**
   * Update position of created panel
   * @param newPosition Vector2
   */
  public updatePosition(newPosition: Vector2): void {
    this.frame.position.set(
      this.frame.position.x + newPosition.x, 
      this.frame.position.y + newPosition.y
    );
  }

  /**
   * Add a new element as child of container
   * @param element any
   */
  public append(element: any) {
    this.frame.addChild(element);
    this.centralize();
  }
}
