<?php

require_once ("./Game.php");

class WebSocketController
{

  public Game $game;
  private float $lastTick;
  private int $count = 0;
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

  public function user_message(string $ip, array $message): array|false
  {
    // echo $this->count."message received from $ip ".$message['action']." \n";
    $this->count++;
    switch ($message['action']) {
      case "position":
        $this->game->updatePlayerPosition($ip, $message['data']);
        break;
      case "bomb":
        $this->game->playerPlaceBomb($ip, $message['data']);
        break;
    }

    return false;
  }

  public function tick(): array
  {
    $delta = microtime(true) - $this->lastTick;
    $this->game->tick($delta);
    $this->lastTick = microtime(true);

    // echo json_encode($this->game->enemies_died) . "\n";
    return [
      "action" => "tick",
      "data" => [
        "players" => $this->game->players,
        "enemies" => $this->game->enemies,
        "bombs" => $this->game->bombs,
        "broken_walls" => $this->game->broken_walls,
        "players_died" => $this->game->players_died,
        "enemies_died" => $this->game->enemies_died,
        "power_ups" => $this->game->power_ups,
      ]
    ];
  }

  public function user_disconnect(string $ip): void
  {
    $this->game->deletePLayer($ip);
  }
}
