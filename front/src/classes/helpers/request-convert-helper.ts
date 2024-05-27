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
}
