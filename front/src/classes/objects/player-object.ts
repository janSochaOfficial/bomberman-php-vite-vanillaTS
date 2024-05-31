import { sprite_anim, sprite_names } from "../../data";
import { IDrawable } from "../../interfaces";
import {
  player_data_type,
  player_facing,
  player_state,
  position,
} from "../../types";
import { DrawHelper } from "../helpers";

const facing_anim: { [key in player_facing]: sprite_anim } = {
  right: sprite_anim.player_right,
  left: sprite_anim.player_left,
  up: sprite_anim.player_up,
  down: sprite_anim.player_down,
};

const facing_sprite: { [key in player_facing]: sprite_names } = {
  right: sprite_names.player_right,
  left: sprite_names.player_left,
  up: sprite_names.player_up,
  down: sprite_names.player_down,
};

export class PlayerObject implements IDrawable {
  public position: position;
  public ip: string;
  private currentTimer: number = 0;
  public facing: player_facing;
  public state: player_state;
  constructor(player_data: player_data_type) {
    this.position = player_data.position;
    this.facing = player_data.facing;
    this.state = player_data.state;
    this.ip = player_data.socket_ip;
  }

  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    // if (this.state == "standing") {
    //   drawer.drawSprite(facing_sprite[this.facing], this.position);
    // } else {
    if (this.state == "walking") this.currentTimer += delta;
    drawer.drawAnimFrame(
      facing_anim[this.facing],
      this.position,
      true,
      this.currentTimer,
      0.8
    );
    // }
  }
}
