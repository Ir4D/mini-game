import type Game from "./Game";

interface ButtonOptions {
  label: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  onClick?: () => void;
  
  color? : ButtonColor;
  size? : ButtonSize;
}

type ButtonColor = "primary" | "secondary";
type ButtonSize = "large" | "compact";

const BUTTON_SIZE_STYLES = {
  large: {
    width: 220,
    height: 70,
    fontSize: 28,
    radius: 20,
    shadowBlur: 16,
    pulseAmount: 0.06,
    pulseSpeed: 0.003,
    hoverScale: 0.04,
    pressScale: 0.03,
    lineWidth: 4,
    pressLineWidth: 5,
  },

  compact: {
    width: 80,
    height: 40,
    fontSize: 16,
    radius: 12,
    shadowBlur: 8,
    pulseAmount: 0.02,
    pulseSpeed: 0.002,
    hoverScale: 0.02,
    pressScale: 0.02,
    lineWidth: 3,
    pressLineWidth: 4,
  },
};

const BUTTON_COLOR_STYLES = {
  primary: {
    fill: "#ff7a00",
    fillHover: "#ff9833",
    fillPressed: "#d96a00",

    stroke: "#7a2b00",
    strokeHover: "#9b3f00",
    strokePressed: "#6e2300",

    text: "#fff7e6",
  },

  secondary: {
    fill: "#f4ecd8",
    fillHover: "#fff8e8",
    fillPressed: "#e8dcc3",

    stroke: "#6b4a2b",
    strokeHover: "#7a4b25",
    strokePressed: "#6b4a2b",

    text: "#4b3522",
  },
};

export default class Button {
  private readonly game: Game;
  private readonly width: number;
  private readonly height: number;
  private x: number;
  private y: number;
  private hovered: boolean;
  private pressed: boolean;
  private label: string;
  private readonly onClick?: () => void;
  private readonly color: ButtonColor;
  private readonly size: ButtonSize;

  get buttonWidth(): number { return this.width; }
  get buttonHeight(): number { return this.height; }

  constructor(game: Game, options: ButtonOptions) {
    this.game = game;
    this.size = options.size ?? "large";
    this.color = options.color ?? "primary";
    const sizeStyle = BUTTON_SIZE_STYLES[this.size];
    this.width = options.width ?? sizeStyle.width;
    this.height = options.height ?? sizeStyle.height;
    this.x = options.positionX ?? game.width * 0.5 - this.width * 0.5;
    this.y = options.positionY ?? game.height * 0.68;
    this.hovered = false;
    this.pressed = false;
    this.label = options.label;
    this.onClick = options.onClick;
  }

  setPointer(x: number, y: number): void {
    this.handlePointerMove(x, y);
  }

  setPressed(pressed: boolean): void {
    this.pressed = pressed;
  }

  setLabel(label: string): void {
    this.label = label;
  }

  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setLayout(label: string, x: number, y: number): void {
    this.label = label;
    this.x = x;
    this.y = y;
  }

  activate(): void {
    this.onClick?.();
  }

  handlePointerMove(x: number, y: number): void {
    this.hovered = this.isClicked(x, y);
    if (!this.hovered) {
      this.pressed = false;
    }
  }

  handlePointerDown(x: number, y: number): boolean {
    this.handlePointerMove(x, y);

    if (!this.hovered) {
      return false;
    }

    this.pressed = true;
    this.activate();
    return true;
  }

  draw(context: CanvasRenderingContext2D): void {
    const sizeStyle = BUTTON_SIZE_STYLES[this.size];
    const colorStyle = BUTTON_COLOR_STYLES[this.color];
    const pulseScale = 1 + Math.sin(this.game.animationTime * sizeStyle.pulseSpeed) * sizeStyle.pulseAmount;
    const hoverScale = this.hovered ? sizeStyle.hoverScale : 0;
    const pressScale = this.pressed ? sizeStyle.pressScale : 1;
    const finalScale = (pulseScale + hoverScale) * pressScale;
    const scaledWidth = this.width * finalScale;
    const scaledHeight = this.height * finalScale;
    const drawX = this.x + (this.width - scaledWidth) * 0.5;
    const drawY = this.y + (this.height - scaledHeight) * 0.5;

    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.25)";
    context.shadowBlur = sizeStyle.shadowBlur;
    context.fillStyle = this.pressed ? colorStyle.fillPressed : this.hovered ? colorStyle.fillHover : colorStyle.fill;
    context.strokeStyle = this.pressed ? colorStyle.strokePressed : this.hovered ? colorStyle.strokeHover : colorStyle.stroke;
    context.lineWidth = this.pressed ? sizeStyle.pressLineWidth : sizeStyle.lineWidth;

    context.beginPath();
    this.roundRectPath(context, drawX, drawY, scaledWidth, scaledHeight, sizeStyle.radius);
    context.fill();
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = colorStyle.text;
    context.font = `bold ${sizeStyle.fontSize}px Nunito`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(this.label, this.x + this.width * 0.5, this.y + this.height * 0.5);
    context.restore();
  }

  isClicked(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  isHovered(): boolean {
    return this.hovered;
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
