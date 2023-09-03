import { Container, Sprite } from 'pixi.js';

export default class Background extends Container {
  name = 'Background';

  constructor() {
    super();

    // Setting sprite
    const sprite = Sprite.from('Game/images/bg.png');
    sprite.zIndex = -1;
    sprite.width = window.innerWidth;
    sprite.height = window.innerHeight;
    // sprite.anchor.set(0.3);
    sprite.anchor.set(0);

    this.addChild(sprite);
  }
}
