import Game from "./Game";

interface LastGame {
  time: number,
  score: number,
}

export default class GameStorage {
  game: Game;
  gameResults: Array<LastGame> = [];
  top5: Array<LastGame> = [];

  get topGames(): Array<LastGame> { return this.top5; }

  constructor(game: Game) {
    this.game = game;
    this.gameResults = [];
    this.top5 = [];
  }

  update(time: number, score: number) {
    const lastGame: LastGame = {
      time,
      score,
    }

    this.gameResults.push(lastGame);
    
    window.localStorage.setItem("gameResults", JSON.stringify(this.gameResults));
    const results: LastGame[] = JSON.parse(window.localStorage.getItem("gameResults") || "[]");
    this.top5 = results.sort((a, b) => b.score - a.score || a.time - b.time).slice(0, 5);
  }

}
