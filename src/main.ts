import Game from "./Game";
import {getRequiredElement, getCanvasContext} from "./utils/dom";

window.addEventListener('load', function() {
  const canvas = getRequiredElement("canvas", HTMLCanvasElement);

  const context = getCanvasContext(canvas);

  canvas.width = 500;
  canvas.height = 500;

  const game = new Game({
    width: canvas.width,
    height: canvas.height,
  });

  function animate(): void {
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(context);
    requestAnimationFrame(animate);
  }
  animate();
});
