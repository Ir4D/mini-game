import type Game from "./Game";
export default class InputHandler {
  keys: string[];
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Escape" ||
          e.key === "Enter" ||
          e.key === " " ||
          e.key === "Control") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      }

      if (e.key === "Enter" && !e.repeat) {
        this.game.handleEnter();
      } else if (e.key === "Escape" && !e.repeat) {
        this.game.handleEscape();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Escape" ||
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "Control"
      ) {
        const index = this.keys.indexOf(e.key);

        if (index !== -1) {
          this.keys.splice(index, 1);
        }
      }
    });
  }
}
