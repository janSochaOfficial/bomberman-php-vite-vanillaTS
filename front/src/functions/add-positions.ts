import { position } from "../types";

export function add_position(lhs: position, rhs: position): position {
    return {
        x: lhs.x + rhs.x,
        y: lhs.y + rhs.y,
    };
}
