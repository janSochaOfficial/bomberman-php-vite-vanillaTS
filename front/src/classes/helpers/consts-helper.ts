
import { game_data } from "../../types";
import { collision_data } from "../../types/collision_data";
import { RequestService } from "../services/request-service";

export class ConstsHelper {
  static valuesReady: boolean = false;
  static game_data?: game_data;
  static collision_data?: collision_data; 

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

    
    this.valuesReady = true;
  }
}
