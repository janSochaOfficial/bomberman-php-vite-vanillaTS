import { DrawHelper } from "..";
import { sprite_names } from "../../data";
import { IDrawable } from "../../interfaces";
import { position } from "../../types";

export class WallObject implements IDrawable {
  private readonly position: position;
  private readonly powerup?: string;

  public breakable: boolean;
  constructor(
    gamePosition: position,
    breakable: boolean,
    powerUp: string | undefined = undefined
  ) {
    this.position = gamePosition;
    this.breakable = breakable;
    if (breakable) {
      this.powerup = powerUp;
    }
  }
  async draw(drawer: DrawHelper, delta: number): Promise<void> {
    if (this.breakable) {
      drawer.drawSprite(sprite_names.wall_br, this.position);
    } else {
      drawer.drawSprite(sprite_names.wall, this.position);
    }
  }

  onDestroy(): boolean | string {
    if (this.breakable) return this.powerup ? this.powerup : true;
    return false;
  }
}
