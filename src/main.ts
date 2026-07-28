import Game from "./Game";
import {getRequiredElement, getCanvasContext} from "./utils/dom";

window.addEventListener('load', function() {
  const canvas = getRequiredElement("canvas", HTMLCanvasElement);

  const context = getCanvasContext(canvas);

  canvas.width = 1000;
  canvas.height = 500;

  const game = new Game({
    width: canvas.width,
    height: canvas.height,
  });

  let lastTime = 0;

  function animate(timeStamp: number): void {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(context);
    requestAnimationFrame(animate);
  }
  animate(0);
});
