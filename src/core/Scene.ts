import { Application, Container } from 'pixi.js';
import type { SceneUtils } from './SceneManager';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructorType<T> = new (...args: any[]) => T;

export interface IScene {
  /** Called before start the scene */
  load?(): void | Promise<void>;
  /** Called whent the 'removeScene' is triggered */
  unload?(): void | Promise<void>;
  /** Called after loading the scene */
  start?(): void | Promise<void>;
  /** Called always the navigator changes the screen size */
  onResize?(width: number, height: number): void;
  /** It's the game-loop event */
  update?(delta: number): void;
}

export abstract class Scene extends Container implements IScene {
  abstract name: string;
  app: Application;
  constructor(app: Application, protected utils: SceneUtils) {
    super();
    this.app = app;
  }

  abstract load(): void | Promise<void>;
  abstract unload(): void | Promise<void>;
  abstract start(): void | Promise<void>;
  abstract onResize(width: number, height: number): void;
  abstract update(delta: number): void;
}

export default Scene;
