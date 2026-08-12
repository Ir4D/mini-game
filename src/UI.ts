import type Game from "./Game";

export class UI {
  private readonly game: Game;
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly livesImage: HTMLImageElement;
  readonly attackIconElem: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = 'Nunito';
    this.livesImage = document.getElementById('lives') as HTMLImageElement;
    this.attackIconElem = document.getElementById('attack_icon') as HTMLImageElement;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.game.state.screen === 'menu') {
      this.drawStartScreen(context);
      return;
    }

    if (this.game.state.screen === 'gameOver') {
      this.drawGameOverScreen(context);
      return;
    }

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
    // breadcrumbs
    context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
    context.fillText('Bread: ' + this.game.breadcrumbs + '/' + this.game.win, 20, 80)
    // timer
    context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1) + 's', 20, 110);
    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 30 * i + 20, 120, 25, 25);
    }

    // attacks: prominent icon + ring cooldown indicator
    const iconSize = 48;
    const iconX = 20;
    const iconY = 160;
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

    context.restore();
  }

  drawStartScreen(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = 'rgba(255, 255, 255, 0.25)';
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = '#49351f';
    context.font = 'bold 34px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(
      'Help the little duckling find its way back to Mom!',
      this.game.width * 0.5,
      this.game.height * 0.4
    );
    context.restore();
  }

  drawGameOverScreen(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = 'rgba(0, 0, 0, 0.45)';
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = '#fff7e6';
    context.font = 'bold 42px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(this.game.gameWon ? 'You Won!' : 'Game Over', this.game.width * 0.5, this.game.height * 0.1);
    context.font = 'bold 24px Nunito';
    context.fillText(this.game.gameWon ? `Your current score: ${this.game.score} and time: ${(this.game.time * 0.001).toFixed(1)}` : 'You lost all your lives...', this.game.width * 0.5, this.game.height * 0.17);
    context.restore();

    // best runs
    context.save();
    const panelWidth = 500;
    const panelHeight = 260;
    const panelX = this.game.width * 0.5 - panelWidth * 0.5;
    const panelY = this.game.height * 0.24;
    context.fillStyle = 'rgba(255, 248, 232, 0.94)';
    context.strokeStyle = '#6b4b2a';
    context.lineWidth = 4;
    context.beginPath();
    context.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
    context.fill();
    context.stroke();
    context.fillStyle = '#49351f';
    context.font = 'bold 25px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Best Runs:', this.game.width * 0.5, panelY + 30);

    context.font = 'bold 13px Nunito';
    context.fillStyle = 'rgba(73, 53, 31, 0.7)';
    context.textAlign = 'left';
    context.fillText('SCORE', panelX + 84, panelY + 57);
    context.textAlign = 'right';
    context.fillText('TIME', panelX + panelWidth - 48, panelY + 57);

    const listStartY = panelY + 80;
    const rowHeight = 35;
    const rowWidth = panelWidth - 50;
    const rowX = panelX + 25;

    this.game.gameStorage.topGames.forEach((game, index) => {
      const y = listStartY + index * rowHeight;

      const isCurrentGame = game.score === this.game.score && game.time === this.game.time;
      if (isCurrentGame) {
        context.strokeStyle = '#f2b84b';
        context.lineWidth = 3;
        context.beginPath();
        context.roundRect(rowX, y - 14, rowWidth, 28, 9);
        context.stroke();
      }

      // row background
      context.save();
      if (index === 0) {
        context.fillStyle = 'rgba(255, 215, 90, 0.35)';
      } else if (index === 1) {
        context.fillStyle = 'rgba(192, 192, 192, 0.73)';
      } else if (index === 2) {
        context.fillStyle = 'rgba(205, 140, 85, 0.30)';
      } else {
        context.fillStyle = 'rgba(107, 75, 42, 0.07)';
      }

      context.beginPath();
      context.roundRect(rowX, y - 16, rowWidth, 32, 10);
      context.fill();

      // place badge
      const badgeX = rowX + 22;
      context.fillStyle =
        index === 0 ? '#d4a017' : index === 1
          ? '#9e9e9e' : index === 2
          ? '#b87333'
          : '#6b4b2a';

      context.beginPath();
      context.arc(badgeX, y, 11, 0, Math.PI * 2);
      context.fill();

      // rank number
      context.fillStyle = '#fff8e8';
      context.font = 'bold 16px Nunito';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.fillText(String(index + 1), badgeX, y + 1);

      // score
      context.fillStyle = '#49351f';
      context.font = 'bold 17px Nunito';
      context.textAlign = 'left';
      context.fillText(`${game.score} points`, rowX + 60, y);

      // time
      context.font = '16px Nunito';
      context.textAlign = 'right';
      context.fillText(`${(game.time * 0.001).toFixed(1)}s`, rowX + rowWidth - 20, y);

      context.restore();
    });

    context.restore();
  }

  drawPauseScreen(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = 'rgba(0, 0, 0, 0.45)';
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = '#fff7e6';
    context.font = 'bold 42px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Pause', this.game.width * 0.5, this.game.height * 0.25);
    context.restore();
  }
}