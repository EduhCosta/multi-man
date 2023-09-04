import Scene from '../core/Scene';
import SpritesheetAnimation from '../core/SpritesheetAnimation';
import { SoundManager } from '../prefabs/SoundManager';
import { Container, Graphics, Sprite } from 'pixi.js';
import { AnimState } from '../types/MinionAnimation';
import { centerObjects } from '../utils/misc';
import { SpriteButton } from '../prefabs/SpriteButton';
import { sceneManager } from '../main';

export default class WinGame extends Scene {
  name: string = 'WinGame';

  private anim!: SpritesheetAnimation;
  private graph!: Graphics;
  private bg!: Sprite;
  private currentState: AnimState | null = null;

  static animStates: Record<string, AnimState> = {
    default: {
      anim: 'FOUNDTHEGOLD',
      loop: false,
      speed: 0.3,
    },
  };

  async load() {
    SoundManager.getInstance().play('Game/sound/menu.mp3');

    this.graph = new Graphics();
    this.bg = Sprite.from('Game/images/bg.png');
    this.bg.width = window.innerWidth;
    this.bg.height = window.innerHeight;
    this.bg.anchor.set(0);

    this.graph.addChild(this.bg);
  }

  async start() {
    // We should load all scene assets here
    await this.utils.assetLoader.loadAssetsGroup('Game');

    // SpriteButton
    const ct = new Container();
    const nextLevel = new SpriteButton('Continue', this.nextLevel.bind(this)).element;
    ct.addChild(nextLevel);
    centerObjects(ct);
    ct.y = 700;

    // Animation
    this.anim = new SpritesheetAnimation('foundGold');
    this.currentState = WinGame.animStates.default;
    this.anim.play(WinGame.animStates.default);
    centerObjects(this.anim);
    this.anim.scale.set(-1, 1);
    this.anim.position.x = window.innerWidth / 2 + 200;
    this.anim.position.y = 100;

    // Add elements to screen
    this.addChild(this.graph);
    this.addChild(this.anim);
    this.addChild(ct);
  }

  nextLevel(): void | Promise<void> {
    const nextLevel = window.localStorage.getItem('@multi-man/next-level');
    sceneManager.switchScene(nextLevel as string);
  }
}
