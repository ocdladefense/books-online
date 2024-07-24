<?php


?>

<!doctype html>
<html>
    <head> 
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js">
        </script>
        <base href="/" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@100;200;300;400;500&family=Nanum+Pen+Script&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="node_modules/@ocdladefense/modal/src/css/loading.css" />
        <link rel="stylesheet" href="node_modules/@ocdladefense/modal/src/css/modal.css" />
        <link rel="stylesheet" href="node_modules/@ocdladefense/modal/src/css/inline-modal.css" />
        <link rel="stylesheet" href="<?= $themeUrl ?>/main.css" />

        <script src="https://kit.fontawesome.com/c2278a45b9.js" crossorigin="anonymous">
        </script>
        <!--
        https://developers.google.com/maps/documentation/geocoding/requests-geocoding
        -->
        
        <script type="module">


        </script>
    </head>
<body <?= $route ?>>
    <?= $body ?>


    <?= $footer ?>
</body>

    <script type="module">

        import "./node_modules/@ocdladefense/html/html.js";
        import domReady from "./node_modules/@ocdladefense/web/src/web.js";

        window.init = init;
        domReady(init);

        async function init() {
            console.log("init called.");
        }
    </script>

    



</html>