import { position } from "../types";

/**
 * Adds the x and y coordinates of the `rhs` position to the `lhs` position.
 *
 * @param {position} lhs - The position object to be modified.
 * @param {position} rhs - The position object to be added to `lhs`.
 * @returns {void} This function modifies the `lhs` object directly and does not return a value.
 */
export function add_position(lhs: position, rhs: position): void {
    lhs.x += rhs.x;
    lhs.y += rhs.y;
}
