<?php

require_once ("./Vectors.php");
require_once ("./GameConsts.php");
class EnemyHelper
{
  public static function handleEnemyTick(array &$enemy, float &$delta)
  {
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
        $newPos = Vectors::travel($newPos, $enemy['path'][$pathStep], $travelDistance / $distance);
        $travelDistance = 0;
      }
    }
    $enemy["position"] = $newPos;
    array_splice($enemy['path'], 0, $pathStep);
  }
}