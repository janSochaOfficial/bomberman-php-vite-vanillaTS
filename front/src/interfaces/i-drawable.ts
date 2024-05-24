import { DrawHelper } from "../classes";

export interface IDrawable {
    draw(drawer: DrawHelper, tick: number): Promise<void> 
}