import { positionHelper } from "../classes";
import { position } from "../types";

export enum sprite_names {
  plain,
  wall,
  wall_br,
  player_base,
}

export enum sprite_anim {
  player_left,
  player_right,
  player_up,
  player_down,
}

export type sprites_type = {
  [key in sprite_names]: position;
};

export type sprite_anim_type = {
  [key in sprite_anim]: position[];
};

export const sprites: sprites_type = {
  [sprite_names.wall]: { x: 3, y: 3 },
  [sprite_names.wall_br]: { x: 4, y: 3 },
  [sprite_names.plain]: { x: 0, y: 4 },
  [sprite_names.player_base]: { x: 4, y: 0 },
};

export const animations: sprite_anim_type = {
  [sprite_anim.player_left]: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 0 },
  ],
  [sprite_anim.player_right]: [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ],
  [sprite_anim.player_down]: [
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 4, y: 0 },
    { x: 3, y: 0 },
  ],
  [sprite_anim.player_up]: [
    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 4, y: 1 },
    { x: 3, y: 1 },
  ],
};

export let areSpritesReady = false;

export function initSprites() {
  for (const key in sprites) {
    const keyTyped = key as unknown as sprite_names;
    sprites[keyTyped] = positionHelper.calcPostionInTiles(sprites[keyTyped]);
  }

  for (const key in animations) {
    const keyTyped = key as unknown as sprite_anim;
    animations[keyTyped] = animations[keyTyped].map((pos) =>
      positionHelper.calcPostionInTiles(pos)
    );
  }

  areSpritesReady = true;
}
