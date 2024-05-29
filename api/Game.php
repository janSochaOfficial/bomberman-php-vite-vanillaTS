<?php

require_once ("./GameCosts.php");
require_once ("./GameService.php");

class Game
{
    public array $board;
    public array $players;
    public array $enemies;

    public function __construct()
    {
        $this->board = GameService::generateGameBoard();
        $this->players = [];
        $this->enemies = [];
    }
    public function addPlayer(string $playerIp)
    {
        $playerModel = GameConsts::$player_base_object;
        $playerModel['socket_ip'] = $playerIp;
        array_push($this->players, $playerModel);
    }

    public function deletePLayer(string $playerIp)
    {
        $playerIndex = $this->findPlayerIndex($playerIp);
        array_splice($this->players, $playerIndex, 1);
    }

    public function tick() {
        foreach ($this->players as $index => $associativeArray){
            // $this->players[$index]['position']['x'] = $associativeArray['position']['x']+2;
        }
    }

    public function updatePlayerPosition(string $playerIp, array $position) {
        $index = $this->findPlayerIndex($playerIp);
        $this->players[$index]['position'] = $position;
    }

    private function findPlayerIndex(string $playerIp)
    {
        foreach ($this->players as $index => $associativeArray) {
            if ($associativeArray['socket_ip'] === $playerIp) {
                return $index;
            }
        }
    }
}