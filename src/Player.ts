import type Game from "./Game";
import { Falling, Jumping, Standing, Walking, Rolling, Diving, Hit, Attack } from "./PlayerStates";
import { CollisionAnimation } from "./SpriteAnimation";
import { FloatingMessages } from "./FloatingMessages";

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
  states: (Standing | Walking | Jumping | Falling | Rolling | Diving | Hit | Attack)[];
  currentState: Standing | Walking | Jumping | Falling | Rolling | Diving | Hit | Attack;

  constructor(game: Game) {
    this.game = game;
    this.width = 64;
    this.height = 76;
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
    this.states = [new Standing(this.game), new Walking(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game), new Attack(this.game)];
    this.currentState = this.states[0];
  }

  update(input: string[], deltaTime: number): void {
    this.checkCollision();
    this.currentState.handleInput(input);

    // horizontal movement
    this.positionX += this.speed;
    if (input.includes('ArrowRight') && this.currentState !== this.states[6])this.speed = this.maxSpeed;
    else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
    else this.speed = 0;

    // horizontal boundaries
    if (this.positionX < 0) this.positionX = 0;
    if (this.positionX > this.game.width - this.width) this.positionX = this.game.width - this.width;

    // vertical movement
    this.positionY += this.velocityY;
    if (!this.onGround()) this.velocityY += this.weight;
    else {
      this.velocityY = 0;
    };

    // vertical boundaries
    if (this.positionY > this.game.height - this.height - this.game.groundLevel) this.positionY = this.game.height - this.height - this.game.groundLevel;

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
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.positionX, this.positionY, this.width, this.height);
  }

  onGround(): boolean {
    return this.positionY >= this.game.height - this.height - this.game.groundLevel;
  }

  setState(state: number, speed: number): void {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }

  checkCollision(): void {
    this.game.enemies.forEach(enemy => {
      if (
        enemy.positionX < this.positionX + this.width &&
        enemy.positionX + enemy.width > this.positionX &&
        enemy.positionY < this.positionY + this.height &&
        enemy.positionY + enemy.height > this.positionY
      ) {
        enemy.markedForDeletion = true;
        this.game.collisions.push(new CollisionAnimation(this.game, enemy.positionX + enemy.width * 0.5, enemy.positionY + enemy.height * 0.5));
        if (this.currentState === this.states[4] || this.currentState === this.states[5] || this.currentState === this.states[7]) {
          this.game.score++;
          this.game.floatingMessages.push(new FloatingMessages('+1', enemy.positionX, enemy.positionY, 130, 45));
        } else {
          this.setState(6, 0);
          // this.game.lives--;
          // if (this.game.lives <= 0) {
          //   this.game.gameOver = true;
          // }
        }
      }
    })
  }
}