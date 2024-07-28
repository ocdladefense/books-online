import OregonLegislatureNetwork from "/node_modules/@ocdladefense/ors/src/Network.js";
import { OrsParser } from "/node_modules/@ocdladefense/ors/src/OrsParser.js";
import { Modal } from "/node_modules/@ocdladefense/modal/dist/modal.js";
import { WebcOrs } from "/node_modules/@ocdladefense/webc-ors/src/WebcOrs.js";
import { WebcOar } from "/node_modules/@ocdladefense/webc-oar/src/WebcOar.js";
import "/node_modules/@ocdladefense/html/html.js";
import domReady from "/node_modules/@ocdladefense/web/src/web.js";
import init from "/js/init.js"; // TODO: This wasn't being referenced. Find out what it does.
import { DomDocument } from "/node_modules/@ocdladefense/dom/src/DomDocument.js";
import { formatReferences, doRefs } from "./citations.js";



/**
 * Controller for the Books Online application.
 * Processes actions on behalf of the user.
 */
export default class BooksOnlineController {

    modal = null;


    constructor() {
        // Full-screen modal.
        this.modal = new Modal();
        window.modal = this.modal;
        OregonLegislatureNetwork.setUrl("https://appdev.ocdla.org/books-online/index.php");
    

        // customElements.define("word-count", WordCount, { extends: "p" });
        customElements.define("webc-ors", WebcOrs);
        customElements.define("webc-oar", WebcOar);

        

        
        domReady(() => document.addEventListener("click", this));
        domReady(() => this.convert(".chapter"));
        domReady(init);


// TODO: Format the disparate scripts and clean them up. Move the inline functions into methods as needed.
// TODO: BooksOnlineController is named poorly now. We know it's a controller. BooksOnline.js is fine. Clean up references to it and rename it.
// TODO: Follow the scripts and see where they lead. Familiarize myself with their structure and functions.

    //<!-- Process all citations in this document. List the citations as HTML links.  These links can be selected by the customer to navigate to where the source is referenced in the chapter.  -->

        let refContainer = document.querySelector("#all-refs");
        let citations = document.querySelectorAll(".cite");
        let refs = document.querySelectorAll("[references], .cite");

        domReady(function () {
            formatReferences(citations);
            doRefs(refs, refContainer);
        });


        window.addEventListener("hashchange", function (e) {
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



    //<!-- Display table of contents (TOC) content and modal. This should display other chapters in the current publication. -->
        

        window.loadToc = loadToc;
        function loadToc() {
            let config = {
                style: "display:block; width:auto; vertical-align:top; overflow-x: hidden; overflow-y: auto; height:60vh; padding: 8px;"
            };
            let modal = new Modal(config);
            modal.show();
            fetch("/sites/pubs.ocdla.org/books/" + window.book + "/toc.tpl.php").then((resp) => {
                return resp.text();
            })
                .then((html) => {
                    modal.render(html);
                });
        }


    //<!-- Setup the chapter ouline and display it inside of the div.outline-content element. Currently not displaying so we need to figure out what is going wrong. -->
        
        window.DomDocument = DomDocument;

        domReady(initOutline);

        // Use these headings to create an on-the-fly outline of the document.
        function initOutline() {
            let doc = new DomDocument();
            let nodes = doc.outline("h2"); // h1, h2, h3
            nodes.forEach((node) => document.querySelector(".outline-content").appendChild(node));
        }



        //<!-- Initialize custom components to display ORS/OAR citations. View the page source to identify several of these components and also make note of how these are used. -->
    


    // customElements.define("word-count", WordCount, { extends: "p" });

    
    }

    /**
     * Handle user-actions.  These include requests to open
     * a modal with the text of the Oregon Revised Statutes (ORS) or
     * navigating to a specific ORS chapter/section.
     * @param {HTMLEventInterface} e The event that is being listened for.
     * @returns {boolean} false
     */
    handleEvent(e) {

        let target = e.target;
        let dataset = target.dataset;
        let action = dataset.action;
        let c = target.dataset.chapter;
        let s = target.dataset.section;

        if ("modal-backdrop" == target.id) {
            this.modal.hide();
        }

        if (!["view-section", "show-ors"].includes(action)) {
            return false;
        }

        e.preventDefault();
        // e.stopPropagation();

        if ("view-section" == action) {

            let marker = document.querySelector("#modal #section-" + s);
            marker.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            return false;
        }

        if ("show-ors" == action) {
            this.displayOrs(c, s);
            return false;
        }
    }

    /**
     * Load the specified chapter of Oregon Revised Statutes (ORS).
     * Display the chapter in a modal and scroll to the specified section.
     * @param {integer} c The ORS chapter to display.
     * @param {integer} s The ORS section to display.
     * @returns {boolean} false
     */
    async displayOrs(c, s) {

        let chapterNum = parseInt(c);
        let sectionNum = parseInt(s);

        let chapter = await OregonLegislatureNetwork.fetchOrs({chapter: chapterNum});

        // let vols = Ors.buildVolumes();
        let toc = chapter.buildToc();
        let html = chapter.toString();
        html = OrsParser.replaceAll(html);

        this.modal.show();
        this.modal.leftNav(toc);
        this.modal.html(html);
        this.modal.title("ORS Chapter " + chapterNum);
        let marker = document.querySelector("#modal #section-" + sectionNum);
        marker.scrollIntoView();
        // modal.titleBar(vols);


        return false;
    }


    /**
     * Replace references to Oregon Revised Statutes (ORS)
     * with inline links.
     * @param {CSSSelector} selector A valid CSS selector to pass to querySelector().
     */
    convert(selector) {
        var body = document.querySelector(selector);

        let nodes = body.querySelectorAll("p");
        for(var p of nodes.values()) {
            let text = OrsParser.replaceAll(p.innerHTML);
            p.innerHTML = text;
        }
        // var text = body.innerHTML;
        // var parsed = OrsParser.replaceAll(text);

        // body.innerHTML = parsed;
    }

}