<?php

require_once("./Game.php");

class WebSocketController {

  public Game $game;

  public function __construct(){
    $this->game = new Game();
  }

  public function user_connect(string $ip): array {
    $this->game->addPlayer($ip);
    $data = ["msg" => "Nastąpiło połączenie"];
    return $data;
  }

  public function user_message(string $ip, array $message): array{
    return $message;
  }

  public function tick(): array {
    $this->game->tick();
    return [
      "action" => "tick",
      "data" => [
        "board" => $this->game->board,
        "players" => $this->game->players, 
      ]
    ];
  }
  
  public function user_disconnect(string $ip): void {
    $this->game->deletePLayer($ip);
  }
}