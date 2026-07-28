import Player from "./Player";
import InputHandler from "./InputHandler";
import { Background } from "./Background";
import { FlyingEnemy, StandingEnemy } from "./Enemies";
export { FlyingEnemy, StandingEnemy } from "./Enemies";
import type { Enemy } from "./Enemies";
import { UI } from "./UI";

interface GameOptions {
  width: number;
  height: number;
}

export default class Game {
  readonly width: number;
  readonly height: number;
  readonly player: Player;
  readonly input: InputHandler;
  readonly groundLevel: number;
  public speed: number;
  public maxSpeed: number;
  background: Background;
  enemies: Enemy[];
  enemyTimer: number;
  enemyInterval: number;
  debug: boolean;
  public score: number;
  readonly fontColor: string;
  UI: UI;

  constructor({ width, height }: GameOptions) {
    this.width = width;
    this.height = height;
    this.groundLevel = 50;
    this.speed = 0;
    this.maxSpeed = 2;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.debug = true;
    this.score = 0;
    this.fontColor = 'black';
  }

  update(deltaTime: number): void {
    this.background.update();
    this.player.update(this.input.keys, deltaTime);

    // handle enemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
      if (enemy.markedForDeletion) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
      }
    })
  }

  draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach(enemy => {
      enemy.draw(context);
    });
    this.UI.draw(context);
  }

  addEnemy() {
    if (this.speed > 0 && Math.random() < 0.5) {
      this.enemies.push(new StandingEnemy(this));
    }
    this.enemies.push(new FlyingEnemy(this));
  }
}