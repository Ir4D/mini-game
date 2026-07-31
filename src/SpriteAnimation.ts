import type Game from "./Game";

export class SpriteAnimation {
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

  constructor(
    game: Game,
    imageId: string,
    spriteWidth: number,
    spriteHeight: number,
    maxFrame: number,
    positionX: number,
    positionY: number,
    sizeModifier?: number
  ) {
    this.game = game;
    this.image = document.getElementById(imageId) as HTMLImageElement;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.sizeModifier = typeof sizeModifier === 'number' ? sizeModifier : Math.random() + 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.positionX = positionX - this.width * 0.5;
    this.positionY = positionY - this.height * 0.5;
    this.frameX = 0;
    this.maxFrame = maxFrame;
    this.markedForDeletion = false;
    this.fps = 15;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.positionX,
      this.positionY,
      this.width,
      this.height
    );
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
}

export class CollisionAnimation extends SpriteAnimation {
  constructor(game: Game, positionX: number, positionY: number) {
    super(game, 'collisionAnimation', 100, 90, 4, positionX, positionY);
  }
}

export class RemovalAnimation extends SpriteAnimation {
  constructor(game: Game, positionX: number, positionY: number) {
    super(game, 'steam', 64, 46, 8, positionX, positionY, 2);
  }
}

export class CollectionAnimation extends SpriteAnimation {
  constructor(game: Game, positionX: number, positionY: number) {
    super(game, 'stars', 64, 65, 7, positionX, positionY, 1);
  }
}