import { Vector2 } from 'pixi-spine';
import { Container, Sprite, Texture } from 'pixi.js';

export class IconButton extends Container {
  public icon = 'default';
  public element!: Sprite;

  constructor(frame: Container, position: Vector2) {
    super();
    const ct = new Container();

    this.element = Sprite.from('Game/images/default.png');
    this.element.anchor.set(0.5, 1);
    this.element.width = 100;
    this.element.height = 100;
    this.element.x = position.x;
    this.element.y = position.y;
    this.element.eventMode = 'static';
    this.element.cursor = 'pointer';
    this.element.on('pointerdown', () => this.random());

    ct.addChild(this.element);
    frame.addChild(ct);
  }

  random = () => {
    if (this.icon === 'default') {
      this.element.texture = Texture.from('Game/images/fat.png');
      this.icon = 'fat';
      return;
    }

    if (this.icon === 'fat') { 
      this.element.texture = Texture.from('Game/images/thin.png');
      this.icon = 'thin';
      return;
    }

    if (this.icon === 'thin') {
      this.element.texture = Texture.from('Game/images/default.png');
      this.icon = 'default';
      return;
    }
  };
}
