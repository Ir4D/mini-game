import type Game from "./Game";

export class Attack {
  game: Game;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  frameX: number;
  maxFrame: number;
  image: HTMLImageElement;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  markedForDeletion: boolean;

  constructor(game: Game) {
    this.game = game;
    this.image = document.getElementById("attack") as HTMLImageElement;
    this.width = 64;
    this.height = 33;
    this.positionX = this.game.player.positionX + this.game.player.width * 1.1;
    this.positionY = this.game.player.positionY + this.game.player.height * 0.5 - this.height * 0.5;
    this.frameX = 0;
    this.maxFrame = 8;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }

  update(deltaTime: number): void {
    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    if (this.frameX > this.maxFrame) this.markedForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.positionX, this.positionY, this.width, this.height);
  }
}