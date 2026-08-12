import Player from "./Player";
import InputHandler from "./InputHandler";
import { Background } from "./Background";
import { Attack } from "./Attack";
import type { Enemy } from "./Enemies";
import type { Particle } from "./Particles";
import { CollisionAnimation, RemovalAnimation, CollectionAnimation } from "./SpriteAnimation";
import { FloatingMessages } from "./FloatingMessages";
import type { Collectible } from "./Collectible";
import Button from "./Button";
import { Spawner } from "./Spawner";
import { UI } from "./UI";
import IntroScene from "./IntroScene";
import GameStorage from "./GameStorage";

interface GameOptions {
  width: number;
  height: number;
}

interface GameConfig {
  groundLevel: number;
  gravity: number;
  maxSpeed: number;
  enemyInterval: number;
  collectibleInterval: number;
  attackCooldown: number;
  win: number;
  maxParticles: number;
  maxEnemies: number;
  fontColor: string;
}

type GameScreen = 'menu' | 'intro' | 'pause' | 'playing' | 'gameOver';

interface GameState {
  speed: number;
  score: number;
  breadcrumbs: number;
  time: number;
  gameWon: boolean;
  lives: number;
  enemyTimer: number;
  collectibleTimer: number;
  attackReady: boolean;
  attackTimer: number;
  screen: GameScreen;
}

export default class Game {
  readonly width: number;
  readonly height: number;
  readonly player: Player;
  readonly input: InputHandler;
  readonly config: GameConfig;
  readonly background: Background;
  readonly startButton: Button;
  readonly introButton: Button;
  readonly pauseButton: Button;
  readonly resumeButton: Button;
  readonly UI: UI;
  readonly spawner: Spawner;
  enemies: Enemy[];
  particles: Particle[];
  floatingMessages: FloatingMessages[];
  collisions: CollisionAnimation[];
  attacks: Attack[];
  collectibles: Collectible[];
  collections: CollectionAnimation[];
  pointerX: number;
  pointerY: number;
  state: GameState;
  private activeIntro: IntroScene | null = null;
  animationTime: number;
  gameStorage: GameStorage;

  get speed(): number { return this.state.speed; }
  set speed(value: number) { this.state.speed = value; }
  get maxSpeed(): number { return this.config.maxSpeed; }
  get score(): number { return this.state.score; }
  set score(value: number) { this.state.score = value; }
  get breadcrumbs(): number { return this.state.breadcrumbs; }
  set breadcrumbs(value: number) { this.state.breadcrumbs = value; }
  get time(): number { return this.state.time; }
  set time(value: number) { this.state.time = value; }
  get gameWon(): boolean { return this.state.gameWon; }
  set gameWon(value: boolean) { this.state.gameWon = value; }
  get lives(): number { return this.state.lives; }
  set lives(value: number) { this.state.lives = value; }
  get enemyTimer(): number { return this.state.enemyTimer; }
  set enemyTimer(value: number) { this.state.enemyTimer = value; }
  get collectibleTimer(): number { return this.state.collectibleTimer; }
  set collectibleTimer(value: number) { this.state.collectibleTimer = value; }
  get attackReady(): boolean { return this.state.attackReady; }
  set attackReady(value: boolean) { this.state.attackReady = value; }
  get attackTimer(): number { return this.state.attackTimer; }
  set attackTimer(value: number) { this.state.attackTimer = value; }

  get start(): string { return this.state.screen; }
  set start(value: GameScreen) { this.state.screen = value; }

  get attackCooldown(): number { return this.config.attackCooldown; }
  get win(): number { return this.config.win; }
  get maxParticles(): number { return this.config.maxParticles; }
  get maxEnemies(): number { return this.config.maxEnemies; }
  get gravity(): number { return this.config.gravity; }
  get groundLevel(): number { return this.config.groundLevel; }
  get fontColor(): string { return this.config.fontColor; }

  get ground(): number { return this.height - this.config.groundLevel; }

  constructor({ width, height }: GameOptions) {
    this.width = width;
    this.height = height;
    this.config = {
      groundLevel: 50,
      gravity: 0.1,
      maxSpeed: 2,
      enemyInterval: 3000,
      collectibleInterval: 3000,
      attackCooldown: 3000,
      win: 5,
      maxParticles: 50,
      maxEnemies: 4,
      fontColor: '#49351f',
    };
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.startButton = new Button(this, { label: "Start Game", onClick: () => this.startGame() });
    this.introButton = new Button(this, { label: "Intro", onClick: () => this.startIntro() });
    this.pauseButton = new Button(this, { width: 80, height: 40, label: "Pause", onClick: () => this.startPause(), color: "secondary", size: "compact" });
    this.resumeButton = new Button(this, { label: "Resume", onClick: () => this.stopPause(), color: "secondary" });
    this.spawner = new Spawner(this);
    this.gameStorage = new GameStorage(this);
    this.enemies = [];
    this.particles = [];
    this.collisions = [];
    this.attacks = [];
    this.collectibles = [];
    this.collections = [];
    this.floatingMessages = [];
    this.pointerX = 0;
    this.pointerY = 0;
    this.state = this.createInitialState();
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
    this.resetGameState();
    this.animationTime = 0;
  }

  private createInitialState(): GameState {
    return {
      speed: 0,
      score: 0,
      breadcrumbs: 0,
      time: 0,
      gameWon: false,
      lives: 5,
      enemyTimer: 0,
      collectibleTimer: 0,
      attackReady: true,
      attackTimer: 0,
      screen: 'menu',
    };
  }

  update(deltaTime: number): void {
    this.animationTime += deltaTime;
    
    switch (this.state.screen) {
      case 'menu':
        this.startButton.setLayout("Start Game", this.width * 0.5 - this.startButton.buttonWidth * 0.5, this.height * 0.6);
        this.startButton.handlePointerMove(this.pointerX, this.pointerY);
        this.introButton.setLayout("Intro", this.width * 0.5 - this.introButton.buttonWidth * 0.5, this.height * 0.8);
        this.introButton.handlePointerMove(this.pointerX, this.pointerY);
        return;
      case 'intro':
        this.activeIntro?.update(deltaTime);
        return;
      case 'pause':
        this.resumeButton.setLayout("Resume", this.width * 0.5 - this.resumeButton.buttonWidth * 0.5, this.height * 0.4);
        this.resumeButton.handlePointerMove(this.pointerX, this.pointerY);
        this.startButton.setLayout("Restart", this.width * 0.5 - this.startButton.buttonWidth * 0.5, this.height * 0.6);
        this.startButton.handlePointerMove(this.pointerX, this.pointerY);
        this.introButton.setLayout("Intro", this.width * 0.5 - this.introButton.buttonWidth * 0.5, this.height * 0.8);
        this.introButton.handlePointerMove(this.pointerX, this.pointerY);
        return;
      case 'gameOver':
        this.startButton.setLayout("Start again", this.width * 0.5 - this.startButton.buttonWidth * 0.5, this.height * 0.8);
        this.startButton.handlePointerMove(this.pointerX, this.pointerY);
        return;
      case 'playing':
        this.state.time += deltaTime;
        this.background.update();
        this.pauseButton.setLayout("Pause", this.width - this.pauseButton.buttonWidth - 20, 20);
        this.pauseButton.handlePointerMove(this.pointerX, this.pointerY);
        this.player.update(this.input.keys, deltaTime);
        this.checkCollisions();
        if (!this.state.attackReady) {
          this.state.attackTimer += deltaTime;
          if (this.state.attackTimer >= this.config.attackCooldown) {
            this.state.attackReady = true;
          }
        }
        
        // handle enemies
        if (this.state.enemyTimer > this.config.enemyInterval) {
          this.spawner.spawnEnemy();
          this.state.enemyTimer = 0;
        } else {
          this.state.enemyTimer += deltaTime;
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
        if (this.particles.length > this.config.maxParticles) {
          this.particles.length = this.config.maxParticles;
        }
    
        // handle collectibles
        if (this.state.collectibleTimer > this.config.collectibleInterval) {
          this.spawner.spawnCollectible();
          this.state.collectibleTimer = 0;
        } else {
          this.state.collectibleTimer += deltaTime;
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
              this.state.score++;
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
        break;
    }
  }

  draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);

    switch (this.state.screen) {
      case 'menu':
        this.UI.drawStartScreen(context);
        this.startButton.draw(context);
        this.introButton.draw(context);
        return;
      case 'intro':
        this.activeIntro?.draw(context);
        return;
      case 'pause':
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
        });

        this.UI.drawPauseScreen(context);
        this.resumeButton.draw(context);
        this.startButton.draw(context);
        this.introButton.draw(context);

        return;
      case 'gameOver':
        this.UI.drawGameOverScreen(context);
        this.startButton.draw(context);
        return;
      case 'playing':
        this.pauseButton.draw(context);

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
        });
        break;
    }
  }

  private resetGameState(): void {
    this.state = this.createInitialState();
    this.clearArrays(
      this.enemies,
      this.particles,
      this.floatingMessages,
      this.attacks,
      this.collisions,
      this.collectibles,
      this.collections
    );
    this.resetPlayerState();
  }

  private clearArrays(...arrays: Array<unknown[]>): void {
    arrays.forEach((array) => {
      array.length = 0;
    });
  }

  private resetPlayerState(): void {
    this.player.positionX = 0;
    this.player.positionY = this.ground - this.player.height;
    this.player.velocityY = 0;
    this.player.speed = 0;
    this.player.frameX = 0;
    this.player.frameTimer = 0;
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
  }

  startGame(): void {
    this.resetGameState();
    this.activeIntro = null;
    this.state.screen = 'playing';
  }

  startIntro(): void {
    this.resetGameState();
    this.state.screen = 'intro';
    this.activeIntro = new IntroScene(this);
  }

  startPause(): void {
    this.state.screen = 'pause';
  }

  stopPause(): void {
    this.state.screen = 'playing';
  }

  handleEnter(): void {
    switch (this.state.screen) {
      case 'menu':
        this.startButton.activate();
        break;

      case 'gameOver':
        this.startButton.activate();
        break;

      case 'pause':
        this.resumeButton.activate();
        break;
    }
  }

  handleEscape(): void {
    if (this.state.screen === 'playing') {
      this.pauseButton.activate();
    } else if (this.state.screen === 'pause') {
      this.resumeButton.activate();
    }
  }

  handlePointerMove(x: number, y: number): void {
    this.pointerX = x;
    this.pointerY = y;

    if (this.state.screen === 'intro') {
      this.activeIntro?.handlePointerMove(x, y);
      return;
    }

    if (this.state.screen === 'menu' || this.state.screen === "gameOver") {
      this.startButton.handlePointerMove(x, y);
      this.introButton.handlePointerMove(x, y);
    }

    if (this.state.screen === 'playing') {
      this.pauseButton.handlePointerMove(x, y);
    }

    if (this.state.screen === 'pause') {
      this.resumeButton.handlePointerMove(x, y);
      this.startButton.handlePointerMove(x, y);
      this.introButton.handlePointerMove(x, y);
    }
  }

  handlePointerDown(x: number, y: number): void {
    this.handlePointerMove(x, y);

    if (this.state.screen === 'intro') {
      if (this.activeIntro?.handlePointerDown(x, y)) {
        return;
      }
    }

    if (this.state.screen === 'menu' || this.state.screen === "gameOver") {
      this.startButton.handlePointerDown(x, y);

      if (this.state.screen === 'menu') {
        this.introButton.handlePointerDown(x, y);
      }
    }

    if (this.state.screen === 'playing') {
      this.pauseButton.handlePointerDown(x, y);
    }

    if (this.state.screen === 'pause') {
      this.resumeButton.handlePointerDown(x, y);
      this.startButton.handlePointerDown(x, y);
      this.introButton.handlePointerDown(x, y);
    }
  }

  isHoveringButton(): boolean {
    if (this.state.screen === 'intro') {
      return this.activeIntro?.isHoveringButton() ?? false;
    }

    if (this.state.screen === 'menu' || this.state.screen === "gameOver") {
      return this.startButton.isHovered() || this.introButton.isHovered();
    }

    if (this.state.screen === 'playing') {
      return this.pauseButton.isHovered();
    }

    if (this.state.screen === 'pause') {
      return this.resumeButton.isHovered() || this.startButton.isHovered() || this.introButton.isHovered();
    }

    return false;
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
        this.state.breadcrumbs++;
        this.state.score++;
        this.collections.push(
          new CollectionAnimation(
            this,
            collectible.positionX + collectible.width * 0.5,
            collectible.positionY + collectible.height * 0.5
          )
        );
        if (this.state.breadcrumbs >= this.config.win) {
          this.state.gameWon = true;
          this.gameStorage.update(this.time, this.score);
          this.state.screen = "gameOver";
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
        if (this.player.currentState === this.player.states[6]) {
          this.state.score++;
          this.floatingMessages.push(
            new FloatingMessages('+1', enemy.positionX, enemy.positionY, 130, 45)
          );
        } else {
          this.player.setState(5, 0);
          this.state.lives--;
          if (this.state.lives <= 0) {
            this.state.gameWon = false;
            this.state.screen = "gameOver";
          }
        }
      }
    });
  }

  triggerAttack(): void {
    if (!this.state.attackReady) return;
    this.attacks.push(new Attack(this));
    this.state.attackReady = false;
    this.state.attackTimer = 0;
  }
}