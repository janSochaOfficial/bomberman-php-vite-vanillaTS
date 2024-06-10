import { player_data_type, position } from "../../types";
import { ConstsHelper, DrawHelper } from "../helpers";
import { PlayerObject } from "./player-object";

export class LocalPlayerObject extends PlayerObject {
  public pressedKeys: Set<string> = new Set();
  public updatePosition?: () => void;
  public placeBomb?: () => void;
  constructor(player_data: player_data_type) {
    super(player_data);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.pressedKeys.add(event.key);
    if (event.key === " ") {
      this.placeBomb?.();
      return;
    }
    if (this.pressedKeys.has("a") || this.pressedKeys.has("ArrowLeft")) {
      this.facing = "left";
    }
    if (this.pressedKeys.has("d") || this.pressedKeys.has("ArrowRight")) {
      this.facing = "right";
    }
    if (this.pressedKeys.has("w") || this.pressedKeys.has("ArrowUp")) {
      this.facing = "up";
    }
    if (this.pressedKeys.has("s") || this.pressedKeys.has("ArrowDown")) {
      this.facing = "down";
    }

    this.state = "walking";
    if (this.updatePosition) this.updatePosition();
  };
  private handleKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
    if (
      !(
        this.pressedKeys.has("a") ||
        this.pressedKeys.has("ArrowLeft") ||
        this.pressedKeys.has("d") ||
        this.pressedKeys.has("ArrowRight") ||
        this.pressedKeys.has("w") ||
        this.pressedKeys.has("ArrowUp") ||
        this.pressedKeys.has("s") ||
        this.pressedKeys.has("ArrowDown")
      )
    ) {
      this.state = "standing";
    }
    if (this.updatePosition) this.updatePosition();
  };

  public async draw(drawer: DrawHelper, delta: number): Promise<void> {
    this.tick(delta);
    super.draw(drawer, delta);
  }
  public copyFrom(localPlayer: LocalPlayerObject) {
    this.position = localPlayer.position;
    this.pressedKeys = localPlayer.pressedKeys;
  }

  protected tick(delta: number): void {
    // speed calculation
    const MAX_SPEED = ConstsHelper.speeds_data!.player;
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

    this.calulateNewPosition(speed);
  }
}
