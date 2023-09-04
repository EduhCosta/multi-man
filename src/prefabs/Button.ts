import { Container, Graphics, Rectangle, Sprite } from 'pixi.js';
import { Toggleable } from './types';

export class Button extends Container {
  static WIDTH_PX = 100;
  static HEIGHT_PX = 30;
  toggleableEntity?: Toggleable;
  state = {
    enabled: true,
  };

  debugMask: Graphics;

  button: Sprite;
  buttonPressed: Sprite;

  constructor(position: { x: number; y: number }, t: Toggleable) {
    super();
    // temporary mask
    this.debugMask = this.drawMask();
    this.debugMask.onclick = () => this.onClick();
    this.addChild(this.debugMask);

    this.toggleableEntity = t;

    this.button = Sprite.from('Game/images/button.png');
    this.button.anchor.set(0);
    this.addChild(this.button);

    this.buttonPressed = Sprite.from('Game/images/buttonPressed.png');
    this.buttonPressed.anchor.set(0);
    this.buttonPressed.visible = false;
    this.buttonPressed.position.y += 10;
    this.addChild(this.buttonPressed);

    this.position.x = position.x;
    this.position.y = window.innerHeight - position.y;
  }

  drawMask() {
    // temporary mask
    const mask = new Graphics();
    const color = this.toggleableEntity?.state.enabled ? 0x00ff00 : 0xff0000;
    // mask.beginFill(color);
    mask.drawRect(0, 0, Button.WIDTH_PX, Button.HEIGHT_PX);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new Rectangle(0, 0, Button.WIDTH_PX, 2 * Button.HEIGHT_PX);
    mask.drawRect(0, 0, 200, 200);
    // mask.visible = false;
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
      this.buttonPressed.visible = false;
      this.button.visible = true;
    } else {
      this.toggleableEntity.enable();
      this.buttonPressed.visible = true;
      this.button.visible = false;
    }

    // this.removeChild(this.debugMask);
    // this.debugMask = this.drawMask();
    // this.addChild(this.debugMask);
  }
}
