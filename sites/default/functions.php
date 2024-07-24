<?php

global $config;


function preprocess(&$vars = array()) {
    
    $requestUri = $_SERVER["REQUEST_URI"];
    $requestPath = explode("?",$requestUri)[0];
    $basePath = substr($_SERVER["SCRIPT_NAME"],0,strlen($_SERVER["SCRIPT_NAME"])-9);
    $length = strlen($basePath);
    $route = substr($requestPath,$length);


    list($book,$chapter) = explode("/",$route);
    $contentPath = getContentPath();
    // var_dump($route,$book,$chapter);exit;
    $vars["book"] = $book;
    $vars["chapter"] = $chapter;
    $vars["contentPath"] = $contentPath;
}
