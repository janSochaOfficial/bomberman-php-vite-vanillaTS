<?php

require_once ("./GameCosts.php");
require_once ("./GameService.php");
require_once ("./Vectors.php");

class Game
{
    public array $board;
    public array $players;
    public array $enemies;

    public function __construct()
    {
        $this->board = GameService::generateGameBoard();
        $this->enemies = GameService::generateEnemies($this->board);
        $this->players = [];
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

    public function tick(float $delta)
    {
        // foreach ($this->players as $index => $associativeArray) {

        // }
        foreach ($this->enemies as $index => $enemy) {
            $speed = 1;
            if ($enemy["type"] === "bloon") {
                $speed = GameConsts::$speeds['bloon'];
            }
            $travelDistance = $delta * $speed;
            $newPos = $enemy["position"];
            $pathStep = 0;
            while ($travelDistance > 0) {
                if (!isset($enemy['path'][$pathStep]))
                    break;
                $distance = Vectors::distance($newPos, $enemy['path'][$pathStep]);
                if ($travelDistance > $distance) {
                    $travelDistance -= $distance;
                    $newPos = $enemy['path'][$pathStep];
                    $pathStep++;
                } else {
                    $newPos = Vectors::add(
                        $newPos, // current position
                        Vectors::multiplyBy(
                            Vectors::subtract($enemy['path'][$pathStep], $newPos), // Vector from current to next point
                            $travelDistance / $distance // franction of distance to travel
                        )
                    );
                    $travelDistance = 0;
                }
            }
            $enemy["position"] = $newPos;
            array_splice($enemy['path'], 0, $pathStep);
            GameService::fillEnemyPath($this->board, $enemy);
            $this->enemies[$index] = $enemy;
        }

    }

    public function updatePlayerPosition(string $playerIp, array $data)
    {
        $index = $this->findPlayerIndex($playerIp);
        $this->players[$index]['position'] = $data['position'];
        $this->players[$index]['state'] = $data['state'];
        $this->players[$index]['facing'] = $data['facing'];
        $this->players[$index]['animation_timer'] = $data['animation_timer'];
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