import type Game from "./Game";
export default class InputHandler {
  keys: string[];

  constructor(_game: Game) {
    this.keys = [];

    window.addEventListener('keydown', e => {
      if (( e.key === 'ArrowDown' || 
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Enter' ||
            e.key === " "
        ) && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
      }
    });

    window.addEventListener('keyup', e => {
      if (  e.key === 'ArrowDown' || 
            e.key === 'ArrowUp' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Enter' ||
            e.key === " "
        ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}