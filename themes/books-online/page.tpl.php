

    <?php
        $toc = "books/{$book}/toc.php";
        $path = $contentPath . "/$toc";
        @require $path;
        $chapterTitle = $toc[$chapter]["label"] . " - " . $toc[$chapter]["title"];
    ?>

    <?php
        $file = "books/{$book}/title.html";
        $path = $contentPath . "/$file";
        require $path;
    ?>
    



    <?php
        print "<h1>$chapterTitle</h1>";
    ?>
    
    <?php
        $file = "books/{$book}/chapters/chapter-{$chapter}/authors.html";
        $path = $contentPath . "/$file";
        @include $path;
    ?>

    <?php
        include ($contentPath ."/books/tools.html");
    ?>

    <?php 
        $file = "books/{$book}/chapters/chapter-{$chapter}/content";
        // if(file_exists()).html";
        $path = $contentPath . "/$file";
        if(file_exists($path . ".php")) {
            require "{$path}.php";
        }
        else {
            $success = @include "{$path}.html";
            if(!$success) {
                include $contentPath . "/books/chapter-not-found.html";
            }
        }
    ?>
