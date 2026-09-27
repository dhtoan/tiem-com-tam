import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { StallScene } from "./scenes/StallScene";

export function createGame(parent: HTMLElement | string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: "#2b1810",
    scene: [BootScene, StallScene],
  };

  return new Phaser.Game(config);
}
