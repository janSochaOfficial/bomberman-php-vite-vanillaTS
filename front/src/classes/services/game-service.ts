import { ConstsHelper, DrawHelper, RequestService, WebsocketService } from "..";
import { sprite_names } from "../../data";
import { getRandomElementAndRemove } from "../../functions/get-random-element-and-remove";
import { sleep } from "../../functions/sleep";
import { IDrawable } from "../../interfaces/i-drawable";
import { position } from "../../types";
import { WallObject } from "../objects/wall-object";

export class GameService {
  private readonly drawHelper: DrawHelper;
  private readonly websocketService: WebsocketService;

  private walls: WallObject[];
  private gameInProgress: boolean;
  private currentTick: number;
  private lastCheck: number = 0;
  private players: IDrawable[];
  constructor(drawHelper: DrawHelper) {
    this.drawHelper = drawHelper;
    this.websocketService = new WebsocketService(this.onServerMessage);
    this.walls = [];
    this.players = [];
    this.gameInProgress = false;
    this.currentTick = 0;
    this.startGame();
  }


  public startGame() {
    const start = async () => {
      // await this.prepareGame();
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

  private tick() {
    this.drawHelper.prepareBoard();
    this.walls.forEach((wall) => wall.draw(this.drawHelper, this.currentTick));
    this.players.forEach((player) => player.draw(this.drawHelper, this.currentTick));


    this.currentTick++;
    this.currentTick %= 60;
    // console.log(this.currentTick);
  }

  private onServerMessage = (data: any) => {
    if (data.action == "tick"){
      console.log(data);
      const board = data.data.board;
      const walls: WallObject[] = []
      for (let x = 0; x < ConstsHelper.game_data!.canvasWidth; x++){
        for (let y = 0; y < ConstsHelper.game_data!.canvasHeight; y++){
          if (board[y][x].object == "wall"){
            walls.push(new WallObject({x, y}, false));
          }else if (board[y][x].object === "wall_br"){
            walls.push(new WallObject({x, y}, true))
          }
        }
      }
      this.walls = walls

      this.players = data.data.players.map((el: {position: position}) => {
        return {
          draw: (drawer: DrawHelper, tick: number) => {
            drawer.drawSprite(sprite_names.player_base, el.position, false)
          }
        }
      })
    }
  }
}
