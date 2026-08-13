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
    this.fontFamily = "Nunito";
    this.livesImage = document.getElementById("lives") as HTMLImageElement;
    this.attackIconElem = document.getElementById(
      "attack_icon",
    ) as HTMLImageElement;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.game.state.screen === "menu") {
      this.drawStartScreen(context);
      return;
    }

    if (this.game.state.screen === "gameOver") {
      this.drawGameOverScreen(context);
      return;
    }

    const panelX = 16;
    const panelY = 16;
    const panelWidth = 130;
    const panelHeight = 142;

    context.save();

    // panel background
    context.fillStyle = "rgba(255, 245, 222, 0.58)";
    context.strokeStyle = "rgba(107, 75, 42, 0.85)";
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(panelX, panelY, panelWidth, panelHeight, 16);
    context.fill();
    context.stroke();
    const leftX = panelX + 12;
    const rightX = panelX + panelWidth - 12;

    // score
    this.drawHudStatRow(
      context,
      "SCORE",
      String(this.game.score),
      leftX,
      rightX,
      panelY + 20,
    );

    // bread
    this.drawHudStatRow(
      context,
      "BREAD",
      `${this.game.breadcrumbs} / ${this.game.win}`,
      leftX,
      rightX,
      panelY + 42,
    );

    // time
    this.drawHudStatRow(
      context,
      "TIME",
      `${(this.game.time * 0.001).toFixed(1)}s`,
      leftX,
      rightX,
      panelY + 64,
    );

    // lives
    this.drawHudLives(context, leftX, panelY + 79);

    // divider
    const dividerY = panelY + 105;
    context.strokeStyle = "rgba(107, 75, 42, 0.18)";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(panelX + 10, dividerY);
    context.lineTo(panelX + panelWidth - 10, dividerY);
    context.stroke();

    // attack
    this.drawAttackHud(context, leftX, panelY + 111, panelWidth - 24);

    context.restore();
  }

  private drawHudStatRow(
    context: CanvasRenderingContext2D,
    label: string,
    value: string,
    labelX: number,
    valueX: number,
    y: number,
  ): void {
    context.save();
    context.textBaseline = "middle";

    // label
    context.fillStyle = "rgba(73, 53, 31, 0.62)";
    context.font = "bold 11px Nunito";
    context.textAlign = "left";
    context.fillText(label, labelX, y);

    // value
    context.fillStyle = "#49351f";
    context.font = "bold 17px Nunito";
    context.textAlign = "right";
    context.fillText(value, valueX, y);

    context.restore();
  }

  private drawHudLives(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
  ): void {
    const heartSize = 18;
    const gap = 4;
    context.save();
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(
        this.livesImage,
        x + i * (heartSize + gap),
        y,
        heartSize,
        heartSize,
      );
    }
    context.restore();
  }

  private drawAttackHud(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
  ): void {
    const textX = x;
    const textY = y;
    const cooldownProgress = Math.min(
      1,
      this.game.attackTimer / this.game.attackCooldown,
    );
    const remaining = Math.max(
      0,
      (this.game.attackCooldown - this.game.attackTimer) * 0.001,
    );

    context.save();
    // status
    context.fillStyle = "#49351f";
    context.font = "bold 13px Nunito";
    context.textAlign = "left";
    context.textBaseline = "middle";

    const status = this.game.attackReady ? "Ready" : `${remaining.toFixed(1)}s`;
    context.fillText(status, textX, textY + 7);

    // small helper text
    context.fillStyle = "rgba(73, 53, 31, 0.55)";
    context.font = "10px Nunito";
    context.fillText("Attack", textX, textY + 18);

    // cooldown bar
    const barX = textX + 48;
    const barY = textY + 8;
    const barWidth = width - (barX - x);
    const barHeight = 7;
    context.fillStyle = "rgba(107, 75, 42, 0.16)";

    context.beginPath();
    context.roundRect(barX, barY, barWidth, barHeight, 4);
    context.fill();
    const fillProgress = this.game.attackReady ? 1 : cooldownProgress;
    context.fillStyle = this.game.attackReady ? "#8fe946" : "#fbff1d";

    context.beginPath();
    context.roundRect(barX, barY, barWidth * fillProgress, barHeight, 4);
    context.fill();

    context.restore();
  }

  drawStartScreen(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = "rgba(255, 255, 255, 0.25)";
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = "#49351f";
    context.font = "bold 34px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      "Help the little duckling find its way back to Mom!",
      this.game.width * 0.5,
      this.game.height * 0.4,
    );
    context.restore();
  }

  drawGameOverScreen(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.45)";
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = "#fff7e6";
    context.font = "bold 42px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      this.game.gameWon ? "You Won!" : "Game Over",
      this.game.width * 0.5,
      this.game.height * 0.1,
    );
    context.font = "bold 24px Nunito";
    context.fillText(
      this.game.gameWon
        ? `Your current score: ${this.game.score} and time: ${(this.game.time * 0.001).toFixed(1)}`
        : "You lost all your lives...",
      this.game.width * 0.5,
      this.game.height * 0.17,
    );
    context.restore();

    // best runs
    context.save();
    const panelWidth = 500;
    const panelHeight = 260;
    const panelX = this.game.width * 0.5 - panelWidth * 0.5;
    const panelY = this.game.height * 0.24;
    context.fillStyle = "rgba(255, 248, 232, 0.94)";
    context.strokeStyle = "#6b4b2a";
    context.lineWidth = 4;
    context.beginPath();
    context.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
    context.fill();
    context.stroke();
    context.fillStyle = "#49351f";
    context.font = "bold 25px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Best Runs:", this.game.width * 0.5, panelY + 30);

    context.font = "bold 13px Nunito";
    context.fillStyle = "rgba(73, 53, 31, 0.7)";
    context.textAlign = "left";
    context.fillText("SCORE", panelX + 84, panelY + 57);
    context.textAlign = "right";
    context.fillText("TIME", panelX + panelWidth - 48, panelY + 57);

    const listStartY = panelY + 80;
    const rowHeight = 35;
    const rowWidth = panelWidth - 50;
    const rowX = panelX + 25;

    this.game.gameStorage.topGames.forEach((game, index) => {
      const y = listStartY + index * rowHeight;

      const isCurrentGame =
        game.score === this.game.score && game.time === this.game.time;
      if (isCurrentGame) {
        context.strokeStyle = "#f2b84b";
        context.lineWidth = 3;
        context.beginPath();
        context.roundRect(rowX, y - 14, rowWidth, 28, 9);
        context.stroke();
      }

      // row background
      context.save();
      if (index === 0) {
        context.fillStyle = "rgba(255, 215, 90, 0.35)";
      } else if (index === 1) {
        context.fillStyle = "rgba(192, 192, 192, 0.73)";
      } else if (index === 2) {
        context.fillStyle = "rgba(205, 140, 85, 0.30)";
      } else {
        context.fillStyle = "rgba(107, 75, 42, 0.07)";
      }

      context.beginPath();
      context.roundRect(rowX, y - 16, rowWidth, 32, 10);
      context.fill();

      // place badge
      const badgeX = rowX + 22;
      context.fillStyle =
        index === 0
          ? "#d4a017"
          : index === 1
            ? "#9e9e9e"
            : index === 2
              ? "#b87333"
              : "#6b4b2a";

      context.beginPath();
      context.arc(badgeX, y, 11, 0, Math.PI * 2);
      context.fill();

      // rank number
      context.fillStyle = "#fff8e8";
      context.font = "bold 16px Nunito";
      context.textAlign = "center";
      context.textBaseline = "middle";

      context.fillText(String(index + 1), badgeX, y + 1);

      // score
      context.fillStyle = "#49351f";
      context.font = "bold 17px Nunito";
      context.textAlign = "left";
      context.fillText(`${game.score} points`, rowX + 60, y);

      // time
      context.font = "16px Nunito";
      context.textAlign = "right";
      context.fillText(
        `${(game.time * 0.001).toFixed(1)}s`,
        rowX + rowWidth - 20,
        y,
      );

      context.restore();
    });

    context.restore();
  }

  drawPauseScreen(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.45)";
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = "#fff7e6";
    context.font = "bold 42px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Pause", this.game.width * 0.5, this.game.height * 0.25);
    context.restore();
  }
}
