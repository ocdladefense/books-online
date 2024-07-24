<?php



function getSite() {
    global $hostdata;
    $host = $_GET["host"] ?? $_SERVER["HTTP_HOST"];

    return $hostdata[$host] ?? $hostdata["default"];
}


function getSitePath() {
    $site = getSite();
    $host = $_GET["host"] ?? $_SERVER["HTTP_HOST"];
    $host = $hostdata[$host] ?? "default";

    return BASE_PATH . "/sites/" . $host;
}


function getThemePath() {
    $site = getSite();
    return THEME_PATH . "/" . $site["theme"];
}

function getContentPath() {
    $host = $_GET["host"] ?? $_SERVER["HTTP_HOST"];
    return BASE_PATH . "/sites/" . $host;
}

function getThemeUrl() {
    $site = getSite();
    return "themes/" . $site["theme"];
}

function getContentUrl() {
    $host = $_GET["host"] ?? $_SERVER["HTTP_HOST"];
    return "sites/" . $host;
}


function loadEnv() {
    $configPath = getSitePath() . "/config.php";
    require($configPath);
}


function getRoute() {
    $requestUri = $_SERVER["REQUEST_URI"];
    $requestPath = explode("?",$requestUri)[0];
    $basePath = substr($_SERVER["SCRIPT_NAME"],0,strlen($_SERVER["SCRIPT_NAME"])-9);
    $length = strlen($basePath);
    $route = substr($requestPath,$length);

    return $route;
}
