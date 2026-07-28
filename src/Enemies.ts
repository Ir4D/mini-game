import type Game from "./Game";

export abstract class Enemy {
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  markedForDeletion: boolean;
  protected readonly game: Game;
  abstract readonly width: number;
  abstract readonly height: number;
  abstract positionX: number;
  abstract positionY: number;
  abstract speedX: number;
  abstract speedY: number;
  abstract readonly maxFrame: number;
  abstract readonly image: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }

  update(deltaTime: number) {
    // movement
    this.positionX -= this.speedX + this.game.speed;
    this.positionY += this.speedY;
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

  draw(context: CanvasRenderingContext2D) {
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.positionX, this.positionY, this.width, this.height);
  }
}

export class FlyingEnemy extends Enemy {
  readonly width: number = 89;
  readonly height: number = 73;

  positionX: number;
  positionY: number;
  speedX: number;
  speedY: number;
  maxFrame: number;
  image: HTMLImageElement;
  angle: number;
  velocityAngle: number;

  constructor(game: Game) {
    super(game);
    this.positionX = this.game.width + Math.random() * this.game.width * 0.5;
    this.positionY = Math.random() * this.game.height * 0.5;
    this.speedX = Math.random() - 1;
    this.speedY = 0;
    this.maxFrame = 5;
    this.image = document.getElementById("enemy_fly") as HTMLImageElement;
    this.angle = 0;
    this.velocityAngle = Math.random() * 0.1 + 0.1;
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    this.angle += this.velocityAngle;
    this.positionY += Math.sin(this.angle);
  }
}

export class StandingEnemy extends Enemy {
  readonly width: number = 160;
  readonly height: number = 80;

  positionX: number;
  positionY: number;
  speedX: number;
  speedY: number;
  maxFrame: number;
  image: HTMLImageElement;

  constructor(game: Game) {
    super(game);
    this.positionX = this.game.width;
    this.positionY = this.game.height - this.height - this.game.groundLevel - 10;
    this.speedX = 0;
    this.speedY = 0;
    this.maxFrame = 1;
    this.image = document.getElementById("enemy_stand") as HTMLImageElement;
  }
}
