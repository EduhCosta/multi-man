import { Minion, MinionVariation } from './Minion';
import { Graphics, Rectangle } from 'pixi.js';

export class FatMinion implements MinionVariation {
  type = 'fat' as const;
  WIDTH_PX = 100;
  HEIGHT_PX = 200;
  gravityScale = 10;
  speed = 2;
  turnDuration = 0.2;
  decelerateDuration = 0.15;
  scale = 2;
  drawMask() {
    // temporary mask
    const mask = new Graphics();
    mask.beginFill(0xff0000);
    mask.drawRect(0, 0, this.WIDTH_PX, Minion.HEIGHT_PX);
    mask.endFill();
    mask.interactive = true;
    mask.hitArea = new Rectangle(0, 0, this.WIDTH_PX, Minion.HEIGHT_PX);
    mask.drawRect(0, 0, 200, 200);
    return mask;
  }
  customBehavior() {
    console.log('Fat behavior');
  }
}
