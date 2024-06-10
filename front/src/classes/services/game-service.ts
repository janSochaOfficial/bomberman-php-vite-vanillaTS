import { DrawHelper, RequestConvertHelper, WebsocketService } from "..";
import { findPlayerIndex } from "../../functions";
import { IAnimation } from "../../interfaces";
import { position } from "../../types";
import { BombObject, EnemyObject, LocalPlayerObject } from "../objects";
import { PlayerObject } from "../objects/player-object";
import { WallObject } from "../objects/wall-object";
import { PowerUpObject } from "./../objects/power-up-object";
import { VectorHelper } from './../helpers/vector-helper';

export class GameService {
  private readonly drawHelper: DrawHelper;
  private readonly websocketService: WebsocketService;

  public walls: WallObject[];
  public players: PlayerObject[];
  public bombs: BombObject[] = [];
  public powerUps: PowerUpObject[];
  public enemies: EnemyObject[];

  public animations: IAnimation[];

  private gameInProgress: boolean;
  private lastTick: number = 0;
  private ip: string = "-1";
  private localPlayer?: LocalPlayerObject;

  constructor(drawHelper: DrawHelper) {
    this.drawHelper = drawHelper;
    this.websocketService = new WebsocketService(this.onServerMessage);
    this.walls = [];
    this.players = [];
    this.enemies = [];
    this.powerUps = [];
    this.animations = [];
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
      player.game = this;
      player.draw(this.drawHelper, delta);
    });

    this.animations.forEach((animation) => {
      animation.draw(this.drawHelper, delta);
    });

    this.animations = this.animations.filter(
      (animation) => !animation.isDone()
    );
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
    this.handlePlayersDied(data.players_died);
    this.hanleEnemiesDied(data.enemies_died);
  }

  private changeLocalPLayer(localPlayer: LocalPlayerObject) {
    if (
      this.localPlayer &&
      (VectorHelper.distance(localPlayer.position, this.localPlayer.position) > 0.1)
    ) {
      // this.updatePosition();
    }
    if (!this.localPlayer) {
      this.localPlayer = localPlayer;
      this.localPlayer.game = this;
      this.localPlayer.updatePosition = this.updatePosition;
      this.localPlayer.placeBomb = this.placeBomb;
    }
    const index = findPlayerIndex(this.players, this.ip);
    this.players[index] = this.localPlayer;
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
  private handlePlayersDied(indexes: number[]) {
    if (!indexes.length) return;
    indexes.forEach((index) => {
      this.players[index].die();
      this.animations.push(this.players[index]);
      this.animations.splice(index, 1);
    });
  }

  private hanleEnemiesDied(indexes: number[]) {
    if (!indexes.length) return;
    indexes.forEach((index) => {
      this.enemies[index].die();
      this.animations.push(this.enemies[index]);
      console.log(this.enemies[index]);
      this.animations.splice(index, 1);
    });
  }
}
