import Game from "./Game";

export abstract class Collectible {
  game: Game;
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  markedForDeletion: boolean;
  abstract readonly width: number;
  abstract readonly height: number;
  abstract positionX: number;
  abstract positionY: number;
  abstract readonly maxFrame: number;
  abstract readonly image: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 8;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }

  update(deltaTime: number): void {
    // movement
    this.positionX -= this.game.speed;
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    // check if off screen
    if (this.positionX + this.width < 0) this.markedForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.positionX, this.positionY, this.width, this.height);
  }
}

export class Breadcrumb extends Collectible {
  readonly width: number = 60;
  readonly height: number = 60;

  positionX: number;
  positionY: number;
  maxFrame: number;
  image: HTMLImageElement;

  constructor(game: Game) {
    super(game);
    this.positionX = this.game.width;
    this.positionY = Math.random() * (this.game.height - this.game.groundLevel - this.height);
    this.maxFrame = 0;
    this.image = document.getElementById("bread") as HTMLImageElement;
  }
}