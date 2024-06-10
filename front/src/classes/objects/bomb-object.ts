import { sprite_anim } from "../../data";
import { IDrawable } from "../../interfaces";
import { bomb_state, bomb_data, position } from "../../types";

import { ConstsHelper, DrawHelper } from "../helpers";

type facing = "center" | "up" | "down" | "left" | "right" | undefined;

export class BombObject implements IDrawable {
  public position: position;
  public timer: number;
  public state: bomb_state;
  public fireTiles: position[];

  constructor(bombData: bomb_data) {
    this.position = bombData.position;
    this.timer = bombData.timer;
    this.state = bombData.state;
    this.fireTiles = bombData.fire_tiles;
  }

  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    this.timer -= delta;

    if (this.state === "planted") {
      if (this.timer <= 0) {
        this.timer += ConstsHelper.game_data!.bomb_fire_timer;
      }
      drawer.drawAnimFrame(
        sprite_anim.bomb_idle,
        this.position,
        true,
        this.timer,
        1
      );
      return;
    }
    if (this.timer <= 0) {
      return;
    }
    for (let i = 0; i < this.fireTiles.length; i++) {
      drawer.drawAnimFrame(
        this.getExplosionAnimation(i),
        this.fireTiles[i],
        true,
        ConstsHelper.game_data!.bomb_fire_timer - this.timer,
        ConstsHelper.game_data!.bomb_fire_timer
      );
    }
  }

  getFireTileFacing(tile?: position): facing {
    if (!tile) return undefined;
    if (this.position.x < tile.x) return "right";
    if (this.position.x > tile.x) return "left";
    if (this.position.y < tile.y) return "down";
    if (this.position.y > tile.y) return "up";
    return "center";
  }

  getExplosionAnimation(tileId: number): sprite_anim {
    const facing = this.getFireTileFacing(this.fireTiles[tileId]);
    const isEdge =
      facing !== this.getFireTileFacing(this.fireTiles[tileId + 1]);

    if (facing === "up")
      return isEdge
        ? sprite_anim.bomb_explode_top_edge
        : sprite_anim.bomb_explode_top;
    if (facing === "down")
      return isEdge
        ? sprite_anim.bomb_explode_bottom_edge
        : sprite_anim.bomb_explode_bottom;
    if (facing === "left")
      return isEdge
        ? sprite_anim.bomb_explode_left_edge
        : sprite_anim.bomb_explode_left;
    if (facing === "right")
      return isEdge
        ? sprite_anim.bomb_explode_right_edge
        : sprite_anim.bomb_explode_right;
    return sprite_anim.bomb_explode_center;
  }
}
