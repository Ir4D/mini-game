import type Game from "./Game";

class Layer {
  game: Game;
  width: number;
  height: number;
  speedModifier: number;
  image: HTMLImageElement;
  positionX: number;
  positionY: number;

  constructor(game: Game, width: number, height: number, speedModifier: number, image: HTMLImageElement) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.positionX = 0;
    this.positionY = 0;
  }

  update(): void {
    if (this.positionX < -this.width) this.positionX = 0;
    else this.positionX -= this.game.speed * this.speedModifier;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.image, this.positionX, this.positionY, this.width, this.height);
    context.drawImage(this.image, this.positionX + this.width, this.positionY, this.width, this.height);
  }
}

export class Background {
  game: Game;
  width: number;
  height: number;
  layer1image: HTMLImageElement;
  layer2image: HTMLImageElement;
  layer3image: HTMLImageElement;
  layer4image: HTMLImageElement;
  layer1: Layer;
  layer2: Layer;
  layer3: Layer;
  layer4: Layer;
  backgroundLayers: Layer[];

  constructor(game: Game) {
    this.game = game;
    this.width = 1000;
    this.height = 500;
    this.layer1image = document.getElementById("layer1") as HTMLImageElement;
    this.layer2image = document.getElementById("layer2") as HTMLImageElement;
    this.layer3image = document.getElementById("layer3") as HTMLImageElement;
    this.layer4image = document.getElementById("layer4") as HTMLImageElement;
    this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image);
    this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image);
    this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image);
    this.layer4 = new Layer(this.game, this.width, this.height, 0.7, this.layer4image);
    this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4];
  }

  update(): void {
    this.backgroundLayers.forEach(layer => {
      layer.update();
    });
  }

  draw(context: CanvasRenderingContext2D): void {
    this.backgroundLayers.forEach(layer => {
      layer.draw(context);
    });
  }
}

