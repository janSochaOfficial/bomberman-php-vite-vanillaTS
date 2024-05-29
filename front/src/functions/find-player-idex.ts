import { PlayerObject } from "../classes/objects/player-object";

export function findPlayerIndex(players: PlayerObject[], ip: string) {
    return players.findIndex(player => player.ip === ip)
 }