import { atom } from 'nanostores';
import { Minion } from './prefabs/Minion';
import { HUD } from './prefabs/Hud';

export const minionMap = atom<Map<number, Minion>>(new Map());

export type Entity = {
  id: number;
  type: string;
}

export const colliderToEntity = atom<Map<number, Entity>>(new Map());

export const hudStore = atom<HUD | null>(null);


export const gameSceneState = atom(null);
