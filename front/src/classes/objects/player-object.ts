import { sprite_anim, sprite_names } from "../../data";
import { add_position } from "../../functions/add-positions";
import { calculateDistance } from "../../functions/calculate_distance";
import { IDrawable } from "../../interfaces";
import {
  player_data_type,
  player_facing,
  player_state,
  position,
} from "../../types";
import { ConstsHelper, DrawHelper, VectorHelper } from "../helpers";
import { WallObject } from "./wall-object";

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
  public currentTimer: number = 0;
  public facing: player_facing;
  public state: player_state;
  public walls?: WallObject[];

  constructor(player_data: player_data_type) {
    this.position = player_data.position;
    this.facing = player_data.facing;
    this.state = player_data.state;
    this.ip = player_data.socket_ip;
    this.currentTimer = player_data.animation_timer;
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

  protected tick(delta: number): void {
    // speed calculation
    if (this.state === "standing") return;
    const MAX_SPEED = ConstsHelper.speeds_data!.player;
    const speed = { x: 0, y: 0 } as position;
    if (this.facing === "left") {
      speed.x -= delta * MAX_SPEED;
    }
    if (this.facing === "right") {
      speed.x += delta * MAX_SPEED;
    }
    if (this.facing === "up") {
      speed.y -= delta * MAX_SPEED;
    }
    if (this.facing === "down") {
      speed.y += delta * MAX_SPEED;
    }

    this.calulateNewPosition(speed);
  }

  protected calulateNewPosition(speed: position) {
    const newPosition = VectorHelper.add(this.position, speed);
    const { distance_min, snap_max_distance } = ConstsHelper.collision_data!;
    let collisionDetected = false;

    if (this.walls) {
      for (const wall of this.walls) {
        let distance = VectorHelper.distance(wall.position, newPosition);

        if (distance < distance_min) {
          // chceck if player is near the edge using max_snap_distnce
          collisionDetected = true;
          const collisionVector = VectorHelper.subtract(
            newPosition,
            wall.position
          );

          // Normalize the collision vector
          const normalizedCollisionVector =
            VectorHelper.normalize(collisionVector);
          if (
            Math.abs(newPosition.x - wall.position.x) >
            (distance_min - snap_max_distance) / 2
          ) {
            // Push the player away from the wall
            newPosition.x +=
              normalizedCollisionVector.x * (distance_min - distance);
            collisionDetected = false;
          }
          if (
            Math.abs(newPosition.y - wall.position.y) >
            (distance_min - snap_max_distance) / 2
          ) {
            newPosition.y +=
              normalizedCollisionVector.y * (distance_min - distance);
            collisionDetected = false;
          }
        }

        // distance = calculateDistance(wall.position, newPosition);
      }
    }

    if (!collisionDetected) {
      this.position = newPosition;
    }
  }
}
