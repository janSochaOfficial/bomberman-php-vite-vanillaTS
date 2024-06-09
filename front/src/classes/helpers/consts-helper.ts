
import { game_data, speeds_data, collision_data } from "../../types";
import { RequestService } from "../services/request-service";

export class ConstsHelper {
  static valuesReady: boolean = false;
  static game_data?: game_data;
  static collision_data?: collision_data; 
  static speeds_data?: speeds_data

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
