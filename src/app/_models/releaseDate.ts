import {Game} from "./game";
import {Platform} from "./platform";

export class ReleaseDate {
  id: string = '';
  game: Game = new Game;
  platform: Platform = new Platform;
  date: number;
}
