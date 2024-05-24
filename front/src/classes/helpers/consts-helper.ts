
import { game_data } from "../../types";
import { RequestService } from "../services/request-service";

export class ConstsHelper {
  static valuesReady: boolean = false;
  static game_data?: game_data;

  constructor() {
    // this.initValues();
  }

  static async initValues() {
    this.game_data = await RequestService.Get("getConst.php", {
      const: "game.data",
    });
    this.valuesReady = true;
  }
}
