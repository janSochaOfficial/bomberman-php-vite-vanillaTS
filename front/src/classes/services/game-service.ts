import { ConstsHelper, DrawHelper, RequestConvertHelper, WebsocketService } from "..";
import { PlayerObject, player_data_type } from "../objects/player-object";
import { WallObject } from "../objects/wall-object";

export class GameService {
  private readonly drawHelper: DrawHelper;
  private readonly websocketService: WebsocketService;

  private walls: WallObject[];
  private gameInProgress: boolean;
  private lastTick: number = 0;
  private players: PlayerObject[];
  constructor(drawHelper: DrawHelper) {
    this.drawHelper = drawHelper;
    this.websocketService = new WebsocketService(this.onServerMessage);
    this.walls = [];
    this.players = [];
    this.gameInProgress = false;
    this.startGame();
  }

  public startGame() {
    this.gameInProgress = true;
    const gameLoop = (timestamp: number) => {
      if (this.lastTick === 0) {
        this.lastTick = timestamp;
        requestAnimationFrame(gameLoop);
        return;
      }
      const delta = (timestamp - this.lastTick) / 1000;
      this.tick(delta);

      if (this.gameInProgress) requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }

  private tick(delta: number) {
    this.drawHelper.prepareBoard();
    this.walls.forEach((wall) => wall.draw(this.drawHelper, delta));
    this.players.forEach((player) => player.draw(this.drawHelper, delta));
  }

  private onServerMessage = (data: any) => {
    switch (data.action) {
      case "board":
        const board = data.data.board;
        this.walls = RequestConvertHelper.Walls(board);
        break;
      case "tick":
        this.players = data.data.players.map((player_data: player_data_type) => {
          return new PlayerObject(player_data);
        });
        break;

    }
  };
}
