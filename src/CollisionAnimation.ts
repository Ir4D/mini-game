import type Game from "./Game";

export class CollisionAnimation {
  game: Game;
  image: HTMLImageElement;
  spriteWidth: number; 
  spriteHeight: number; 
  sizeModifier: number; 
  width: number; 
  height: number; 
  positionX: number; 
  positionY: number;
  frameX: number;
  maxFrame: number;
  markedForDeletion: boolean;
  fps: number;
  frameInterval: number;
  frameTimer: number;

  constructor(game: Game, positionX: number, positionY: number) {
    this.game = game;
    this.image = document.getElementById("collisionAnimation") as HTMLImageElement;
    this.spriteWidth = 100;
    this.spriteHeight = 90;
    this.sizeModifier = Math.random() + 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.positionX = positionX - this.width * 0.5;
    this.positionY = positionY - this.height * 0.5;
    this.frameX = 0;
    this.maxFrame = 4;
    this.markedForDeletion = false;
    this.fps = Math.random() * 10 + 5;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.positionX, this.positionY, this.width, this.height);
  }

  update(deltaTime: number): void {
    this.positionX -= this.game.speed;
    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    if (this.frameX > this.maxFrame) this.markedForDeletion = true;
  }
}