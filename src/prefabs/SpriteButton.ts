import { Container, Sprite, Text } from 'pixi.js';
import { defaultFont } from '../utils/contants';

export class SpriteButton extends Container {
  private sprite!: Sprite;
  private title!: Text;
  private onClick!: () => void;
  public element!: Container;

  constructor(label: string, event: () => void) {
    super();
    // Initialization
    this.onClick = event;
    this.sprite = Sprite.from('MainMenu/images/b_2.png');
    this.title = new Text(label, defaultFont);

    // Setup
    this.setup();
  }

  setup() {
    const container = new Container();
    
    this.title.resolution = 2;
    this.title.anchor.set(0.5, 0.6);

    this.sprite.width = 150;
    this.sprite.height = 60;
    this.sprite.anchor.set(0.5);
    
    // Opt-in to interactivity
    this.sprite.eventMode = 'static';

    // Shows hand cursor
    this.sprite.cursor = 'pointer';

    // Pointers normalize touch and mouse (good for mobile and desktop)
    this.sprite.on('pointerdown', this.onClick);

    // Adds a sprite as a child to this container. As a result, the sprite will be rendered whenever the container
    // is rendered.
    container.addChild(this.sprite);
    container.addChild(this.title);

    this.element = container;
  }
}
