import { DrawHelper, RequestConvertHelper, WebsocketService } from "..";
import { findPlayerIndex } from "../../functions";
import { position } from "../../types";
import { BombObject, EnemyObject, LocalPlayerObject } from "../objects";
import { PlayerObject } from "../objects/player-object";
import { WallObject } from "../objects/wall-object";
import { PowerUpObject } from "./../objects/power-up-object";

export class GameService {
  private readonly drawHelper: DrawHelper;
  private readonly websocketService: WebsocketService;

  private walls: WallObject[];
  private gameInProgress: boolean;
  private lastTick: number = 0;
  private players: PlayerObject[];
  private ip: string = "-1";
  private localPlayer?: LocalPlayerObject;
  private enemies: EnemyObject[];
  private bombs: BombObject[] = [];
  private powerUps: PowerUpObject[];
  // private toDraw: IDrawable[] = [];
  constructor(drawHelper: DrawHelper) {
    this.drawHelper = drawHelper;
    this.websocketService = new WebsocketService(this.onServerMessage);
    this.walls = [];
    this.players = [];
    this.enemies = [];
    this.powerUps = [];
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
    this.walls = this.walls.filter((wall) => !wall.toDelete);

    this.walls.forEach((wall) => wall.draw(this.drawHelper, delta));
    this.powerUps.forEach((powerUp) => powerUp.draw(this.drawHelper, delta));
    this.enemies.forEach((enemy) => enemy.draw(this.drawHelper, delta));
    this.bombs.forEach((bomb) => bomb.draw(this.drawHelper, delta));
    
    this.players.forEach((player) => {
      player.walls = this.walls;
      player.bombs = this.bombs;
      player.draw(this.drawHelper, delta);
    });
  }

  private onServerMessage = (data: any) => {
    switch (data.action) {
      case "connect":
        const board = data.data.board;
        this.walls = RequestConvertHelper.Walls(board);
        this.ip = data.data.ip;
        break;
      case "tick":
        this.handleServerTick(data.data);
        break;
    }
  };

  private handleServerTick(data: any) {
    const { players, localPlayer } = RequestConvertHelper.Players(
      data.players,
      this.ip
    );
    this.players = players;
    if (localPlayer) this.changeLocalPLayer(localPlayer);
    this.enemies = RequestConvertHelper.Enemies(data.enemies);
    this.bombs = RequestConvertHelper.Bombs(data.bombs);
    this.powerUps = RequestConvertHelper.PowerUps(data.power_ups);
    this.handleWallsBroken(data.broken_walls);
  }

  private changeLocalPLayer(localPlayer: LocalPlayerObject) {
    if (
      this.localPlayer &&
      (this.localPlayer.position.x !== localPlayer.position.x ||
        this.localPlayer.position.y !== localPlayer.position.y)
    ) {
      this.updatePosition();
    }
    if (!this.localPlayer) {
      this.localPlayer = localPlayer;
      this.localPlayer.updatePosition = this.updatePosition;
      this.localPlayer.placeBomb = this.placeBomb;
    }
    const index = findPlayerIndex(this.players, this.ip);
    this.players[index] = this.localPlayer;
    this.localPlayer.walls = this.walls;
  }

  private updatePosition = () => {
    if (!this.localPlayer) return;
    this.websocketService.sendMessage({
      action: "position",
      data: {
        position: this.localPlayer.position,
        state: this.localPlayer.state,
        facing: this.localPlayer.facing,
        animation_timer: this.localPlayer.currentTimer,
      },
    });
  };

  private placeBomb = () => {
    if (!this.localPlayer) return;
    this.websocketService.sendMessage({
      action: "bomb",
      data: {
        position_data: {
          position: this.localPlayer.position,
          state: this.localPlayer.state,
          facing: this.localPlayer.facing,
          animation_timer: this.localPlayer.currentTimer,
        },
      },
    });
  };
  private handleWallsBroken(brokenWalls: position[]) {
    if (!brokenWalls.length) return;
    this.walls.forEach((wall) => {
      if (
        brokenWalls.find(
          (pos: position) =>
            wall.position.x === pos.x && wall.position.y === pos.y
        )
      )
        wall.broken = true;
    });
  }
}
