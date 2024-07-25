<!doctype html>
<html>
    <head> 
        <meta http-equiv="content-type" content="text/html; charset=windows-1252" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js">
        </script>
        <!-- <base href="/" /> -->
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/node_modules/@ocdladefense/modal/src/css/loading.css" />
        <link rel="stylesheet" href="/node_modules/@ocdladefense/modal/src/css/modal.css" />
        <link rel="stylesheet" href="/node_modules/@ocdladefense/modal/src/css/inline-modal.css" />
        <link rel="stylesheet" href="/<?= $themeUrl ?>/css/main.css" />
        <link rel="stylesheet" href="/<?= $themeUrl ?>/css/citations.css" />
        <link rel="stylesheet" href="/<?= $themeUrl ?>/css/headings.css" />
        <link rel="stylesheet" href="/<?= $themeUrl ?>/css/toc.css" />
        <link rel="stylesheet" href="/<?= $themeUrl ?>/css/modal.css" />
        <link rel="stylesheet" href="/<?= $themeUrl ?>/css/tools.css" />
        <link rel="stylesheet" media="(min-width:767px)" href="/<?= $themeUrl ?>/css/desktop.css" />
        <script src="https://kit.fontawesome.com/c2278a45b9.js" crossorigin="anonymous">
        </script>

        <!--
        https://developers.google.com/maps/documentation/geocoding/requests-geocoding
        -->
        
        <script type="application/javascript">
            window.book = "<?= $book ?>";

        </script>
    </head>
    
    <body tab-index="-1">
        <?= $body ?>
    </body>


    <!-- Initialize autocomplete search. -->
    <!--
    <script type="module">

        // https://medium.com/streak-developer-blog/the-complexities-of-implementing-inline-autocomplete-for-content-editables-e358c0ed504b
        import domReady from "/node_modules/@ocdladefense/web/src/web.js";
        import ReadingContext from "/node_modules/@ocdladefense/reading-context/reading-context.js";
        import SearchClient from "/node_modules/@ocdladefense/search-client/search-client.js";
        import Autocomplete from "/node_modules/@ocdladefense/webc-autocomplete/autocomplete.js";
        
        customElements.define("webc-autocomplete", Autocomplete);

        window.initSearch = initSearch;
        domReady(initSearch);

        async function initSearch() {
            const terms = ['apple', 'cheese', "cantaloupe", 'apple watch', 'apple macbook', 'apple macbook pro', 'iphone', 'iphone 12'];

            
            let foo = await fetch("https://appdev.ocdla.org/search/query?r=ocdla_products&q=duii").then(resp => resp.json());
            foo = foo.map(result => result.title);
            // console.log(foo);
            const client = new SearchClient(foo);

            let autocomplete = document.getElementById("query");
            // console.log(autocomplete);
            autocomplete.source(client);
            autocomplete.addEventListener("search",function(e) {
                // Gets the search terms committed as part of the search.
                // e.detail.terms
            });
            autocomplete.addEventListener("beforedisplayresults",function(e) {

            });

            document.body.addEventListener("click",function(e) {
                console.log("Body event listener.");
                autocomplete.hide();
            });
        }
    </script>
    -->


    <!-- Initialize custom components to display ORS/OAR citations. View the page source to identify several of these components and also make note of how these are used. -->
    <script type="module">

        import { WebcOrs } from "/node_modules/@ocdladefense/webc-ors/src/WebcOrs.js";
        import { WebcOar } from "/node_modules/@ocdladefense/webc-oar/src/WebcOar.js";
        import "/node_modules/@ocdladefense/html/html.js";


        // customElements.define("word-count", WordCount, { extends: "p" });
        customElements.define("webc-ors", WebcOrs);
        customElements.define("webc-oar", WebcOar);
    </script>


    <script type="module">
        import domReady from "/node_modules/@ocdladefense/web/src/web.js";
        import Controller from "/js/BooksOnlineController.js";
        import init from "/js/init.js";
            
        const controller = new Controller();
        domReady(() => document.addEventListener("click", controller));
        domReady(() => controller.convert(".chapter"));
        domReady(init);  

    </script> 
        

    <!-- Process all citations in this document. List the citations as HTML links.  These links can be selected by the customer to navigate to where the source is referenced in the chapter.  -->
    <script type="module">

        import domReady from "/node_modules/@ocdladefense/web/src/web.js";
        import { formatReferences, doRefs } from "/js/citations.js";

        let refContainer = document.querySelector("#all-refs");
        let citations = document.querySelectorAll(".cite");
        let refs = document.querySelectorAll("[references], .cite");

        domReady(function () {
            formatReferences(citations);
            doRefs(refs, refContainer);
        });


        window.addEventListener("hashchange", function(e) {
            e.preventDefault();
            e.stopPropagation();

            let newId = e.newURL.split("#")[1];
            let newElem = document.getElementById(newId);
            console.log(newId);

            newElem.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            }); //({top: (rect.y + offset),behavior:"smooth"});
        });
    </script>


    <!-- Display table of contents (TOC) content and modal. This should display other chapters in the current publication. -->
    <script type="module">

        import { Modal } from "/node_modules/@ocdladefense/modal/dist/modal.js";

        window.loadToc = loadToc;
        function loadToc() {
            let config = {
                style: "display:block; width:auto; vertical-align:top; overflow-x: hidden; overflow-y: auto; height:60vh; padding: 8px;"
            };
            let modal = new Modal(config);
            modal.show();
            fetch("/sites/pubs.ocdla.org/books/"+window.book+"/toc.tpl.php").then((resp) => {
                return resp.text();
            })
            .then((html) => {
                modal.render(html);
            });
        }
    </script>


    <!-- Setup the chapter ouline and display it inside of the div.outline-content element. Currently not displaying so we need to figure out what is going wrong. -->
    <script type="module">

        import domReady from "/node_modules/@ocdladefense/web/src/web.js";
        import { DomDocument } from "/node_modules/@ocdladefense/dom/src/DomDocument.js";
        window.DomDocument = DomDocument;

        domReady(init);

        // Use these headings to create an on-the-fly outline of the document.
        function init() {
            let doc = new DomDocument();
            let nodes = doc.outline("h2"); // h1, h2, h3
            nodes.forEach((node) => document.querySelector(".outline-content").appendChild(node));
        }

    </script>


</html>