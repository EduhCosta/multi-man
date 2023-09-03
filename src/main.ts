import SceneManager from './core/SceneManager';
import './style.css';

export const sceneManager = new SceneManager();
await sceneManager.switchScene('Loading');
await sceneManager.switchScene('MainMenu');
