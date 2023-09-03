import { Vector2 } from 'pixi-spine';
import { Container, Sprite, Texture } from 'pixi.js';
import { minionMap } from '../store';
import { DefaultMinion } from './DefaultMinion';
import { FatMinion } from './FatMinion';
import { MinionType } from './Minion';
import { ThinMinion } from './ThinMinion';

export class IconButton extends Container {
  public minionId: number;
  public icon: MinionType = 'default';
  public element!: Sprite;

  constructor(frame: Container, position: Vector2, minionId: number) {
    super();
    const ct = new Container();
    this.minionId = minionId;

    this.element = Sprite.from('Game/images/default.png');
    this.element.anchor.set(0.5, 1);
    this.element.width = 100;
    this.element.height = 100;
    this.element.x = position.x;
    this.element.y = position.y;
    this.element.eventMode = 'static';
    this.element.cursor = 'pointer';
    this.element.on('pointerdown', () => this.updateMinion());

    ct.addChild(this.element);
    frame.addChild(ct);
  }

  updateMinion() {
    const minion = minionMap.get().get(this.minionId);
    if (!minion) {
      console.error(`Minion ${this.minionId} not found!`);
      return;
    }
    this.updateIcon();

    console.log(`Switching minion ${this.minionId} to ${this.icon}`);
    if (this.icon === 'fat') {
      minion.setVariation(new FatMinion());
    } else if (this.icon === 'thin') {
      minion.setVariation(new ThinMinion());
    } else {
      minion.setVariation(new DefaultMinion());
    }
  }

  updateIcon = () => {
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
