export class FloatingMessages {
  value: string;
  positionX: number;
  positionY: number;
  targetX: number;
  targetY: number;
  markedForDeletion: boolean;
  timer: number;

  constructor(value: string, positionX: number, positionY: number, targetX: number, targetY: number) {
    this.value = value;
    this.positionX = positionX;
    this.positionY = positionY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.markedForDeletion = false;
    this.timer = 0
  }

  update(): void {
    this.positionX += (this.targetX - this.positionX) * 0.05;
    this.positionY += (this.targetY - this.positionY) * 0.05;
    this.timer++;
    if (this.timer > 100) this.markedForDeletion = true;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.font = '20px Nunito';
    context.fillStyle = 'white';
    context.fillText(this.value, this.positionX, this.positionY);
    context.fillStyle = 'black';
    context.fillText(this.value, this.positionX - 1, this.positionY - 1);
  }
}