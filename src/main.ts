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

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    game.handlePointerMove(x, y);
  });

  canvas.addEventListener("mousedown", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    game.handlePointerDown(x, y);
  });

  let lastTime = 0;

  function animate(timeStamp: number): void {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    context.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(context);

    canvas.style.cursor = game.isHoveringStartButton() ? "pointer" : "default";
    requestAnimationFrame(animate);
  }
  animate(0);
});
