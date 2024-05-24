<?php

require_once("./GameCosts.php");

function getRandomElementAndRemove(array $array):?array {
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
                array_push($board[$y], ["object"=>""]);
            }
        }

        for ($x = 0; $x < $cWidth; $x++) {
            $board[0][$x]["object"] = "wall";
            $board[$cHeight - 1][$x]["object"] = "wall";
        }

        for ($y = 0; $y < $cHeight; $y++){
            $board[$y][0]["object"] = "wall";
            $board[$y][$cWidth - 1]["object"] = "wall";
        }

        for ($y = 2; $y < $cHeight; $y+=2){
            for ($x = 2; $x < $cWidth; $x+=2){
                $board[$y][$x]["object"] = "wall";
            } 
        }

        $possibleBreakableWalls = [];

        for ($y = 1; $y < $cHeight - 1; $y++){
            for ($x = 1; $x < $cWidth - 1; $x++){
                if (($y % 2 === 0 && $x % 2 === 0) || $y + $x < 4) continue;
                array_push($possibleBreakableWalls, ["x"=>$x, "y"=>$y]);
            }
        }

        for ($i = 0; $i < GameConsts::$data['wallsToDraw']; $i++){
            $randomElement = getRandomElementAndRemove($possibleBreakableWalls);
            $board[$randomElement['y']][$randomElement['x']]['object'] = "wall_br";
        }

        return $board;
    }
}
