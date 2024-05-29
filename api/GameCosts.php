<?php

class GameConsts {
    public static array $data = array(
        "tileSize" =>  16,
        "canvasWidth" => 31,
        "canvasHeight" => 13,
        "canvasScale" => 2,
        "backgroundColor" => "#388700",
        "wallsToDraw" => 40
    );

    public static array $player_base_object = [
        "socket_ip" => -1,
        "position" => [
            "x" => 1,
            "y" => 1
        ],
        "bomb_strength" => 1,
        "state" => "walking",
        "facing" => "right"
    ];


    static function getConst(string $const) {
        switch($const) {
            case "data":
                return self::$data;
            default:
                header("HTTP/1.1 404 Not Found");
                return ["result" => "Not Found"];
                
        }
    }
    
}