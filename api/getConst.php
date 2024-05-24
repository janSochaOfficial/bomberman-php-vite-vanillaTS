<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Credentials: true");
header("Content-Type: Application/json");

require_once("./GameCosts.php");

if (!isset($_GET['const'])) {
    echo json_encode(["error" => "No constant specified"]);
    exit;
}
$response;
$consts = explode(".", $_GET['const'], 2);
switch ($consts[0]) {
    case "game":
        $response = GameConsts::getConst($consts[1]);
        break;
    default:
        header("HTTP/1.1 404 Not Found");
        $response = ["result" => "Not Found"];
        break;
}

echo json_encode($response);