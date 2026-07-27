import type Game from "./Game";

export default class Player {
  private readonly game: Game;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  velocityY: number;
  weight: number;
  image: HTMLImageElement;
  speed: number;
  maxSpeed: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 64;
    this.height = 85;
    this.positionX = 0;
    this.positionY = this.game.height - this.height;
    this.velocityY = 0;
    this.weight = 0.4;
    this.image = document.getElementById("player") as HTMLImageElement;
    this.speed = 0;
    this.maxSpeed = 4;
  }

  update(input: string[]): void {
    // horizontal movement
    this.positionX += this.speed;
    if (input.includes('ArrowRight'))this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
    else this.speed = 0;
    if (this.positionX < 0) this.positionX = 0;
    if (this.positionX > this.game.width - this.width) this.positionX = this.game.width - this.width;

    // vertical movement
    if (input.includes('ArrowUp') && this.onGround()) this.velocityY -= 15;
    this.positionY += this.velocityY;
    if (!this.onGround()) this.velocityY += this.weight;
    else this.velocityY = 0;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, 0, 0, this.width, this.height, this.positionX, this.positionY, this.width, this.height);
  }

  onGround(): Boolean {
    return this.positionY >= this.game.height - this.height;
  }
}