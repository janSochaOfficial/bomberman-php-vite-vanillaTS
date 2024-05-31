import { add_position } from "../../functions/add-positions";
import { calculateDistance } from "../../functions/calculate_distance";
import { player_data_type, position } from "../../types";
import { ConstsHelper, DrawHelper } from "../helpers";
import { PlayerObject } from "./player-object";
import { WallObject } from "./wall-object";

const MAX_SPEED = 5;

export class LocalPlayerObject extends PlayerObject {
  public pressedKeys: Set<string> = new Set();
  public walls?: WallObject[];

  constructor(player_data: player_data_type) {
    super(player_data);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.pressedKeys.add(event.key);
    this.state = "walking";
  };
  private handleKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
    if (!(
      this.pressedKeys.has("a") || this.pressedKeys.has("ArrowLeft") ||
      this.pressedKeys.has("d") || this.pressedKeys.has("ArrowRight") ||
      this.pressedKeys.has("w") || this.pressedKeys.has("ArrowUp") ||
      this.pressedKeys.has("s") || this.pressedKeys.has("ArrowDown")
    )){
      this.state = "standing";
    }
  };

  public async draw(drawer: DrawHelper, delta: number): Promise<void> {
    this.tick(delta);
    super.draw(drawer, delta);
  }
  public copyFrom(localPlayer: LocalPlayerObject) {
    this.position = localPlayer.position;
    this.pressedKeys = localPlayer.pressedKeys;
  }

  private tick(delta: number): void {
    // speed calculation
    const speed = { x: 0, y: 0 } as position;
    if (this.pressedKeys.has("a") || this.pressedKeys.has("ArrowLeft")) {
      this.facing = "left";
      speed.x -= delta * MAX_SPEED;
    }
    if (this.pressedKeys.has("d") || this.pressedKeys.has("ArrowRight")) {
      this.facing = "right";
      speed.x += delta * MAX_SPEED;
    }
    if (this.pressedKeys.has("w") || this.pressedKeys.has("ArrowUp")) {
      this.facing = "up";
      speed.y -= delta * MAX_SPEED;
    }
    if (this.pressedKeys.has("s") || this.pressedKeys.has("ArrowDown")) {
      this.facing = "down";
      speed.y += delta * MAX_SPEED;
    }

    const newPosition = add_position(this.position, speed);
    const { distance_min, snap_max_distance, snap_shift } =
      ConstsHelper.collision_data!;

    let collisionDetected = false;

    if (this.walls) {
      for (const wall of this.walls) {
        let distance = calculateDistance(wall.position, newPosition);

        if (distance < distance_min) {
          // chceck if player is near the edge using max_snap_distnce
          collisionDetected = true;
          const collisionVector = {
            x: newPosition.x - wall.position.x,
            y: newPosition.y - wall.position.y,
          };
          
          // Normalize the collision vector
          const magnitude = Math.sqrt(
            collisionVector.x ** 2 + collisionVector.y ** 2
          );
          const normalizedCollisionVector = {
            x: collisionVector.x / magnitude,
            y: collisionVector.y / magnitude,
          };
          if (Math.abs(newPosition.x - wall.position.x) > (distance_min - snap_max_distance) / 2){
            console.log("dst1", newPosition);
            
            // Push the player away from the wall
            newPosition.x +=
            normalizedCollisionVector.x * (distance_min - distance);
            collisionDetected = false
            
          }
          if (Math.abs(newPosition.y - wall.position.y) > (distance_min - snap_max_distance) / 2){
            newPosition.y +=
            normalizedCollisionVector.y * (distance_min - distance);
            collisionDetected = false

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
