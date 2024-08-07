import domReady from "@ocdladefense/web/src/web.js";
import "@ocdladefense/html/html.js";
import { OrsParser } from "@ocdladefense/ors/src/OrsParser.js";
import { Modal } from "@ocdladefense/modal/dist/modal.js";
import WebcOrs from "@ocdladefense/webc-ors/src/WebcOrs.js";
import WebcOar from "@ocdladefense/webc-oar/src/WebcOar.js";
import { formatReferences, doRefs } from "../../dev_modules/citations/citations.js";
import loadToc from "./components/Toc.js";
import Outline from "@ocdla/outline";

import { DomDocument } from "@ocdladefense/dom/src/DomDocument.js";

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


    // customElements.define("word-count", WordCount, { extends: "p" });
    customElements.define("webc-ors", WebcOrs);
    customElements.define("webc-oar", WebcOar);

    // Process all citations in this document. List the citations as HTML links.  These links can be selected by the customer to navigate to where the source is referenced in the chapter.
    let refContainer = document.querySelector("#all-refs");
    let citations = document.querySelectorAll(".cite");
    let refs = document.querySelectorAll("[references], .cite");

    domReady(function () {
      document.addEventListener("click", this);
      BooksOnlineController.convert(".chapter");
      formatReferences(citations);
      doRefs(refs, refContainer);

      const outline = Outline.fromCurrentDocument();
      outline.outline("h1", "h2", "h3");
      document.querySelector(".outline").appendChild(outline.toNodeTree());

      const handleIntersection = (observedEntries) => {
        // Filter out entries that are not intersecting
        const intersectingEntries = observedEntries.filter(
          (entry) => entry.isIntersecting
        );

        // Make sure we have at least one entry remaining
        if (intersectingEntries.length == 0) return;

        // Iterate through our outline items and clear their styles.
        outline.clearAllActive();

        // We only want the first entry. It's possible to scroll through multiple headings at once.
        const entry = intersectingEntries[0];
        const id = entry.target.id;
        const outlineListItem = document.getElementById(`${id}-outline-item`);
        outlineListItem.scrollIntoView({ behavior: "auto", block: "center" });
        outlineListItem.classList.add("outline-item-active");
        outlineListItem.firstChild.classList.add("outline-item-active");
      };

      outline.addIntersectionObserver(handleIntersection);
    });

    // domReady(initOutline);

    // // Use these headings to create an on-the-fly outline of the document.
    // function initOutline() {
    //     let doc = new DomDocument();
    //     window.DomDocument = DomDocument;
    //     let nodeTree = doc.outline("h1, h2, h3"); // h1, h2, h3
    //     //nodes.forEach((node) => document.querySelector(".outline-content").appendChild(node));
    //     document.querySelector(".outline").appendChild(nodeTree);
    // }

    // Display table of contents (TOC) content and modal. This should display other chapters in the current publication.
    window.loadToc = loadToc();

    // Setup the chapter ouline and display it inside of the div.outline-content element.

    // Create the document outline and display it.
    // let nodes = doc.outline("h1, h2, h3"); // h1, h2, h3
    // nodes.forEach((node) => document.querySelector(".outline-content").appendChild(node));

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
      marker.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
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

    throw new Error("Need to perform fetch request here.");
    // let chapter = await OregonLegislatureNetwork.fetchOrs({chapter: chapterNum});

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
  static convert(selector) {
    var body = document.querySelector(selector);

    let nodes = body.querySelectorAll("p");
    for (var p of nodes.values()) {
      let text = OrsParser.replaceAll(p.innerHTML);
      p.innerHTML = text;
    }
    // var text = body.innerHTML;
    // var parsed = OrsParser.replaceAll(text);

    // body.innerHTML = parsed;
  }
}
