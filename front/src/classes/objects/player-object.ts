import { sprite_names } from "../../data";
import { IDrawable } from "../../interfaces";
import { position } from "../../types";
import { DrawHelper } from "../helpers";

export type player_data_type = {
    bomb_strengt: number;
    position: position;
    socket_ip: string;
}

export class PlayerObject implements IDrawable {
    public position: position;
    constructor (player_data: player_data_type) {
        this.position = player_data.position;
    }

    async draw(drawer: DrawHelper, delta: number): Promise<void> {
        drawer.drawSprite(sprite_names.player_base, this.position, false);
    }

}