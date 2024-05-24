<?php

require_once("./GameCosts.php");

require_once("./GameService.php");

class Game {
    public array $board;
    public array $players;
    public array $enemies;

    public function __construct() {
        $this->board = GameService::generateGameBoard();
    }
    public function addPlayer(string $playerId) {

    }
}