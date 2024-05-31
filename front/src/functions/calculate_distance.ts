import { position } from "../types";


export function calculateDistance(pos1: position, pos2: position){
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) +
      Math.pow(pos1.y - pos2.y, 2)
  );
}