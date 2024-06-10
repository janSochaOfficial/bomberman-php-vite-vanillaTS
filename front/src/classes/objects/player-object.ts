import { sprite_anim } from "../../data";
import { IAnimation, IDrawable } from "../../interfaces";
import {
  player_data_type,
  player_facing,
  player_state,
  position,
} from "../../types";
import { ConstsHelper, DrawHelper, VectorHelper } from "../helpers";
import { GameService } from "../services";
import { BombObject } from "./bomb-object";

const facing_anim: { [key in player_facing]: sprite_anim } = {
  right: sprite_anim.player_right,
  left: sprite_anim.player_left,
  up: sprite_anim.player_up,
  down: sprite_anim.player_down,
};

export class PlayerObject implements IDrawable, IAnimation {
  public position: position;
  public ip: string;
  public currentTimer: number = 0;
  public facing: player_facing;
  public state: player_state;
  public game?: GameService;
  public isDead: boolean = false;

  constructor(player_data: player_data_type) {
    this.position = player_data.position;
    this.facing = player_data.facing;
    this.state = player_data.state;
    this.ip = player_data.socket_ip;
    this.currentTimer = player_data.animation_timer;
  }

  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    if (this.isDead) {
      this.currentTimer += delta;
      drawer.drawAnimFrame(
        sprite_anim.player_die,
        this.position,
        true,
        this.currentTimer,
        ConstsHelper.animation_data.durations.player_die
      );
      return;
    }

    if (this.state == "walking") this.currentTimer += delta;
    drawer.drawAnimFrame(
      facing_anim[this.facing],
      this.position,
      true,
      this.currentTimer,
      ConstsHelper.animation_data.timings.player_move
    );
  }

  protected tick(delta: number): void {
    if (this.isDead) return;
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
    if (this.isDead) return;
    const newPosition = VectorHelper.add(this.position, speed);
    const { distance_min, snap_max_distance } = ConstsHelper.collision_data!;
    let collisionDetected = false;

    const obstacles: { position: position }[] = [];
    if (this.game?.walls) obstacles.push(...this.game.walls);
    if (this.game?.bombs)
      obstacles.push(
        ...this.game.bombs.filter(
          (bomb: BombObject) =>
            VectorHelper.distance(this.position, bomb.position) > 0.8 &&
            bomb.state === "planted"
        )
      );
    if (this.game?.players) {
      obstacles.push(
        ...this.game.players.filter(
          (player: PlayerObject) =>
            player.ip !== this.ip &&
            VectorHelper.distance(this.position, player.position) > 0.8
        )
      );
    }

    for (const obstacle of obstacles) {
      let distance = VectorHelper.distance(obstacle.position, newPosition);

      if (distance < distance_min) {
        // chceck if player is near the edge using max_snap_distnce
        collisionDetected = true;
        const collisionVector = VectorHelper.subtract(
          newPosition,
          obstacle.position
        );

        // Normalize the collision vector
        const normalizedCollisionVector =
          VectorHelper.normalize(collisionVector);
        if (
          Math.abs(newPosition.x - obstacle.position.x) >
          (distance_min - snap_max_distance) / 2
        ) {
          // Push the player away from the wall
          newPosition.x +=
            normalizedCollisionVector.x * (distance_min - distance);
          collisionDetected = false;
        }
        if (
          Math.abs(newPosition.y - obstacle.position.y) >
          (distance_min - snap_max_distance) / 2
        ) {
          newPosition.y +=
            normalizedCollisionVector.y * (distance_min - distance);
          collisionDetected = false;
        }
      }

      // distance = calculateDistance(wall.position, newPosition);
    }

    if (!collisionDetected) {
      this.position = newPosition;
    }
  }

  public die() {
    this.isDead = true;
    this.currentTimer = 0;
    return this;
  }

  public isDone(): boolean {
    return (this.isDead && this.currentTimer > ConstsHelper.animation_data.durations.player_die);    
  }
}
