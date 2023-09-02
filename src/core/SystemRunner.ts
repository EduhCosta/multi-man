export interface System<S> {
  game?: S;

  /** Method called when the system is initialized. Called only once when the system is instantiated. */
  init?: () => void;

  /** Method called when the system's game logic starts. Called every time the game is started. */
  start?: () => void;

  /** Method called every time the game updates, with the delta time passed as argument. Called multiple times during gameplay. */
  update?: (delta: number) => void;

  /** Method called when the system's game logic needs to end. Called every time the game has ended. */
  end?: () => void;
}


export class SystemRunner {
  
}