import { Vector2 } from 'pixi-spine';
import { Container } from 'pixi.js';
import { SpriteButton } from './SpriteButton';
import { sceneManager } from '../main';
import { IconButton } from './IconButton';
import { Minion } from './Minion';

export class HUD extends Container {
  frame!: Container;
  private dimensions!: Vector2;
  private minionsQuantity!: number;
  public buttons: IconButton[] = [];

  active = 'default';

  constructor(size: Vector2, minionsQuantity: number) {
    super();
    this.frame = new Container();
    this.dimensions = size;
    this.minionsQuantity = minionsQuantity;

    this.setup();
  }

  setup() {
    this.frame.width = this.dimensions.x;
    this.frame.height = this.dimensions.y;

    const startButton = new SpriteButton('Exit', this.exitGame).element;
    startButton.x = 100;
    startButton.y = 60;
    this.frame.addChild(startButton);

    this.createMinionButton();
  }

  /** ########### Game events ############## */

  createMinionButton() {
    const posY = this.dimensions.y - 130;
    for (let i = 0; i < this.minionsQuantity; i++) {
      this.buttons.push(
        new IconButton(this.frame, new Vector2(100 + i * 120, posY), Minion.UID - i),
      );
    }
  }

  exitGame() {
    sceneManager.switchScene('MainMenu');
  }
}
