import Game from "./Game";
import Button from "./Button";

type IntroPhase =
  | "familyLeaving"
  | "storyFadingOut"
  | "instructionsFadingIn"
  | "waitingForStart";

interface DuckCharacter {
  width: number;
  height: number;
  positionX: number;
  positionY: number;
  frameX: number;
  speed: number;
  maxFrame: number;
  image: HTMLImageElement;
}

export default class IntroScene {
  game: Game;
  private phase: IntroPhase = "familyLeaving";
  private storyAlpha: number = 1;
  private instructionsAlpha: number = 0;
  private readonly fadeDuration: number = 700;
  duckFamily: DuckCharacter[];
  private butterfly: {
    image: HTMLImageElement;
    width: number;
    height: number;
    positionX: number;
    positionY: number;
    frameX: number;
    maxFrame: number;
  };
  readonly fps: number;
  readonly frameInterval: number;
  frameTimer: number;
  startButton: Button;
  imageBread: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.imageBread = this.getImage("bread");
    this.duckFamily = [
      {
        width: 100,
        height: 135,
        positionX: this.game.player.positionX + 160,
        positionY: this.game.ground,
        frameX: 0,
        speed: this.game.maxSpeed - 1,
        maxFrame: 15,
        image: this.getImage("mama"),
      },
      {
        width: 56,
        height: 70,
        positionX: this.game.player.positionX + 200,
        positionY: this.game.ground,
        frameX: 0,
        speed: this.game.maxSpeed - 0.95,
        maxFrame: 15,
        image: this.getImage("duckling1"),
      },
      {
        width: 60,
        height: 72,
        positionX: this.game.player.positionX + 120,
        positionY: this.game.ground,
        frameX: 0,
        speed: this.game.maxSpeed - 0.78,
        maxFrame: 15,
        image: this.getImage("duckling2"),
      },
      {
        width: 60,
        height: 72,
        positionX: this.game.player.positionX + 110,
        positionY: this.game.ground,
        frameX: 0,
        speed: this.game.maxSpeed - 0.95,
        maxFrame: 15,
        image: this.getImage("duckling2"),
      },
    ];

    this.butterfly = {
      image: this.getImage("butterfly"),
      width: 16,
      height: 16,
      positionX: game.player.positionX + game.player.width,
      positionY: game.player.positionY,
      frameX: 0,
      maxFrame: 4,
    };
    this.game.player.currentState = this.game.player.states[7];
    this.game.player.currentState.enter();
    this.startButton = new Button(this.game, {
      label: "Start Game",
      onClick: () => this.game.startGame(),
    });
  }

  draw(context: CanvasRenderingContext2D): void {
    context.fillStyle = "rgba(255, 255, 255, 0.25)";
    context.fillRect(0, 0, this.game.width, this.game.height);

    if (this.phase === "familyLeaving" || this.phase === "storyFadingOut") {
      this.drawStoryText(context);
    }

    this.drawCharacters(context);

    if (
      this.phase === "instructionsFadingIn" ||
      this.phase === "waitingForStart"
    ) {
      this.drawInstructions(context);
    }
  }

  update(deltaTime: number) {
    this.updateFamilyMovement();
    this.updateTransition(deltaTime);
    this.updateSpriteAnimation(deltaTime);

    this.game.player.update(this.game.input.keys, deltaTime);

    this.startButton.setLayout(
      "Start Game",
      this.game.width * 0.5 - 220 * 0.5,
      this.game.height * 0.8,
    );
    if (this.phase === "waitingForStart") {
      this.startButton.setPointer(this.game.pointerX, this.game.pointerY);
    }
  }

  handlePointerMove(x: number, y: number): void {
    if (this.phase !== "waitingForStart") return;
    this.startButton.handlePointerMove(x, y);
  }

  handlePointerDown(x: number, y: number): boolean {
    if (this.phase !== "waitingForStart") return false;
    return this.startButton.handlePointerDown(x, y);
  }

  isHoveringButton(): boolean {
    if (this.phase !== "waitingForStart") return false;
    return this.startButton.isHovered();
  }

  private getImage(id: string): HTMLImageElement {
    const image = document.getElementById(id);

    if (!(image instanceof HTMLImageElement)) {
      throw new Error(`Image element with id "${id}" was not found`);
    }

    return image;
  }

  private updateFamilyMovement(): void {
    if (this.phase !== "familyLeaving") return;

    for (const duck of this.duckFamily) {
      duck.positionX += duck.speed;
    }

    const wholeFamilyLeftScreen = this.duckFamily.every(
      (duck) => duck.positionX > this.game.width + duck.width,
    );

    if (wholeFamilyLeftScreen) {
      this.phase = "storyFadingOut";
    }
  }

  private updateSpriteAnimation(deltaTime: number): void {
    this.frameTimer += deltaTime;
    if (this.frameTimer < this.frameInterval) {
      return;
    }

    this.frameTimer -= this.frameInterval;
    for (const duck of this.duckFamily) {
      duck.frameX = duck.frameX < duck.maxFrame ? duck.frameX + 1 : 0;
    }
    this.butterfly.frameX =
      this.butterfly.frameX < this.butterfly.maxFrame
        ? this.butterfly.frameX + 1
        : 0;
  }

  private updateTransition(deltaTime: number): void {
    const alphaStep = deltaTime / this.fadeDuration;

    switch (this.phase) {
      case "familyLeaving":
        break;

      case "storyFadingOut":
        this.storyAlpha = Math.max(0, this.storyAlpha - alphaStep);
        if (this.storyAlpha <= 0) {
          this.storyAlpha = 0;
          this.phase = "instructionsFadingIn";
        }
        break;

      case "instructionsFadingIn":
        this.instructionsAlpha = Math.min(
          1,
          this.instructionsAlpha + alphaStep,
        );
        if (this.instructionsAlpha >= 1) {
          this.instructionsAlpha = 1;
          this.phase = "waitingForStart";
        }
        break;

      case "waitingForStart":
        break;
    }
  }

  private drawCharacters(context: CanvasRenderingContext2D): void {
    this.game.player.draw(context);

    for (const duck of this.duckFamily) {
      context.drawImage(
        duck.image,
        duck.frameX * duck.width,
        0,
        duck.width,
        duck.height,
        duck.positionX,
        duck.positionY - duck.height,
        duck.width,
        duck.height,
      );
    }
    context.drawImage(
      this.butterfly.image,
      this.butterfly.frameX * this.butterfly.width,
      0,
      this.butterfly.width,
      this.butterfly.height,
      this.butterfly.positionX,
      this.butterfly.positionY - this.butterfly.height,
      this.butterfly.width,
      this.butterfly.height,
    );
  }

  private drawStoryText(context: CanvasRenderingContext2D): void {
    if (this.storyAlpha <= 0) return;
    context.save();
    context.globalAlpha = this.storyAlpha;
    context.fillStyle = "#49351f";
    context.font = "bold 34px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const centerX = this.game.width * 0.5;
    const startY = this.game.height * 0.15;
    const lineHeight = 40;

    context.fillText(
      "Our little duckling got distracted by a butterfly…",
      centerX,
      startY,
    );
    context.fillText(
      "Mom walked away with the other ducklings :(",
      centerX,
      startY + lineHeight,
    );
    context.fillText(
      "Help the little one catch up!",
      centerX,
      startY + lineHeight * 2,
    );
    context.restore();
  }

  private drawInstructions(context: CanvasRenderingContext2D): void {
    if (this.instructionsAlpha <= 0) return;

    context.save();
    context.globalAlpha = this.instructionsAlpha;
    const panelWidth = 700;
    const panelHeight = 330;
    const panelX = this.game.width * 0.5 - panelWidth * 0.5;
    const panelY = this.game.height * 0.09;
    context.fillStyle = "rgba(255, 248, 232, 0.94)";
    context.strokeStyle = "#6b4b2a";
    context.lineWidth = 4;
    context.beginPath();
    context.roundRect(panelX, panelY, panelWidth, panelHeight, 20);
    context.fill();
    context.stroke();
    context.fillStyle = "#49351f";
    context.font = "bold 28px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Controls", this.game.width * 0.5, panelY + 35);

    const controls = [
      { key: "→", text: "Move forward" },
      { key: "↑", text: "Jump" },
      { key: "←", text: "Move back" },
      { key: "Space", text: "Jump" },
      { key: "↓", text: "Stop" },
      { key: "Ctrl", text: "Attack" },
    ];

    const columns = 2;
    const columnWidth = 260;
    const columnGap = 30;
    const rowHeight = 68;
    const controlsWidth = columnWidth * columns + columnGap * (columns - 1);
    const controlsStartX = this.game.width * 0.5 - controlsWidth * 0.5;
    const controlsStartY = panelY + 70;

    controls.forEach((control, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = controlsStartX + column * (columnWidth + columnGap);
      const y = controlsStartY + row * rowHeight;
      this.drawControlRow(context, x, y, control.key, control.text);
    });

    this.drawBreadRow(context, panelX + 80, panelY + 270);
    this.startButton.draw(context);
    context.restore();
  }

  private drawKeyCap(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
  ): void {
    context.save();
    context.shadowColor = "rgba(0,0,0,0.15)";
    context.shadowBlur = 4;
    context.shadowOffsetY = 2;
    context.fillStyle = "#fff8e8";
    context.strokeStyle = "#6b4b2a";
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(x, y, width, height, 10);
    context.fill();
    context.stroke();
    context.shadowColor = "transparent";
    context.fillStyle = "#49351f";
    context.font = "bold 20px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(label, x + width * 0.5, y + height * 0.5);
    context.restore();
  }

  private drawControlRow(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    keyLabel: string,
    description: string,
  ): void {
    const keyWidth = keyLabel.length > 3 ? 92 : 58;
    const keyHeight = 42;
    const gap = 16;

    this.drawKeyCap(context, x, y, keyWidth, keyHeight, keyLabel);

    context.save();
    context.fillStyle = "#49351f";
    context.font = "20px Nunito";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillText(description, x + keyWidth + gap, y + keyHeight * 0.5);
    context.restore();
  }

  private drawBreadRow(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
  ): void {
    const iconSize = 42;
    const textOffsetX = 100;

    context.drawImage(
      this.imageBread,
      0,
      0,
      this.imageBread.width,
      this.imageBread.height,
      x + 16,
      y,
      iconSize,
      iconSize,
    );

    context.save();
    context.fillStyle = "#49351f";
    context.font = "22px Nunito";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillText(
      "Collect 5 pieces of bread to win",
      x + textOffsetX,
      y + iconSize * 0.5,
    );
    context.restore();
  }
}
