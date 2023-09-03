import { Minion, MinionVariation } from './Minion';
import { Graphics } from 'pixi.js';
import * as PIXI from 'pixi.js';

export class DefaultMinion implements MinionVariation {
  type = 'default' as const;
  WIDTH_PX = 50;
  HEIGHT_PX = 200;
  gravityScale = 1;
  speed = 5;
  turnDuration = 0.15;
  decelerateDuration = 0.1;
  scale = 1;
  customBehavior() {
    console.log('Basic behavior');
  }
  drawMask() {
    // temporary mask
    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, this.WIDTH_PX, Minion.HEIGHT_PX);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new PIXI.Rectangle(0, 0, this.WIDTH_PX, Minion.HEIGHT_PX);
    mask.drawRect(0, 0, 200, 200);
    return mask;
  }
}
