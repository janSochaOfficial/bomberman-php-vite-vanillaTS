
import { game_data, speeds_data, collision_data } from "../../types";
import { RequestService } from "../services/request-service";

export class ConstsHelper {
  static valuesReady: boolean = false;
  static game_data?: game_data;
  static collision_data?: collision_data; 
  static speeds_data?: speeds_data
  static readonly animation_data = {
    durations: {
      wall_break: 1,
      player_die: 3,
      enemy_die: 2,
    },
    timings: {
      player_move: 0.8
    }
  }
  constructor() {
    // this.initValues();
  }

  static async initValues() {
    this.game_data = await RequestService.Get("getConst.php", {
      const: "game.data",
    });
    this.collision_data = await RequestService.Get("getConst.php", {
      const: "game.collision",
    });
    this.speeds_data = await RequestService.Get("getConst.php", {
      const: "game.speeds",
    });

    this.valuesReady = true;
  }
}
