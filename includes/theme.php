<?php 


function render($route) {

    $page = getThemePath() . "/{$route}.tpl.php";

    if(!file_exists($page)) {
        $page = getThemePath() . "/page.tpl.php";
    }

    $themeUrl = getThemeUrl();
    $contentPath = getContentPath();

    
    $vars = array("route"=>$route);

    if(function_exists("preprocess")) {
        preprocess($vars);
    }
    
    extract($vars);
    $book = "fsm";
    $chapter = "1";

    ob_start();
    require getThemePath() . "/footer.tpl.php";
    $footer = ob_get_contents();
    ob_end_clean();

    
    ob_start();
    require $page;
    $out = ob_get_contents();
    ob_end_clean();

    ob_start();
    require getThemePath() . "/body.tpl.php";
    $body = ob_get_contents();
    ob_end_clean();

    ob_start();
    require getThemePath() . "/html.tpl.php";
    $html = ob_get_contents();
    ob_end_clean();

    return $html;
}