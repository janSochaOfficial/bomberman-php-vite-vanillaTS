<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: *");
// header("Access-Control-Allow-Credentials: true");
header("Content-Type: Application/json");

require_once("./GameService.php");

if (!isset($_GET['c'])) {
    echo json_encode(["error" => "No command specified"]);
    exit;
}
$response;
$commandBase = explode("/", $_GET['c'], 2);
switch ($commandBase[0]) {
    case "game":
        $response = GameService::handleRequest($commandBase[1]);
        break;
    default:
        header("HTTP/1.1 404 Not Found");
        $response = ["result" => "Not Found"];
        break;
}

echo json_encode($response);