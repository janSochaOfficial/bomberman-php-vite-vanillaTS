import { DrawHelper } from "..";
import { sprite_anim, sprite_names } from "../../data";
import { IDrawable } from "../../interfaces";
import { position } from "../../types";

export class WallObject implements IDrawable {
  public readonly position: position;
  private readonly powerup?: string;
  public breakable: boolean;
  public broken: boolean = false;
  public timer: number = 0;
  public toDelete: boolean = false;
  public static readonly wallBreakTime = 2;
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
      if (this.broken) {
        this.timer += delta;
        if (this.timer > WallObject.wallBreakTime) {
          this.toDelete = true;
        }
        drawer.drawAnimFrame(
          sprite_anim.wall_break,
          this.position,
          true,
          this.timer,
          WallObject.wallBreakTime
        );
        return;
      }
      drawer.drawSprite(sprite_names.wall_br, this.position);
    } else {
      drawer.drawSprite(sprite_names.wall, this.position);
    }
  }
}
