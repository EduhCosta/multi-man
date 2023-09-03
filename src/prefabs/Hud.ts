import { Vector2 } from 'pixi-spine';
import { Container } from 'pixi.js';
import { SpriteButton } from './SpriteButton';
import { IconButton } from './IconButton';
import { Minion } from './Minion';
import { minionMap } from '../store';

export class HUD extends Container {
  frame!: Container;
  private dimensions!: Vector2;
  private minionsQuantity!: number;
  public buttons: IconButton[] = [];

  active = 'default';

  // Callbacks
  private onNextLevelCallback!: () => void;
  private onExitCallback!: () => void;

  private startMinionId: number;

  constructor(
    size: Vector2,
    minionsQuantity: number,
    onNextLevel: () => void,
    onExit: () => void,
    startMinionId: number,
  ) {
    super();
    this.frame = new Container();
    this.dimensions = size;
    this.minionsQuantity = minionsQuantity;

    this.onNextLevelCallback = onNextLevel;
    this.onExitCallback = onExit;

    this.startMinionId = startMinionId;
    this.setup();
  }

  setup() {
    this.frame.width = this.dimensions.x;
    this.frame.height = this.dimensions.y;

    const startButton = new SpriteButton('Exit', this.onExitCallback).element;
    startButton.x = 100;
    startButton.y = 60;
    this.frame.addChild(startButton);

    const nextLevel = new SpriteButton('Next level', this.onNextLevelCallback)
      .element;
    nextLevel.x = 1920 - 100;
    nextLevel.y = 60;
    this.frame.addChild(nextLevel);

    this.createMinionButtons();
  }

  /** ########### Game events ############## */

  createMinionButtons() {
    const posY = this.dimensions.y - 130;
    for (let i = 0; i < this.minionsQuantity; i++) {
      this.buttons.push(
        new IconButton(
          this.frame,
          new Vector2(100 + i * 120, posY),
          this.startMinionId + i,
        ),
      );
    }
  }
}
