import { DrawHelper } from "../classes";

/**
 * Interface defining the contract for drawable objects that can be drawn on a canvas.
 */
export interface IDrawable {
    /**
     * Draws the object using a {@link DrawHelper} instance and a time delta in seconds.
     * @param drawer The {@link DrawHelper} instance responsible for drawing operations.
     * @param delta Time delta in seconds indicating how much time has passed since the last frame.
     * @returns A promise resolving once the drawing operation is completed.
     */
    draw(drawer: DrawHelper, delta: number): Promise<void>;
}