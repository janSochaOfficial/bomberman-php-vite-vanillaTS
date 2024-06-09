<?php
require_once ("./Vectors.php");
require_once ("./GameCosts.php");

function getRandomElementAndRemove(array $array): ?array
{
    if (empty($array)) {
        return null;
    }

    $randomIndex = rand(0, count($array) - 1);
    $removedElement = array_splice($array, $randomIndex, 1)[0];

    return $removedElement;
}

class GameService
{
    public static function handleRequest(string $command)
    {
        $response = [];
        switch ($command) {
            case "generate":
                $response = GameService::generateGameBoard();
                break;
            default:
                header("HTTP/1.1 404 Not Found");
                $response = ["result" => "Not Found in 'game'"];
                break;
        }
        return $response;
    }

    public static function generateGameBoard(): array
    {
        $board = [];
        $cHeight = GameConsts::$data['canvasHeight'];
        $cWidth = GameConsts::$data['canvasWidth'];

        for ($y = 0; $y < $cHeight; $y++) {
            array_push($board, array());
            for ($x = 0; $x < $cWidth; $x++) {
                array_push($board[$y], ["object" => ""]);
            }
        }

        for ($x = 0; $x < $cWidth; $x++) {
            $board[0][$x]["object"] = "wall";
            $board[$cHeight - 1][$x]["object"] = "wall";
        }

        for ($y = 0; $y < $cHeight; $y++) {
            $board[$y][0]["object"] = "wall";
            $board[$y][$cWidth - 1]["object"] = "wall";
        }

        for ($y = 2; $y < $cHeight; $y += 2) {
            for ($x = 2; $x < $cWidth; $x += 2) {
                $board[$y][$x]["object"] = "wall";
            }
        }

        $possiblePositions = [];

        for ($y = 1; $y < $cHeight - 1; $y++) {
            for ($x = 1; $x < $cWidth - 1; $x++) {
                if (($y % 2 === 0 && $x % 2 === 0) || $y + $x < 4)
                    continue;
                array_push($possiblePositions, ["x" => $x, "y" => $y]);
            }
        }

        for ($i = 0; $i < GameConsts::$data['wallsToDraw']; $i++) {
            $randomElement = getRandomElementAndRemove($possiblePositions);
            $board[$randomElement['y']][$randomElement['x']]['object'] = "wall_br";
        }

        return $board;
    }


    public static function generateEnemies(array $board): array
    {
        $possiblePositions = [];
        for ($y = 1; $y < GameConsts::$data['canvasHeight'] - 1; $y++) {
            for ($x = 1; $x < GameConsts::$data['canvasWidth'] - 1; $x++) {
                if ($board[$y][$x]["object"] !== "")
                    continue;
                array_push($possiblePositions, Vectors::construct($x, $y));
            }
        }
        $enemies = [];
        for ($i = 0; $i < GameConsts::$data['enemies']; $i++) {
            $randomElement = getRandomElementAndRemove($possiblePositions);
            $enemy = GameConsts::$enemy_base_object;
            $enemy['position'] = $randomElement;
            self::fillEnemyPath($board, $enemy);
            array_push($enemies, $enemy);
        }
        return $enemies;
    }

    public static function fillEnemyPath(array $board, array &$enemy)
    {
        if (self::isEnemySurrounded($board, $enemy))
            return;

        $enemyPosition = $enemy['position'];
        $enemyDirection = $enemy['facing'];
        $enemyPath = [$enemyPosition];

        if (isset($enemy['path'][0])) {
            array_push($enemyPath, $enemy['path'][0]);
            $enemyPosition = $enemy['path'][0];
        }
        $failCount = 0;
        for ($i = 0; $i < GameConsts::$data['path_steps_ahead'] && $failCount < 10; $i++) {
            $speed = self::$facing_to_vector[$enemyDirection];
            $newPos = Vectors::add($enemyPosition, $speed);
            if ($board[$newPos['y']][$newPos['x']]['object'] !== "") {
                $enemyDirection = self::$reverse_facing[$enemyDirection];
                $i--;
                $failCount++;
                continue;
            }
            array_push($enemyPath, $newPos);
        }
        $enemy['facing'] = $enemyDirection;
        $enemy['path'] = $enemyPath;
    }

    private static function isEnemySurrounded($board, $enemy)
    {
        $enemyPosition = $enemy['position'];
        $directions = ["up", "down", "right", "left"];
        foreach ($directions as $direction) {
            $speed = self::$facing_to_vector[$direction];
            $newPos = Vectors::add($enemyPosition, $speed);
            if ($board[$newPos['y']][$newPos['x']]['object'] === "") {
                return false;
            }
        }
        return true;
    }


    private static array $facing_to_vector = [
        "up" => ["x" => 0, "y" => -1],
        "down" => ["x" => 0, "y" => 1],
        "left" => ["x" => -1, "y" => 0],
        "right" => ["x" => 1, "y" => 0]
    ];

    private static array $reverse_facing = [
        "up" => "down",
        "down" => "up",
        "left" => "right",
        "right" => "left"
    ];


}
