import { bomb_data, enemy_data, player_data_type, power_up_data } from "../../types";
import { BombObject, EnemyObject, LocalPlayerObject } from "../objects";
import { PlayerObject } from "../objects/player-object";
import { PowerUpObject } from "../objects/power-up-object";
import { WallObject } from "../objects/wall-object";
import { ConstsHelper } from "./consts-helper";

export type board_type = {
  object: string;
}[][];
export class RequestConvertHelper {
  public static Walls(board: board_type): WallObject[] {
    const walls: WallObject[] = [];
    for (let x = 0; x < ConstsHelper.game_data!.canvasWidth; x++) {
      for (let y = 0; y < ConstsHelper.game_data!.canvasHeight; y++) {
        if (board[y][x].object == "wall") {
          walls.push(new WallObject({ x, y }, false));
        } else if (board[y][x].object === "wall_br") {
          walls.push(new WallObject({ x, y }, true));
        }
      }
    }
    return walls;
  }

  public static Players(players: player_data_type[], ip: string) {
    let localPlayer;
    const playersMapped = players.map(
      (player_data: player_data_type) => {
        if (player_data.socket_ip === ip) {
          localPlayer = new LocalPlayerObject(player_data);
          return localPlayer;
        }
        return new PlayerObject(player_data);
      }
    );

    return {
      players: playersMapped,
      localPlayer,
    };
  }

  public static Enemies(enemies: enemy_data[]) {
    return enemies.map((enemy_data: enemy_data) => {
      return new EnemyObject(enemy_data);
    });
  }

  public static Bombs(bombs: bomb_data[]) {
    return bombs.map((bomb_data: bomb_data) => {
      return new BombObject(bomb_data);
    });
  }

  public static PowerUps(powerUps: power_up_data[]) {
    return powerUps.map((powerUp_data: power_up_data) => {
      return new PowerUpObject(powerUp_data);
    });
  }  
}
