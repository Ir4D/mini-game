import type Player from "./Player";
import type Game from "./Game";
import { Dust, Fire } from "./Particles";

interface States {
  STANDING: number;
  WALKING: number;
  JUMPING: number;
  FALLING: number;
  ROLLING: number;
  DIVING: number;
  HIT: number;
}

const states: States = {
  STANDING: 0,
  WALKING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6
}

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
    super('WALKING', game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 0;
  }

  handleInput(input: string[]): void {
    if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
      this.game.player.setState(states.WALKING, 1);
    } else if (input.includes('Enter')) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Walking extends State {
  constructor(game: Game) {
    super('STANDING', game);
  }

  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 1;
  }

  handleInput(input: string[]): void {
    this.game.particles.unshift(new Dust(this.game, this.game.player.positionX + this.game.player.width * 0.5, this.game.player.positionY + this.game.player.height));
    if (input.includes('ArrowDown')) {
      this.game.player.setState(states.STANDING, 0);
    } else if (input.includes('ArrowUp') || input.includes(' ')) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.includes('Enter')) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Jumping extends State {
  constructor(game: Game) {
    super('JUMPING', game);
  }

  enter(): void {
    if (this.game.player.onGround()) this.game.player.velocityY -= 8.5;
    this.game.player.frameX = 3;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 3;
  }

  handleInput(input: string[]): void {
    if (this.game.player.velocityY > this.game.player.weight) {
      this.game.player.setState(states.FALLING, 1);
    } else if (input.includes('Enter')) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

export class Falling extends State {
  constructor(game: Game) {
    super('FALLING', game);
  }

  enter(): void {
    this.game.player.frameX = 8;
    this.game.player.maxFrame = 9;
    this.game.player.frameY = 3;
  }

  handleInput(input: string[]): void {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.WALKING, 1);
    }
  }
}

export class Rolling extends State {
  constructor(game: Game) {
    super('ROLLING', game);
  }

  enter(): void {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 15;
    this.game.player.frameY = 4;
  }

  handleInput(input: string[]): void {
    this.game.particles.unshift(new Fire(this.game, this.game.player.positionX + this.game.player.width * 0.5, this.game.player.positionY + this.game.player.height * 0.5));
    if (!input.includes('Enter') && this.game.player.onGround()) {
      this.game.player.setState(states.WALKING, 1);
    } else if (!input.includes('Enter') && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if ( input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround() || 
                input.includes('Enter') && input.includes(' ') && this.game.player.onGround()
              ) {
      this.game.player.velocityY -= 8;
    }
  }
}