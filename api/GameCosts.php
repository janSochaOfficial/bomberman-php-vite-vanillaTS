<?php

class GameConsts
{
    public static array $data = array(
        "tileSize" => 16,
        // dimentions in tiles
        "canvasWidth" => 31,
        "canvasHeight" => 13,
        "canvasScale" => 2,
        "backgroundColor" => "#388700",
        "wallsToDraw" => 40,
        "enemies" => 10,
        "path_steps_ahead" => 2
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

    public static array $enemy_base_object = [
        "type" => "bloon",
        "position" => [
            "x" => 1,
            "y" => 1
        ],
        "facing" => "right",
        "path" => []
    ];

    public static array $collision = [
        "distance_min" => 1,
        "snap_max_distance" => 0.2,
        "snap_shift" => 0.1
    ];

    public static array $speeds = [
        "player" => 2,
        "bloon" => 1
    ];

    static function getConst(string $const)
    {
        switch ($const) {
            case "data":
                return self::$data;
            case "collision":
                return self::$collision;
            case "speeds":
                return self::$speeds;
            default:
                header("HTTP/1.1 404 Not Found");
                return ["result" => "Not Found"];

        }
    }

}