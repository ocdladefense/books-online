<?php
date_default_timezone_set('America/Los_Angeles');
if(!defined("BASE_PATH")) define("BASE_PATH", __DIR__);
require(BASE_PATH . "/vendor/autoload.php");
require(BASE_PATH . "/includes/functions.php");
require(BASE_PATH . "/includes/theme.php");
define("THEME_PATH", BASE_PATH . "/themes");
define("UPLOAD_PATH", BASE_PATH . "/content");

require BASE_PATH . "/sites/sites.php";
