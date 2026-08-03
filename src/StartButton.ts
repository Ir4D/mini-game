import type Game from "./Game";

interface StartButtonOptions {
  label?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export default class StartButton {
  private readonly width: number;
  private readonly height: number;
  private x: number;
  private y: number;
  private pulse: number;
  private hovered: boolean;
  private label: string;

  constructor(game: Game, options: StartButtonOptions = {}) {
    this.width = options.width ?? 220;
    this.height = options.height ?? 70;
    this.x = options.x ?? game.width * 0.5 - this.width * 0.5;
    this.y = options.y ?? game.height * 0.68;
    this.pulse = 0;
    this.hovered = false;
    this.label = options.label ?? "Start Game";
  }

  update(deltaTime: number): void {
    this.pulse += deltaTime * 0.003;
  }

  setPointer(x: number, y: number): void {
    this.hovered = this.isClicked(x, y);
  }

  setLabel(label: string): void {
    this.label = label;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  draw(context: CanvasRenderingContext2D): void {
    const pulseScale = 1 + Math.sin(this.pulse) * 0.06;
    const hoverScale = this.hovered ? 0.04 : 0;
    const scaledWidth = this.width * (pulseScale + hoverScale);
    const scaledHeight = this.height * (pulseScale + hoverScale);
    const drawX = this.x + (this.width - scaledWidth) * 0.5;
    const drawY = this.y + (this.height - scaledHeight) * 0.5;

    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.25)";
    context.shadowBlur = 16;
    context.fillStyle = this.hovered ? "#ff9833" : "#ff7a00";
    context.strokeStyle = this.hovered ? "#9b3f00" : "#7a2b00";
    context.lineWidth = 4;

    context.beginPath();
    this.roundRectPath(context, drawX, drawY, scaledWidth, scaledHeight, 20);
    context.fill();
    context.stroke();

    context.shadowBlur = 0;
    context.fillStyle = "#fff7e6";
    context.font = "bold 28px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.label, this.x + this.width * 0.5, this.y + this.height * 0.5);
    context.restore();
  }

  isClicked(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  private roundRectPath(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    const r = Math.min(radius, width * 0.5, height * 0.5);

    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }
}
