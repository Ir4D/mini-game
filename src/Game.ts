import Player from "./Player";
import InputHandler from "./InputHandler";
import { Background } from "./Background";
import { FlyingEnemy, StandingEnemy } from "./Enemies";
import { Attack } from "./Attack";
import type { Enemy } from "./Enemies";
import type { Particle } from "./Particles";
import { UI } from "./UI";
import { CollisionAnimation, RemovalAnimation, CollectionAnimation } from "./SpriteAnimation";
import { FloatingMessages } from "./FloatingMessages";
import type { Collectible } from "./Collectible";
import { Breadcrumb } from "./Collectible";

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
  floatingMessages: FloatingMessages[];
  maxParticles: number;
  enemyTimer: number;
  enemyInterval: number;
  public score: number;
  public breadcrumbs: number;
  win: number;
  readonly fontColor: string;
  UI: UI;
  collisions: CollisionAnimation[];
  attacks: Attack[];
  attackReady: boolean;
  attackTimer: number;
  attackCooldown: number;
  time: number;
  gameOver: boolean;
  lives: number;
  maxEnemies: number;
  collectibles: Collectible[];
  collectibleTimer: number;
  collectibleInterval: number;
  collections: CollectionAnimation[];

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
    this.enemyInterval = 3000;
    this.particles = [];
    this.collisions = [];
    this.attacks = [];
    this.collectibles = [];
    this.collectibleTimer = 0;
    this.collectibleInterval = 3000;
    this.collections = [];
    this.attackReady = true;
    this.attackTimer = 0;
    this.attackCooldown = 3000;
    this.floatingMessages = [];
    this.score = 0;
    this.breadcrumbs = 0;
    this.win = 5;
    this.fontColor = 'black';
    this.time = 0;
    this.gameOver = false;
    this.lives = 5;
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
    this.maxParticles = 50;
    this.maxEnemies = 4;
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
    this.checkCollisions();

    if (!this.attackReady) {
      this.attackTimer += deltaTime;
      if (this.attackTimer >= this.attackCooldown) {
        this.attackReady = true;
      }
    }

    // handle enemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
    })

    // handle messages
    this.floatingMessages.forEach(message => {
      message.update();
    })

    // handle particles
    this.particles.forEach((particle) => {
      particle.update();
    })
    if (this.particles.length > this.maxParticles) {
      this.particles.length = this.maxParticles;
    }

    // handle collectibles
    if (this.collectibleTimer > this.collectibleInterval) {
      this.addCollectible();
      this.collectibleTimer = 0;
    } else {
      this.collectibleTimer += deltaTime;
    }
    this.collectibles.forEach(collectible => {
      collectible.update(deltaTime);
    })
    this.collections.forEach(collection => {
      collection.update(deltaTime);
    })

    // handle attack sprites
    this.attacks.forEach((attack) => {
      attack.update(deltaTime);
    });

    // handle collision sprites
    this.collisions.forEach((collision) => {
      collision.update(deltaTime);
    });

    // handle attack collisions with enemies
    this.attacks.forEach((attack) => {
      this.enemies.forEach((enemy) => {
        if (enemy.markedForDeletion) return;
        if (this.isColliding(attack, enemy)) {
          enemy.markedForDeletion = true;
          this.collisions.push(new RemovalAnimation(this, enemy.positionX + enemy.width * 0.5, enemy.positionY));
          this.score++;
          this.floatingMessages.push(new FloatingMessages('+1', enemy.positionX, enemy.positionY, 130, 45));
        }
      });
    });
    this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
    this.collectibles = this.collectibles.filter(collectible => !collectible.markedForDeletion);
    this.collections = this.collections.filter(collection => !collection.markedForDeletion);
    this.particles = this.particles.filter(particle => !particle.markedForDeletion);
    this.attacks = this.attacks.filter(attack => !attack.markedForDeletion);
    this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
    this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);
    this.player.draw(context);
    this.enemies.forEach(enemy => {
      enemy.draw(context);
    });
    this.collectibles.forEach(collectible => {
      collectible.draw(context);
    });
    this.collections.forEach(collection => {
      collection.draw(context);
    });
    this.particles.forEach(particle => {
      particle.draw(context);
    });
    this.attacks.forEach(attack => {
      attack.draw(context);
    });
    this.collisions.forEach(collision => {
      collision.draw(context);
    });
    this.UI.draw(context);
    this.floatingMessages.forEach(message => {
      message.draw(context);
    })
  }

  addEnemy(): void {
    if (this.speed > 0 && Math.random() < 0.5) {
      this.enemies.push(new StandingEnemy(this));
    }
    if (this.enemies.length <= this.maxEnemies) {
      this.enemies.push(new FlyingEnemy(this));
    }
  }

  addCollectible(): void {
    if (this.speed > 0 && Math.random() < 0.5) {
      this.collectibles.push(new Breadcrumb(this));
    }
  }

  private isColliding(a: { positionX: number; positionY: number; width: number; height: number }, b: { positionX: number; positionY: number; width: number; height: number }): boolean {
    return (
      a.positionX < b.positionX + b.width &&
      a.positionX + a.width > b.positionX &&
      a.positionY < b.positionY + b.height &&
      a.positionY + a.height > b.positionY
    );
  }

  checkCollisions(): void {
    this.collectibles.forEach((collectible) => {
      if (this.isColliding(this.player, collectible)) {
        collectible.markedForDeletion = true;
        this.breadcrumbs++;
        this.score++;
        this.collections.push(
          new CollectionAnimation(
            this,
            collectible.positionX + collectible.width * 0.5,
            collectible.positionY + collectible.height * 0.5
          )
        );
        if (this.breadcrumbs >= this.win) {
          this.gameOver = true;
        }
      }
    });

    this.enemies.forEach((enemy) => {
      if (enemy.markedForDeletion) return;
      if (this.isColliding(this.player, enemy)) {
        enemy.markedForDeletion = true;
        this.collisions.push(
          new CollisionAnimation(
            this,
            enemy.positionX + enemy.width * 0.5,
            enemy.positionY + enemy.height * 0.5
          )
        );
        if (this.player.currentState === this.player.states[7]) {
          this.score++;
          this.floatingMessages.push(
            new FloatingMessages('+1', enemy.positionX, enemy.positionY, 130, 45)
          );
        } else {
          this.player.setState(6, 0);
          this.lives--;
          if (this.lives <= 0) {
            this.gameOver = true;
          }
        }
      }
    });
  }

  triggerAttack(): void {
    if (!this.attackReady) return;
    this.attacks.push(new Attack(this));
    this.attackReady = false;
    this.attackTimer = 0;
  }
}