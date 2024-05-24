import { position } from "../../types";
import { ConstsHelper } from "./consts-helper";


export class positionHelper {
  static calcShetPostion(pos: position): position {
    return {
      x: pos.x * ConstsHelper.game_data!.tileSize,
      y: pos.y * ConstsHelper.game_data!.tileSize,
    };
  }

  static calcCanvasPostion(pos: position): position {
    return {
      x: pos.x * ConstsHelper.game_data!.tileSize * ConstsHelper.game_data!.canvasScale,
      y: pos.y * ConstsHelper.game_data!.tileSize * ConstsHelper.game_data!.canvasScale,
    };
  }
}
