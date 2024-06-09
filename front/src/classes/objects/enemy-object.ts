import { sprite_anim } from "../../data";
import { IDrawable } from "../../interfaces";
import { enemy_data, position } from "../../types";
import { DrawHelper } from "../helpers";

export type enemy_type = "bloon" | "ghost";

export class EnemyObject implements IDrawable {
  public position: position;
  public readonly enemyType: enemy_type;
  private currentTimer = 0;

  constructor(enemy_data: enemy_data) {
    this.position = enemy_data.position;
    this.enemyType = enemy_data.type;
  }
  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    this.currentTimer += delta;
    drawer.drawAnimFrame(
      sprite_anim.bloon_right,
      this.position,
      true,
      this.currentTimer,
      1
    );
  }
}
