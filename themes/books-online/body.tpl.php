<?php

$books = array(
    "duii" => "DUII Notebook",
    "fsm" => "Felony Sentencing in Oregon"
);
?>
 
        <div class="toolbar">
    
            <div class="toolbar-section toolbar-left">
                <img class="logo" src="https://appdev.ocdla.org/content/images/logo.png" />
            </div>
            <div class="toolbar-section toolbar-right">


                <webc-autocomplete id="query" style="display:inline-block; max-width: 60%;"></webc-autocomplete>


                <div id="user-area">
                    
                    <a id="user-icon" href="https://ocdla--ocdpartial.sandbox.my.site.com/AccountManager" title="Hello ">
                        <svg id="user-widget" width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <circle cx="50" cy="50" r="50" style="fill: rgb(81 100 144);"></circle>
                                <text x="50%" y="50%" font-size="3.0em" fill="#ffffff" text-anchor="middle" stroke="#ffffff" stroke-width="0px" dy=".3em">SA</text>
                            </g>
                        </svg>
                    </a>

                </div><!-- end user-area -->

            </div>

            <div class="toolbar-bottom">
                <span class="nav-heading-item">Books Online</span> <i class="fa-solid fa-chevron-right"></i> <span class="nav-heading-item"><?php print $books[$book]; ?></span>
                <button>Feedback</button>
            </div>
        </div>

        <div class="toc">
            <?php
                $file = $contentPath . "/books/{$book}/toc.tpl.php";
                @include $file;
            ?>
        </div>
        
        <div class="workspace">


            <div class="document">
                        
                <!-- Template://breadcrumb -->
                <div class="breadcrumb">
                    <ul>
                        <li>Books Online</li>
                        <li><?php print $books[$book]; ?></li>
                    </ul>
                </div>

                <div class="chapter">

                    <!-- Template://title -->
                    <?= $out ?>
                </div>

                

            </div>


            <div class="outline">
                <div class="outline-content">

                </div>
            </div>
            
        </div>


        <?php require "footer.tpl.php"; ?>

 


