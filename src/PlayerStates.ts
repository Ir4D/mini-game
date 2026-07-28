import type Player from "./Player";

interface States {
  STANDING: number;
  WALKING: number;
  JUMPING: number;
  FALLING: number;
}

const states: States = {
  STANDING: 0,
  WALKING: 1,
  JUMPING: 2,
  FALLING: 3,
}

class State {
  state: string;

  constructor(state: string) {
    this.state = state;
  }
}

export class Standing extends State {
  player: Player;

  constructor(player: Player) {
    super('WALKING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 15;
    this.player.frameY = 0;
  }

  handleInput(input: string[]) {
    if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
      this.player.setState(states.WALKING, 1);
    }
  }
}

export class Walking extends State {
  player: Player;

  constructor(player: Player) {
    super('STANDING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 15;
    this.player.frameY = 1;
  }

  handleInput(input: string[]) {
    if (input.includes('ArrowDown')) {
      this.player.setState(states.STANDING, 0);
    } else if (input.includes('ArrowUp') || input.includes(' ')) {
      this.player.setState(states.JUMPING, 1);
    }
  }
}

export class Jumping extends State {
  player: Player;

  constructor(player: Player) {
    super('JUMPING');
    this.player = player;
  }

  enter() {
    if (this.player.onGround()) this.player.velocityY -= 8.5;
    this.player.frameX = 3;
    this.player.maxFrame = 6;
    this.player.frameY = 3;
  }

  handleInput(input: string[]) {
    if (this.player.velocityY > this.player.weight) {
      this.player.setState(states.FALLING, 1);
    }
  }
}

export class Falling extends State {
  player: Player;

  constructor(player: Player) {
    super('FALLING');
    this.player = player;
  }

  enter() {
    this.player.frameX = 8;
    this.player.maxFrame = 9;
    this.player.frameY = 3;
  }

  handleInput(input: string[]) {
    if (this.player.onGround()) {
      this.player.setState(states.WALKING, 1);
    }
  }
}