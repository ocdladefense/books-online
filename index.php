<?php
require "bootstrap.php";



loadEnv();

$route = getRoute();

$out = render($route);

print $out;