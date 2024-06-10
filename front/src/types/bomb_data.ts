import { position } from "./position";

export type bomb_state = "planted" | "exploing";

export type bomb_data = {
  player: string;
  position: position;
  strength: number;
  timer: number;
  state: bomb_state;
  fire_tiles: position[];
};
