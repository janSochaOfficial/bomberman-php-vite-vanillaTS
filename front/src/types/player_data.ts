import { position } from "./position";

export type player_state = "walking" | "standing";
export type player_facing = "right" | "left" | "up" | "down";
export type player_data_type = {
    bomb_strengt: number;
    position: position;
    socket_ip: string;
    state: player_state;
    facing: player_facing;
    animation_timer: number;
}
