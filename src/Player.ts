import type Game from "./Game";
import { Falling, Jumping, Standing, Walking } from "./PlayerStates";

export default class Player {
  private readonly game: Game;
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  velocityY: number;
  weight: number;
  image: HTMLImageElement;
  frameX: number;
  frameY: number;
  maxFrame: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  speed: number;
  maxSpeed: number;
  states: (Standing | Walking | Jumping | Falling)[];
  currentState: Standing | Walking | Jumping | Falling;

  constructor(game: Game) {
    this.game = game;
    this.width = 64;
    this.height = 92;
    this.positionX = 0;
    this.positionY = this.game.height - this.height - this.game.groundLevel;
    this.velocityY = 0;
    this.weight = 0.1;
    this.image = document.getElementById("player") as HTMLImageElement;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 15;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 1;
    this.states = [new Standing(this), new Walking(this), new Jumping(this), new Falling(this)];
    this.currentState = this.states[0];
    this.currentState.enter();

  }

  update(input: string[], deltaTime: number): void {
    this.checkCollision();
    this.currentState.handleInput(input);

    // horizontal movement
    this.positionX += this.speed;
    if (input.includes('ArrowRight'))this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
    else this.speed = 0;
    if (this.positionX < 0) this.positionX = 0;
    if (this.positionX > this.game.width - this.width) this.positionX = this.game.width - this.width;

    // vertical movement
    this.positionY += this.velocityY;
    if (!this.onGround()) this.velocityY += this.weight;
    else {
      this.velocityY = 0;
      this.positionY = this.game.height - this.height - this.game.groundLevel;
    };

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.game.debug) context.strokeRect(this.positionX, this.positionY, this.width, this.height);
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.positionX, this.positionY, this.width, this.height);
  }

  onGround(): Boolean {
    return this.positionY >= this.game.height - this.height - this.game.groundLevel;
  }

  setState(state: number, speed: number) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision() {
    this.game.enemies.forEach(enemy => {
      if (
        enemy.positionX < this.positionX + this.width &&
        enemy.positionX + enemy.width > this.positionX &&
        enemy.positionY < this.positionY + this.height &&
        enemy.positionY + enemy.height > this.positionY
      ) {
        enemy.markedForDeletion = true;
        this.game.score++;
      } else {

      }
    })
  }
}