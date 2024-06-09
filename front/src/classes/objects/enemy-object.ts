import { sprite_anim } from "../../data";
import { IDrawable } from "../../interfaces";
import { enemy_data, position } from "../../types";
import { ConstsHelper, DrawHelper, VectorHelper } from "../helpers";

export type enemy_type = "bloon" | "ghost";

export class EnemyObject implements IDrawable {
  public position: position;
  private readonly path: position[];
  public readonly enemyType: enemy_type;
  private currentTimer = 0;

  constructor(enemy_data: enemy_data) {
    this.position = enemy_data.position;
    this.enemyType = enemy_data.type;
    this.path = enemy_data.path;
  }
  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    this.currentTimer += delta;
    this.tick(delta);
    drawer.drawAnimFrame(
      sprite_anim.bloon_right,
      this.position,
      true,
      this.currentTimer,
      1
    );
  }
  private tick(delta: number) {
    let speed: number = 1;
    if (this.enemyType === "bloon") {
      speed = ConstsHelper.speeds_data!.bloon;
    }
    let travelDistance: number = delta * speed;
    let newPos: position = this.position;
    let pathStep: number = 0;
    while (travelDistance > 0) {
      if (this.path[pathStep] === undefined) break;
      let distance: number = VectorHelper.distance(newPos, this.path[pathStep]);
      if (travelDistance > distance) {
        travelDistance -= distance;
        newPos = this.path[pathStep];
        pathStep++;
      } else {
        newPos = VectorHelper.add(
          newPos, // current position
          VectorHelper.multiplyBy(
            VectorHelper.subtract(this.path[pathStep], newPos), // Vector from current to next point
            travelDistance / distance // fraction of distance to travel
          )
        );
        travelDistance = 0;
      }
    }
    this.position = newPos;
    this.path.splice(0, pathStep);
  }
}
