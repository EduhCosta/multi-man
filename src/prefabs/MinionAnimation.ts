import { Container } from 'pixi.js';
import SpritesheetAnimation from '../core/SpritesheetAnimation';
import { AnimState } from '../types/MinionAnimation';

export class MinionAnimation extends Container {
  anim!: SpritesheetAnimation;
  currentState: AnimState | null = null;
  
  static animStates: Record<string, AnimState> = {
    idle: {
      anim: 'idle',
      loop: true, 
      speed: 0.41, 
    },
    walk: {
      anim: 'walk',
      loop: true, 
      speed: 0.41, 
    },
    dead: {
      anim: 'dead',
      loop: true, 
      speed: 0.41, 
    },
    floating: {
      anim: 'floating',
      loop: true, 
      speed: 0.41, 
    },
  };

  state = { // Initial state
    idle: true,
    walk: false,
    floating: false,
    dead: false,
    velocity: {
      x: 0,
      y: 0,
    },
  };
  
  constructor(minionName: string) {
    super();

    this.anim = new SpritesheetAnimation(minionName);
    this.addChild(this.anim);
    this.setState(MinionAnimation.animStates.idle);
  }

  setState(state: AnimState) {
    this.currentState = state;

    return this.anim.play(state);
  }
}
