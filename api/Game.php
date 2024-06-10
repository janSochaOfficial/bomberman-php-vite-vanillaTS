<?php

require_once ("./GameConsts.php");
require_once ("./GameService.php");
require_once ("./Vectors.php");
require_once ("./EnemyHelper.php");

class Game
{
    public array $board;
    public array $players;
    public array $enemies;
    public array $bombs;
    public array $broken_walls = [];
    public array $power_ups = []; 

    public function __construct()
    {
        $this->board = GameService::generateGameBoard();
        $this->enemies = GameService::generateEnemies($this->board);
        $this->players = [];
        $this->bombs = [];
        $this->broken_walls = [];
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
        foreach ($this->enemies as &$enemy) {
            EnemyHelper::handleEnemyTick($enemy, $delta);
            GameService::fillEnemyPath($enemy, $this->board);
        }
        $this->broken_walls = [];
        foreach ($this->bombs as $index => &$bomb) {
            $bomb['timer'] -= $delta;
            if ($bomb['timer'] <= 0) {
                $this->handleBombExplosion($bomb, $index);
            }
        }
        $this->calculatePowerUps();
    }

    public function updatePlayerPosition(string $playerIp, array $data)
    {
        $playerIndex = $this->findPlayerIndex($playerIp);
        $this->players[$playerIndex]['position'] = $data['position'];
        $this->players[$playerIndex]['state'] = $data['state'];
        $this->players[$playerIndex]['facing'] = $data['facing'];
        $this->players[$playerIndex]['animation_timer'] = $data['animation_timer'];

        foreach ($this->power_ups as $i => &$power_up) {
            if(Vectors::areIntegerEqual($power_up['position'], $data['position'])){
                $this->handlePowerUpPickup($i, $playerIndex);
            }
        }
    }

    public function playerPlaceBomb(string $playerIp, array $data)
    {
        $this->updatePlayerPosition($playerIp, $data['position_data']);
        $bomb = GameConsts::$bomb_base_object;
        $bomb['position'] = Vectors::toInegerVector($data['position_data']['position']);
        $bomb['player'] = $playerIp;
        $player = $this->players[$this->findPlayerIndex($playerIp)];
        $bomb['strength'] = $player['bomb_strength'];
        array_push($this->bombs, $bomb);
        $this->board[$bomb['position']['y']][$bomb['position']['x']]['object'] = 'bomb';
    }

    private function findPlayerIndex(string $playerIp)
    {
        foreach ($this->players as $index => $associativeArray) {
            if ($associativeArray['socket_ip'] === $playerIp) {
                return $index;
            }
        }
    }

    private function handleBombExplosion(array &$bomb, int $bombIndex)
    {
        if ($bomb['state'] === 'planted') {
            $this->board[$bomb['position']['y']][$bomb['position']['x']]['object'] = '';
            $bomb['state'] = 'exploding';
            $bomb['timer'] += GameConsts::$data['bomb_fire_timer'];
            $broken_walls = GameService::fillBombFire($bomb, $this->board);
            $this->broken_walls = array_merge($this->broken_walls, $broken_walls);
            return;
        }
        array_splice($this->bombs, $bombIndex, 1);
    }

    private function calculatePowerUps() {
        if (count($this->broken_walls) == 0) return;
        $power_ups = [];
        foreach ($this->broken_walls as $wall) {
            $random = rand(0, 100);
            if ($random < 10){
                $power_ups[] = [
                    'position' => $wall,
                    'type' => 'bomb_strength'
                ];
            }
            
        }
        $this->power_ups = array_merge($this->power_ups, $power_ups);
    }

    private function handlePowerUpPickup(int $power_up_index, int $player_index) {
        $power_up = $this->power_ups[$power_up_index];
        if ($power_up['type'] === 'bomb_strength') {
            $this->players[$player_index]['bomb_strength']++;
        }
        array_splice($this->power_ups, $power_up_index, 1);
    }
}