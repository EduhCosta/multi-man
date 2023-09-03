export interface AnimState {
  /** Animation key on the json file */
  anim: string;
  soundName?: string;
  /** Self explained */
  loop?: boolean;
  /** 0.41 means 24 frames per second */
  speed?: number;
}
