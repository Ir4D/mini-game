import type Game from "./Game";

export abstract class Particle {
  game: Game;
  markedForDeletion: boolean;
  abstract positionX: number;
  abstract positionY: number;
  abstract speedX: number;
  abstract speedY: number;
  abstract size: number;

  constructor(game: Game) {
    this.game = game;
    this.markedForDeletion = false;
  }

  update(): void {
    this.positionX -= this.speedX + this.game.speed;
    this.positionY -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDeletion = true;
  }

  abstract draw(context: CanvasRenderingContext2D): void;
}

export class Dust extends Particle {
  positionX: number;
  positionY: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(game: Game, positionX: number, positionY: number) {
    super(game);
    this.size = Math.random() * 10 + 10;
    this.positionX = positionX;
    this.positionY = positionY;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = 'rgba(66, 66, 66, 0.2)';
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.arc(this.positionX, this.positionY, this.size, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}

export class Splash extends Particle{
  positionX: number;
  positionY: number;
  size: number;
  speedX: number;
  speedY: number;
  image: HTMLImageElement;
  gravity: number;

  constructor(game: Game, positionX: number, positionY: number) {
    super(game);
    this.size = Math.random() * 100 + 100;
    this.positionX = positionX - this.size * 0.4;
    this.positionY = positionY - this.size * 0.5;
    this.speedX = Math.random() * 6 - 4;
    this.speedY = Math.random() * 2 + 2;
    this.gravity = 0;
    this.image = document.getElementById("fire") as HTMLImageElement;
  }

  update(): void {
    super.update();
    this.gravity += 0.1;
    this.positionY += this.gravity;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.positionX, this.positionY, this.size, this.size);
  }
}

export class Fire extends Particle {
  positionX: number;
  positionY: number;
  size: number;
  speedX: number;
  speedY: number;
  image: HTMLImageElement;
  angle: number;
  velocityAngle: number;

  constructor(game: Game, positionX: number, positionY: number) {
    super(game);
    this.image = document.getElementById("fire") as HTMLImageElement;
    this.size = Math.random() * 100 + 50;
    this.positionX = positionX;
    this.positionY = positionY;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.velocityAngle = Math.random() * 0.2 - 0.1;
  }

  update(): void {
    super.update();
    this.angle += this.velocityAngle;
    this.positionX += Math.sin(this.angle * 10);
  }

  draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.positionX, this.positionY);
    context.rotate(this.angle);
    context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
    context.restore();
  }
}
