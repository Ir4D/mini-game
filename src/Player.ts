import type Game from "./Game";
import {
  Falling,
  Jumping,
  Standing,
  Walking,
  Rolling,
  Hit,
  Attack,
  Distract,
} from "./PlayerStates";

export default class Player {
  private readonly game: Game;
  readonly width: number;
  readonly height: number;
  positionX: number;
  positionY: number;
  velocityY: number;
  readonly image: HTMLImageElement;
  frameX: number;
  frameY: number;
  maxFrame: number;
  readonly fps: number;
  readonly frameInterval: number;
  frameTimer: number;
  speed: number;
  readonly maxSpeed: number;
  readonly states: (
    Standing | Walking | Jumping | Falling | Rolling | Hit | Attack | Distract
  )[];
  currentState:
    Standing | Walking | Jumping | Falling | Rolling | Hit | Attack | Distract;
  jumpCount: number;
  readonly maxJumps: number;
  readonly jumpVelocity: number;
  jumpKeyJustPressed: boolean;
  private prevInput: string[];

  constructor(game: Game) {
    this.game = game;
    this.width = 64;
    this.height = 76;
    this.positionX = 0;
    this.positionY = this.game.ground - this.height;
    this.velocityY = 0;
    this.image = document.getElementById("player") as HTMLImageElement;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 15;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 1;
    this.states = [
      new Standing(this.game),
      new Walking(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Hit(this.game),
      new Attack(this.game),
      new Distract(this.game),
    ];
    this.currentState = this.states[0];
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.jumpVelocity = Math.sqrt(
      this.game.gravity * (this.game.ground - this.height),
    );
    this.jumpKeyJustPressed = false;
    this.prevInput = [];
  }

  update(input: string[], deltaTime: number): void {
    const jumpKeyDown = input.includes("ArrowUp") || input.includes(" ");
    const jumpKeyWasDown =
      this.prevInput.includes("ArrowUp") || this.prevInput.includes(" ");
    this.jumpKeyJustPressed = jumpKeyDown && !jumpKeyWasDown;
    this.currentState.handleInput(input);

    // horizontal movement
    this.positionX += this.speed;
    if (input.includes("ArrowRight") && this.currentState !== this.states[5])
      this.speed = this.maxSpeed;
    else if (
      input.includes("ArrowLeft") &&
      this.currentState !== this.states[5]
    )
      this.speed = -this.maxSpeed;
    else this.speed = 0;

    // horizontal boundaries
    if (this.positionX < 0) this.positionX = 0;
    if (this.positionX > this.game.width - this.width)
      this.positionX = this.game.width - this.width;

    // vertical movement
    this.positionY += this.velocityY;
    if (!this.onGround()) {
      this.velocityY += this.game.gravity;
    } else {
      this.velocityY = 0;
    }

    // vertical boundaries
    if (this.positionY > this.game.ground - this.height) {
      this.positionY = this.game.ground - this.height;
    }
    if (this.positionY < 0) {
      this.positionY = 0;
      this.velocityY = 0;
    }

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    this.prevInput = [...input];
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.positionX,
      this.positionY,
      this.width,
      this.height,
    );
  }

  onGround(): boolean {
    return this.positionY >= this.game.ground - this.height;
  }

  setState(state: number, speed: number): void {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
}
