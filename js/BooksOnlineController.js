import OregonLegislatureNetwork from "../node_modules/@ocdladefense/ors/src/Network.js";
import { OrsParser } from "../node_modules/@ocdladefense/ors/src/OrsParser.js";
import { Modal } from "../node_modules/@ocdladefense/modal/dist/modal.js";



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