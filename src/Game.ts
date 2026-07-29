import Player from "./Player";
import InputHandler from "./InputHandler";
import { Background } from "./Background";
import { FlyingEnemy, StandingEnemy } from "./Enemies";
export { FlyingEnemy, StandingEnemy } from "./Enemies";
import type { Enemy } from "./Enemies";
import type { Particle } from "./Particles";
import { UI } from "./UI";
import type { CollisionAnimation } from "./CollisionAnimation";

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
  particles: Particle[];
  maxParticles: number;
  enemyTimer: number;
  enemyInterval: number;
  debug: boolean;
  public score: number;
  readonly fontColor: string;
  UI: UI;
  collisions: CollisionAnimation[];
  time: number;
  maxTime: number;
  gameOver: boolean;

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
    this.particles = [];
    this.collisions = [];
    this.enemyTimer = 0;
    this.enemyInterval = 1000;
    this.debug = true;
    this.score = 0;
    this.fontColor = 'black';
    this.time = 0;
    this.maxTime = 10000;
    this.gameOver = false;
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
    this.maxParticles = 50;
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    if (this.time > this.maxTime) this.gameOver = true;
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

    // handle particles
    this.particles.forEach((particle, index) => {
      particle.update();
      if (particle.markedForDeletion) this.particles.splice(index, 1);
    })
    if (this.particles.length > this.maxParticles) {
      this.particles = this.particles.slice(0, this.maxParticles);
    }

    // handle collision sprites
    this.collisions.forEach((collision, index) => {
      collision.update(deltaTime);
      if (collision.markedForDeletion) this.collisions.splice(index, 1);
    });
  }

  draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach(enemy => {
      enemy.draw(context);
    });
    this.particles.forEach(particle => {
      particle.draw(context);
    });
    this.collisions.forEach(collision => {
      collision.draw(context);
    });
    this.UI.draw(context);
  }

  addEnemy(): void {
    if (this.speed > 0 && Math.random() < 0.5) {
      this.enemies.push(new StandingEnemy(this));
    }
    this.enemies.push(new FlyingEnemy(this));
  }
}