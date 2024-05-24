import { ConstsHelper, DrawHelper, RequestService } from "..";
import { getRandomElementAndRemove } from "../../functions/get-random-element-and-remove";
import { sleep } from "../../functions/sleep";
import { position } from "../../types";
import { WallObject } from "../objects/wall-object";

export class GameService {
  public static readonly wallsToDraw = 80;

  private readonly drawHelper: DrawHelper;

  private walls: WallObject[];
  private gameInProgress: boolean;
  private currentTick: number;

  private lastCheck: number = 0;
  constructor(drawHelper: DrawHelper) {
    this.drawHelper = drawHelper;
    this.walls = [];
    this.gameInProgress = false;
    this.currentTick = 0;
    this.startGame();
  }


  public startGame() {
    const start = async () => {
      await this.prepareGame();
      this.gameInProgress = true;
      this.lastCheck = Date.now();
      while (this.gameInProgress) {
        const framerateLimiter = sleep(1000/120);
        this.tick();
        if(this.currentTick == 59){
          const framerate = 60 / ((Date.now() - this.lastCheck) / 1000);  
          this.lastCheck = Date.now();
          console.log(`framerate: ${framerate}`);
        }
  
        await framerateLimiter;
      }
    }
    start();
  }

  private async prepareGame() {
    const board = await RequestService.Get<{object: string}[][]>("index.php", {c:"game/generate"});
    for (let x = 0; x < ConstsHelper.game_data!.canvasWidth; x++){
      for (let y = 0; y < ConstsHelper.game_data!.canvasHeight; y++){
        if (board[y][x].object == "wall"){
          this.walls.push(new WallObject({x, y}, false));
        }else if (board[y][x].object === "wall_br"){
          this.walls.push(new WallObject({x, y}, true))
        }
      }
    }
  }

  private tick() {
    this.drawHelper.prepareBoard();
    this.walls.forEach((wall) => wall.draw(this.drawHelper, this.currentTick));
    this.currentTick++;
    this.currentTick %= 60;
    // console.log(this.currentTick);
  }
}
