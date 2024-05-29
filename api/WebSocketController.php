<?php

require_once("./Game.php");

class WebSocketController
{

  public Game $game;

  public function __construct()
  {
    $this->game = new Game();
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
    $this->game->tick();
    return [
      "action" => "tick",
      "data" => [
        "players" => $this->game->players,
      ]
    ];
  }

  public function user_disconnect(string $ip): void
  {
    $this->game->deletePLayer($ip);
  }
}
