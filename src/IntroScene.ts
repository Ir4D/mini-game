import Game from "./Game";
import Button from "./Button";

interface DuckCharacter {
  width:number, 
  height: number, 
  positionX: number; 
  positionY: number; 
  frameX: number; 
  speed: number;
  maxFrame: number;
  image: HTMLImageElement;
}

export default class IntroScene {
  game: Game;
  duckFamily: DuckCharacter[];
  private butterfly: { width:number, height: number, positionX: number; positionY: number; frameX: number; maxFrame: number };
  imageButterfly: HTMLImageElement;

  readonly fps: number;
  readonly frameInterval: number;
  frameTimer: number;

  private done = false;
  private showInstructions = false;
  private instructionsAlpha = 0;
  startButton: Button;
  imageBread: HTMLImageElement;

  constructor(game: Game) {
    this.game = game;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.imageBread = document.getElementById("bread") as HTMLImageElement;
    this.duckFamily = [
    {
      width: 100,
      height: 135,
      positionX: this.game.player.positionX + 160,
      positionY: this.game.ground,
      frameX: 0,
      speed: this.game.maxSpeed - 1,
      maxFrame: 15,
      image: this.getImage('mama'),
    },
    {
      width: 56,
      height: 70,
      positionX: this.game.player.positionX + 200,
      positionY: this.game.ground,
      frameX: 0,
      speed: this.game.maxSpeed - 0.95,
      maxFrame: 15,
      image: this.getImage('duckling1'),
    },
    {
      width: 60,
      height: 72,
      positionX: this.game.player.positionX + 120,
      positionY: this.game.ground,
      frameX: 0,
      speed: this.game.maxSpeed - 0.78,
      maxFrame: 15,
      image: this.getImage('duckling2'),
    },
    {
      width: 60,
      height: 72,
      positionX: this.game.player.positionX + 110,
      positionY: this.game.ground,
      frameX: 0,
      speed: this.game.maxSpeed - 0.95,
      maxFrame: 15,
      image: this.getImage('duckling2'),
    },
  ];

    this.butterfly = { width: 16, height: 16, positionX: game.player.positionX + game.player.width, positionY: game.player.positionY, frameX: 0, maxFrame: 4 };
    this.imageButterfly = this.getImage('butterfly');

    this.game.player.currentState = this.game.player.states[7];
    this.game.player.currentState.enter();

    this.startButton = new Button(this.game, {
      label: "Start Game",
      onClick: () => this.game.startGame(),
    });
  }

  draw(context: CanvasRenderingContext2D): void {
    if (!this.showInstructions) {
      this.drawHeading(context);
    }

    // duck family & butterfly
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
        duck.height
      )
    }
    context.drawImage(this.imageButterfly, this.butterfly.frameX * this.butterfly.width, 0, this.butterfly.width, this.butterfly.height, this.butterfly.positionX, this.butterfly.positionY - this.butterfly.height, this.butterfly.width, this.butterfly.height);

    
    if (this.showInstructions) {
      this.drawInstructions(context);
    }
  }

  update(deltaTime: number) {
    this.startButton.setPointer(this.game.pointerX, this.game.pointerY);
    this.startButton.update(deltaTime);

    if (!this.showInstructions) {
      for (const duck of this.duckFamily) {
        duck.positionX += duck.speed;
      }

      const wholeFamilyLeftScreen =
        this.duckFamily.every(
          duck =>
            duck.positionX >
            this.game.width + duck.width
        );

      if (wholeFamilyLeftScreen) {
        this.showInstructions = true;
      }
    }

    // instructions
    if (this.showInstructions) {
      this.instructionsAlpha = Math.min(
        1,
        this.instructionsAlpha + deltaTime * 0.002
      );

      if (this.game.input.keys.includes('Enter')) {
        this.done = true;
      }
    }

    // sprite animation
    if (this.frameTimer > this.frameInterval) {
      this.frameTimer = 0;

      for (const duck of this.duckFamily) {
        duck.frameX = duck.frameX < duck.maxFrame ? duck.frameX + 1 : 0;
      }

      this.butterfly.frameX = this.butterfly.frameX < this.butterfly.maxFrame ? this.butterfly.frameX + 1 : 0;

    } else {
      this.frameTimer += deltaTime;
    }

    this.game.player.update(this.game.input.keys, deltaTime);

    this.startButton.setLayout(
      "Start Game",
      this.game.width * 0.5 - 220 * 0.5,
      this.game.height * 0.8
    );
  }

  handlePointerMove(x: number, y: number): void {
    this.startButton.handlePointerMove(x, y);
  }

  handlePointerDown(x: number, y: number): boolean {
    return this.startButton.handlePointerDown(x, y);
  }

  isHoveringButton(): boolean {
    return this.startButton.isHovered();
  }

  private getImage(id: string): HTMLImageElement {
    const image = document.getElementById(id);

    if (!(image instanceof HTMLImageElement)) {
      throw new Error(`Image element with id "${id}" was not found`);
    }

    return image;
  }

  private drawHeading(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = 'rgba(255, 255, 255, 0.25)';
    context.fillRect(0, 0, this.game.width, this.game.height);
    context.fillStyle = '#49351f';
    context.font = 'bold 34px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const centerX = this.game.width * 0.5;
    const startY = this.game.height * 0.15;
    const lineHeight = 40;

    context.fillText(
      'Our little duckling got distracted by a butterfly…',
      centerX,
      startY
    );
    context.fillText(
      'Mom walked away with the other ducklings :(',
      centerX,
      startY + lineHeight
    );
    context.fillText(
      'Help the little one catch up!',
      centerX,
      startY + lineHeight * 2
    );
    context.restore();
  }

  private drawInstructions(context: CanvasRenderingContext2D): void {
    context.save();

    const panelWidth = 700;
    const panelHeight = 330;
    const panelX = this.game.width * 0.5 - panelWidth * 0.5;
    const panelY = this.game.height * 0.09;

    context.fillStyle = 'rgba(255, 248, 232, 0.94)';
    context.strokeStyle = '#6b4b2a';
    context.lineWidth = 4;

    context.beginPath();
    context.roundRect(
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      20
    );
    context.fill();
    context.stroke();

    context.fillStyle = '#49351f';
    context.font = 'bold 28px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(
      'Controls',
      this.game.width * 0.5,
      panelY + 35
    );

    const controls = [
      { key: '→', text: 'Move forward' },
      { key: '↑', text: 'Jump' },
      { key: '←', text: 'Move back' },
      { key: 'Space', text: 'Jump' },
      { key: '↓', text: 'Stop' },
      { key: 'Enter', text: 'Attack' },
    ];

    const columns = 2;
    const columnWidth = 260;
    const columnGap = 30;
    const rowHeight = 68;

    const controlsWidth =
      columnWidth * columns +
      columnGap * (columns - 1);

    const controlsStartX = this.game.width * 0.5 - controlsWidth * 0.5;

    const controlsStartY = panelY + 70;

    controls.forEach((control, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = controlsStartX + column * (columnWidth + columnGap);
      const y = controlsStartY + row * rowHeight;

      this.drawControlRow(
        context,
        x,
        y,
        control.key,
        control.text
      );
    });

    this.drawBreadRow(
      context,
      panelX + 80,
      panelY + 270
    );

    context.restore();

    this.startButton.draw(context);
  }

  private drawKeyCap(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string
  ): void {
    context.save();

    // shadow
    context.shadowColor = 'rgba(0,0,0,0.15)';
    context.shadowBlur = 4;
    context.shadowOffsetY = 2;

    // button fill
    context.fillStyle = '#fff8e8';
    context.strokeStyle = '#6b4b2a';
    context.lineWidth = 3;

    context.beginPath();
    context.roundRect(x, y, width, height, 10);
    context.fill();
    context.stroke();

    // label
    context.shadowColor = 'transparent';
    context.fillStyle = '#49351f';
    context.font = 'bold 20px Nunito';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, x + width * 0.5, y + height * 0.5);

    context.restore();
  }

  private drawControlRow(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    keyLabel: string,
    description: string
  ): void {
    const keyWidth =
      keyLabel.length > 3 ? 92 : 58;

    const keyHeight = 42;
    const gap = 16;

    this.drawKeyCap(
      context,
      x,
      y,
      keyWidth,
      keyHeight,
      keyLabel
    );

    context.save();

    context.fillStyle = '#49351f';
    context.font = '20px Nunito';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    context.fillText(
      description,
      x + keyWidth + gap,
      y + keyHeight * 0.5
    );

    context.restore();
  }

  private drawBreadRow(
    context: CanvasRenderingContext2D,
    x: number,
    y: number
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
      iconSize
    );

    context.save();
    context.fillStyle = '#49351f';
    context.font = '22px Nunito';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(
      'Collect 5 pieces of bread to win',
      x + textOffsetX,
      y + iconSize * 0.5
    );
    context.restore();
  }

  isDone(): boolean {
    return this.done;
  }
}