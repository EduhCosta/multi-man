

export interface Toggleable {
  state: {
    enabled: boolean;
  };
  enable(): void;
  disable(): void;
}