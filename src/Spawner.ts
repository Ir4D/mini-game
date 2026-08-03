import type Game from "./Game";
import { FlyingEnemy, StandingEnemy } from "./Enemies";
import { Breadcrumb } from "./Collectible";

export class Spawner {
  private readonly game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  spawnEnemy(): void {
    if (this.game.speed > 0 && Math.random() < 0.5) {
      this.game.enemies.push(new StandingEnemy(this.game));
    }

    if (this.game.enemies.length <= this.game.maxEnemies) {
      this.game.enemies.push(new FlyingEnemy(this.game));
    }
  }

  spawnCollectible(): void {
    if (this.game.speed > 0 && Math.random() < 0.5) {
      this.game.collectibles.push(new Breadcrumb(this.game));
    }
  }
}
