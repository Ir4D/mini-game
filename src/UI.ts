import type Game from "./Game";

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  livesImage: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = 'Nunito';
    this.livesImage = document.getElementById('lives') as HTMLImageElement;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 1;
    context.shadowColor = 'rgb(179, 178, 178)';
    context.shadowBlur = 0;
    context.font = this.fontSize + 'px ' + this.fontFamily;
    context.textAlign = 'left';
    context.fillStyle = this.game.fontColor;

    // score
    context.fillText('Score: ' + this.game.score, 20, 50);

    // timer
    context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
    context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);

    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 30 * i + 20, 95, 25, 25);
    }

    // game over message
    if (this.game.gameOver) {
      context.textAlign = 'center';
      context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
      if (this.game.score > 5) {
        context.fillText('The game is over!', this.game.width * 0.5, this.game.height * 0.5 - 30);
        context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;
        context.fillText('You won!', this.game.width * 0.5, this.game.height * 0.5 + 30);
      } else {
        context.fillText('The game is over!', this.game.width * 0.5, this.game.height * 0.5 - 30);
        context.font = this.fontSize * 1.5 + 'px ' + this.fontFamily;
        context.fillText('You lost :(', this.game.width * 0.5, this.game.height * 0.5 + 30);
      }
    }
    context.restore();
  }
}