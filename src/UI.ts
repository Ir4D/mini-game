import type Game from "./Game";

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;
  livesImage: HTMLImageElement;
  attackIconElem: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = 'Nunito';
    this.livesImage = document.getElementById('lives') as HTMLImageElement;
    this.attackIconElem = document.getElementById('attack_icon') as HTMLImageElement;
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
      context.drawImage(this.livesImage, 30 * i + 20, 90, 25, 25);
    }

    // attacks: prominent icon + ring cooldown indicator
    const iconSize = 48;
    const iconX = 20;
    const iconY = 130;
    // icon background circle
    const centerX = iconX + iconSize * 0.5;
    const centerY = iconY + iconSize * 0.5;
    const radius = iconSize * 0.5 + 6;
    context.save();
    context.globalAlpha = 0.95;
    // pulsing scale when ready
    const pulseScale = this.game.attackReady ? 1 + 0.08 * Math.sin(this.game.time * 0.01) : 1;
    const drawW = iconSize * pulseScale;
    const drawH = iconSize * pulseScale;
    const drawX = centerX - drawW * 0.5;
    const drawY = centerY - drawH * 0.5;

    if (
      this.attackIconElem &&
      this.attackIconElem.complete &&
      this.attackIconElem.naturalWidth > 0
    ) {
      context.drawImage(
        this.attackIconElem,
        drawX,
        drawY,
        drawW,
        drawH
      );
    }
    // base ring
    context.lineWidth = 6;
    context.strokeStyle = 'rgba(0,0,0,0.25)';
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.stroke();
    if (this.game.attackReady) {
      // full green ring with glow
      context.strokeStyle = 'limegreen';
      context.beginPath();
      context.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
      context.stroke();
      context.fillStyle = 'rgba(0,255,0,0.10)';
      context.beginPath();
      context.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = this.game.fontColor;
      context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
      context.textAlign = 'center';
      context.fillText('Ready', centerX, iconY + iconSize + 18);
    } else {
      const pct = Math.min(1, this.game.attackTimer / this.game.attackCooldown);
      const endAngle = -Math.PI / 2 + pct * Math.PI * 2;
      context.strokeStyle = 'orange';
      context.beginPath();
      context.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      context.stroke();
      const remaining = Math.max(0, (this.game.attackCooldown - this.game.attackTimer) * 0.001).toFixed(1);
      context.fillStyle = this.game.fontColor;
      context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
      context.textAlign = 'center';
      context.fillText(remaining + 's', centerX, iconY + iconSize + 18);
    }
    context.restore();

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