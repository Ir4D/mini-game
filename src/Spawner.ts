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
    if (this.game.speed <= 0  || Math.random() > 0.5) return;

    const breadcrumb = new Breadcrumb(this.game);

    for (let attempt = 0; attempt < 5; attempt++) {
      const overlapsStandingEnemy = this.game.enemies.some((enemy) => 
        enemy instanceof StandingEnemy && this.game.isColliding(breadcrumb, enemy),
      );

      if (!overlapsStandingEnemy) {
        this.game.collectibles.push(breadcrumb);
        return;
      }

      breadcrumb.positionY = Math.random() * (this.game.ground - breadcrumb.height);
    }
  }
}
