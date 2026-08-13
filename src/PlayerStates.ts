import type Game from "./Game";
import { Dust, Fire } from "./Particles";

interface States {
  STANDING: number;
  WALKING: number;
  JUMPING: number;
  FALLING: number;
  ROLLING: number;
  HIT: number;
  ATTACK: number;
  DISTRACT: number;
}

const states: States = {
  STANDING: 0,
  WALKING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  HIT: 5,
  ATTACK: 6,
  DISTRACT: 7,
};

class State {
  state: string;
  game: Game;

  constructor(state: string, game: Game) {
    this.state = state;
    this.game = game;
  }
}

export class Standing extends State {
  constructor(game: Game) {
    super("WALKING", game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 0;
    this.game.player.jumpCount = 0;
  }

  handleInput(input: string[]): void {
    if (input.includes("ArrowLeft") || input.includes("ArrowRight")) {
      this.game.player.setState(states.WALKING, 1);
    } else if (input.includes("Control") && this.game.attackReady) {
      this.game.player.setState(states.ATTACK, 1);
    } else if (input.includes("ArrowUp") || input.includes(" ")) {
      this.game.player.setState(states.JUMPING, 1);
    }
  }
}

export class Walking extends State {
  constructor(game: Game) {
    super("STANDING", game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 1;
    this.game.player.jumpCount = 0;
  }

  handleInput(input: string[]): void {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.positionX + this.game.player.width * 0.5,
        this.game.player.positionY + this.game.player.height,
      ),
    );
    if (input.includes("ArrowDown")) {
      this.game.player.setState(states.STANDING, 0);
    } else if (input.includes("ArrowUp") || input.includes(" ")) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.includes("Control") && this.game.attackReady) {
      this.game.player.setState(states.ATTACK, 1);
    }
  }
}

export class Jumping extends State {
  constructor(game: Game) {
    super("JUMPING", game);
  }

  enter(): void {
    if (this.game.player.jumpCount < this.game.player.maxJumps) {
      this.game.player.velocityY = -this.game.player.jumpVelocity;
      this.game.player.jumpCount++;
    }
    this.game.player.frameX = 3;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 3;
  }

  handleInput(input: string[]): void {
    if (this.game.player.velocityY > 0) {
      this.game.player.setState(states.FALLING, 1);
    } else if (input.includes("Control") && this.game.attackReady) {
      this.game.player.setState(states.ATTACK, 1);
    } else if (
      this.game.player.jumpKeyJustPressed &&
      this.game.player.jumpCount < this.game.player.maxJumps
    ) {
      this.game.player.setState(states.JUMPING, 1);
    }
  }
}

export class Falling extends State {
  constructor(game: Game) {
    super("FALLING", game);
  }

  enter(): void {
    this.game.player.frameX = 8;
    this.game.player.maxFrame = 9;
    this.game.player.frameY = 3;
  }

  handleInput(input: string[]): void {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.WALKING, 1);
    } else if (input.includes("Control") && this.game.attackReady) {
      this.game.player.setState(states.ATTACK, 1);
    } else if (
      this.game.player.jumpKeyJustPressed &&
      this.game.player.jumpCount < this.game.player.maxJumps
    ) {
      this.game.player.setState(states.JUMPING, 1);
    }
  }
}

export class Rolling extends State {
  constructor(game: Game) {
    super("ROLLING", game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 4;
  }

  handleInput(input: string[]): void {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.positionX + this.game.player.width * 0.5,
        this.game.player.positionY + this.game.player.height * 0.5,
      ),
    );
    if (!input.includes("Control") && this.game.player.onGround()) {
      this.game.player.setState(states.WALKING, 1);
    } else if (!input.includes("Control") && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (
      (input.includes("Control") &&
        input.includes("ArrowUp") &&
        this.game.player.onGround()) ||
      (input.includes("Control") &&
        input.includes(" ") &&
        this.game.player.onGround())
    ) {
      this.game.player.velocityY -= 8;
    }
  }
}

export class Hit extends State {
  constructor(game: Game) {
    super("HIT", game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 11;
    this.game.player.frameY = 6;
  }

  handleInput(): void {
    if (this.game.player.frameX >= 11 && this.game.player.onGround()) {
      this.game.player.setState(states.WALKING, 1);
    } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    }
  }
}

export class Attack extends State {
  constructor(game: Game) {
    super("ATTACK", game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 8;
    this.game.player.frameY = 0;
    this.game.triggerAttack();
  }

  handleInput(input: string[]): void {
    if (!input.includes("Control") && this.game.player.onGround()) {
      this.game.player.setState(states.WALKING, 1);
    } else if (!input.includes("Control") && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (
      (input.includes("Control") &&
        input.includes("ArrowUp") &&
        this.game.player.onGround()) ||
      (input.includes("Control") &&
        input.includes(" ") &&
        this.game.player.onGround())
    ) {
      this.game.player.velocityY -= 8;
    }
  }
}

export class Distract extends State {
  constructor(game: Game) {
    super("DISTRACT", game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 7;
  }

  handleInput(): void {}
}
