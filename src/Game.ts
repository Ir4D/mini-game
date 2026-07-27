import Player from "./Player";
import InputHandler from "./InputHandler";

interface GameOptions {
  width: number;
  height: number;
}

export default class Game {
  readonly width: number;
  readonly height: number;
  readonly player: Player;
  readonly input: InputHandler;

  constructor({ width, height }: GameOptions) {
    this.width = width;
    this.height = height;
    this.player = new Player(this);
    this.input = new InputHandler();
  }

  update(): void {
    this.player.update(this.input.keys);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.player.draw(context);
  }
}