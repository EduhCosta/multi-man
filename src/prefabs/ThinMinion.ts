import { Minion, MinionVariation } from './Minion';
import { Graphics, Rectangle } from 'pixi.js';
import { MinionAnimation } from './MinionAnimation';

export class ThinMinion implements MinionVariation {
  type = 'thin' as const;
  WIDTH_PX = 100;
  HEIGHT_PX = 200;
  gravityScale = .9;
  speed = 5;
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

  runAnimation(): MinionAnimation {
    const defaultAnimation: MinionAnimation = new MinionAnimation('thin');
    defaultAnimation.setState(MinionAnimation.animStates.walk);
    return defaultAnimation;
  }
}
