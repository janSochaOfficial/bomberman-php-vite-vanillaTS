import { positionHelper } from "../classes";
import { position } from "../types";

export enum sprite_names {
  plain,
  wall,
  wall_br,
}

export type sprites_type = {
  [key in sprite_names]: position;
};

export const sprites: sprites_type = {
  [sprite_names.wall]: { x: 3, y: 3 },
  [sprite_names.wall_br]: { x: 4, y: 3 },
  [sprite_names.plain]: { x: 0, y: 4 },
};

export let areSpritesReady = false;

export function initSprites(){
  for (const key in sprites) {
    const keyTyped = key as unknown as sprite_names;
    sprites[keyTyped] = positionHelper.calcShetPostion(sprites[keyTyped]);
  }
  areSpritesReady = true;
}
