<?php

require_once("./Game.php");

class WebSocketController
{

  public Game $game;
  private float $lastTick;

  public function __construct()
  {
    $this->game = new Game();
    $this->lastTick = microtime(true);
  }

  public function user_connect(string $ip): array
  {
    $this->game->addPlayer($ip); 
    $data = [
      "action" => "connect",
      "data" => [
        "board" => $this->game->board,
        "ip" => $ip
      ]
    ];
    return $data;
  }

  public function user_message(string $ip, array $message): array | false
  {
    switch ($message['action']) {
      case "position":
        $this->game->updatePlayerPosition($ip, $message['data']['position']);
    }

    return false;
  }

  public function tick(): array
  {
    $delta = microtime(true) - $this->lastTick;
    $this->game->tick($delta);
    $this->lastTick = microtime(true);
    return [
      "action" => "tick",
      "data" => [
        "players" => $this->game->players,
        "enemies" => $this->game->enemies,
      ]
    ];
  }

  public function user_disconnect(string $ip): void
  {
    $this->game->deletePLayer($ip);
  }
}
