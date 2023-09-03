import { Container, Graphics, Rectangle } from 'pixi.js';
import { Toggleable } from './types';

export class Button extends Container {
  static WIDTH_PX = 100;
  static HEIGHT_PX = 100;
  toggleableEntity?: Toggleable;
  state = {
    enabled: true,
  };

  constructor(position: { x: number; y: number }, t: Toggleable) {
    super();
    // temporary mask
    const mask = this.drawMask();
    mask.onclick = () => this.onClick();
    this.addChild(mask);

    this.toggleableEntity = t;

    this.position.x = position.x;
    this.position.y = window.innerHeight - position.y;
  }

  drawMask() {
    // temporary mask
    const mask = new Graphics();
    mask.beginFill(0x00ff00);
    mask.drawRect(0, 0, Button.WIDTH_PX, Button.HEIGHT_PX);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new Rectangle(0, 0, Button.WIDTH_PX, Button.HEIGHT_PX);
    mask.drawRect(0, 0, 200, 200);
    return mask;
  }

  setEntity(entity: Toggleable) {
    this.toggleableEntity = entity;
  }

  onClick() {
    if (!this.toggleableEntity) {
      return;
    }
    if (this.toggleableEntity.state.enabled) {
      this.toggleableEntity.disable();
    } else {
      this.toggleableEntity.enable();
    }
  }
}
