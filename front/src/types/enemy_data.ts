import { enemy_type } from "../classes/objects/enemy-object"
import { position } from "./position";

export type enemy_data = {
  type: enemy_type;
  position: position;
  path: position[];
}