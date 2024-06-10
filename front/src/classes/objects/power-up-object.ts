import { sprite_names } from "../../data";
import { IDrawable } from "../../interfaces";
import { position, power_up_data } from "../../types";
import { DrawHelper } from "../helpers";

export class PowerUpObject implements IDrawable {
  public position: position;
  public type: "bomb_strength";
  constructor (power_up_data: power_up_data) {
    this.position = power_up_data.position;
    this.type = power_up_data.type;
  }
  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    drawer.drawSprite(sprite_names.bomb_strength_power_up, this.position);
  }
  
  
}