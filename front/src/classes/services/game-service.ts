import {
  ConstsHelper,
  DrawHelper,
  RequestConvertHelper,
  WebsocketService,
} from "..";
import { findPlayerIndex } from "../../functions";
import { player_data_type } from "../../types";
import { LocalPlayerObject } from "../objects";
import { PlayerObject } from "../objects/player-object";
import { WallObject } from "../objects/wall-object";

export class GameService {
  private readonly drawHelper: DrawHelper;
  private readonly websocketService: WebsocketService;

  private walls: WallObject[];
  private gameInProgress: boolean;
  private lastTick: number = 0;
  private players: PlayerObject[];
  private ip: string = "-1";
  private localPlayer?: LocalPlayerObject;
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
      this.lastTick = timestamp;

      if (this.gameInProgress) requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }

  private tick(delta: number) {
    this.drawHelper.prepareBoard();
    this.walls.forEach((wall) => wall.draw(this.drawHelper, delta));
    this.players.forEach((player) => player.draw(this.drawHelper, delta));
    // if (this.localPlayer) this.localPlayer.position.x += 1 * delta;
  }

  private onServerMessage = (data: any) => {
    switch (data.action) {
      case "connect":
        const board = data.data.board;
        this.walls = RequestConvertHelper.Walls(board);
        this.ip = data.data.ip;
        break;
      case "tick":
        const { players, localPlayer } = RequestConvertHelper.Players(
          data.data.players,
          this.ip
        );
        this.players = players;
        if (localPlayer) this.changeLocalPLayer(localPlayer);
        // console.log(this.players[id] === localPlayer);
        break;
    }
  };

  private changeLocalPLayer(localPlayer: LocalPlayerObject) {
    if (
      this.localPlayer &&
      (this.localPlayer.position.x !== localPlayer.position.x ||
        this.localPlayer.position.y !== localPlayer.position.y)
    ) {
      this.websocketService.sendMessage({
        action: "position",
        data: {
          position: this.localPlayer.position,
          state: this.localPlayer.state,
          facing: this.localPlayer.facing,
        },
      });
    }
    if (!this.localPlayer){
      this.localPlayer = localPlayer;
    }
    const index = findPlayerIndex(this.players, this.ip);
    this.players[index] = this.localPlayer;
    this.localPlayer.walls = this.walls;
  }
}
