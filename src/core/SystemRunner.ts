import Game from '../scenes/Game';

export interface System {
  game?: Game;

  /** Method called when the system is initialized. Called only once when the system is instantiated. */
  init?: () => void;

  /** Method called when the system's game logic starts. Called every time the game is started. */
  start?: () => void;

  /** Method called every time the game updates, with the delta time passed as argument. Called multiple times during gameplay. */
  update?: (delta: number) => void;

  /** Method called when the system's game logic needs to end. Called every time the game has ended. */
  end?: () => void;
}

/** Define a class that describes a system. */
interface SystemClass<SYSTEM extends System = System> {
  /** A unique identifier for the system. */
  SYSTEM_ID: string;
  /** A constructor to create an instance of the system. */
  new (): SYSTEM;
}

export class SystemRunner {
  private readonly game: Game;

  public readonly systems: Map<string, System> = new Map();

  constructor(game: Game) {
    this.game = game;
  }

  public addSystem<S extends System>(Class: SystemClass<S>): S {
    const name = Class.SYSTEM_ID;

    // Check if the system has a name and throw an error if it doesn't
    if (!name)
      throw new Error('[SystemManager]: cannot add System without name');

    // If the system has already been added, return the existing instance
    if (this.systems.has(name)) {
      return this.systems.get(name) as S;
    }

    // Create a new instance of the system
    const system = new Class();

    // Set the game property of the system to the SystemRunner's game
    system.game = this.game;

    // Add the system to the SystemRunner's systems map
    this.systems.set(Class.SYSTEM_ID, system);

    // Return the new instance of the system
    return system;
  }

  /**
   * Get an instance of a system from the SystemRunner.
   * @param Class - a class that describes the system to get.
   * @returns the instance of the system requested.
   */
  public get<S extends System>(Class: SystemClass<S>): S {
    return this.systems.get(Class.SYSTEM_ID) as S;
  }

  /**
   * Calls the `init` method of all registered systems
   */
  public init() {
    this.systems.forEach((system) => system.init?.());
  }

  /**
   * Calls the `start` method of all registered systems
   */
  public start() {
    this.systems.forEach((system) => system.start?.());
  }

  /**
   * Calls the `update` method of all registered systems
   * @param delta - The time elapsed since the last update.
   */
  public update(delta: number) {
    this.systems.forEach((system) => system.update?.(delta));
  }
}
