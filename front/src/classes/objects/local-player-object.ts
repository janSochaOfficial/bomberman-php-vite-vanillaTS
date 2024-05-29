import { add_position } from "../../functions/add-positions";
import { player_data_type, position } from "../../types";
import { DrawHelper } from "../helpers";
import { PlayerObject } from "./player-object";

export class LocalPlayerObject extends PlayerObject {
  public pressedKeys: Set<string> = new Set();

  constructor(player_data: player_data_type) {
    super(player_data);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    console.log("local");
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.pressedKeys.add(event.key);
  };
  private handleKeyUp = (event: KeyboardEvent) => {
    this.pressedKeys.delete(event.key);
  };
  public async draw(drawer: DrawHelper, delta: number): Promise<void> {
    const speed = {x:0, y:0}as position;
    if (this.pressedKeys.has("a") || this.pressedKeys.has("ArrowLeft")) {
      speed.x -= delta * 10;
    }
    if (this.pressedKeys.has("d") || this.pressedKeys.has("ArrowRight")) {
      speed.x += delta * 10;
    }
    if (this.pressedKeys.has("w") || this.pressedKeys.has("ArrowUp")) {
      speed.y -= delta * 10;
    }
    if (this.pressedKeys.has("s") || this.pressedKeys.has("ArrowDown")) {
      speed.y += delta * 10;
    }
    add_position(this.position, speed);
    super.draw(drawer, delta);
  }
  public copyFrom(localPlayer: LocalPlayerObject) {
    this.position = localPlayer.position;
    this.pressedKeys = localPlayer.pressedKeys;
  } 
}
