import Player from "./Player";
import InputHandler from "./InputHandler";
import { Background } from "./Background";

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

  constructor({ width, height }: GameOptions) {
    this.width = width;
    this.height = height;
    this.groundLevel = 50;
    this.speed = 0;
    this.maxSpeed = 3;
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler();
  }

  update(deltaTime: number): void {
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.background.draw(context);
    this.player.draw(context);
  }
}