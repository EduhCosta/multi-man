export type Config = {
  minionCount: number;
  gravity: {
    x: number;
    y: number;
  };
  debug: boolean;
};

export default {
  minionCount: 5,
  gravity: {
    x: 0,
    y: -9.81,
  },
  debug: true,
} as Config;
