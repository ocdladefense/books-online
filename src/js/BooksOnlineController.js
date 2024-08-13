import domReady from "@ocdladefense/web/src/web.js";
import "@ocdladefense/html/html.js";
import { OrsParser } from "@ocdladefense/ors/src/OrsParser.js";
import { Modal } from "@ocdladefense/modal/dist/modal.js";
import WebcOrs from "@ocdladefense/webc-ors/src/WebcOrs.js";
import WebcOar from "@ocdladefense/webc-oar/src/WebcOar.js";
import { formatReferences, doRefs } from "../../dev_modules/citations/citations.js";
import loadToc from "./components/Toc.js";
import Outline from "@ocdla/outline";
import HttpClient from "@ocdla/lib-http/HttpClient.js";
import Url from "@ocdla/lib-http/Url.js";
import TableOfContents from "@ocdla/table-of-contents";

import { DomDocument } from "@ocdladefense/dom/src/DomDocument.js";

/**
 * Controller for the Books Online application.
 * Processes actions on behalf of the user.
 */
export default class BooksOnlineController {
  modal = null;


  async getIndex() {
    let client = new HttpClient();

    let resp = await client.send(new Request("https://pubs.ocdla.org/index"));

    let xml = await resp.text();

    const parser = new DOMParser();

    return parser.parseFromString(xml, "application/xml");
  }

  constructor() {

    // Build the table of contents.
    const tocReady = this.getIndex().then((xml) => {

      // Create a table of contents from the XML loaded.
      const toc = TableOfContents.fromXml(xml);

      // Create the html for the table of contents.
      const nodeTree = toc.toNodeTree();

      console.log(nodeTree);


      document.querySelector(".toc-content").replaceWith(nodeTree);
    });


    tocReady.then(() => {

      setSomethingAsActive("fsm-1");
      // Render the chapter.
      const book = tocItem.dataset.book;
      const chapter = tocItem.dataset.chapter;
      BooksOnlineController.renderContent(book, chapter);
    });

    function setSomethingAsActive(idSelector) {
      idSelector = "#" + idSelector;
      let tocItem = document.querySelector(idSelector);
      tocItem.setAttribute("class", "toc-active toc-item");
    }

    // Full-screen modal.
    this.modal = new Modal();
    window.modal = this.modal;

  

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





changeChapter(e) {


        e.preventDefault();
        e.stopPropagation();

        let target = e.target;
        let data = target.dataset;
        let id = target.id;

   
        let currentTarget = e.currentTarget;

        BooksOnlineController.removeClass(currentTarget, "toc-active");


        // Add the active class to the current item.
        target.classList.add("toc-active");

        // Render the chapter.
        const book = tocItem.dataset.book;
        const chapter = tocItem.dataset.chapter;
        BooksOnlineController.renderContent(book, chapter); 
        document.querySelector('.top-of-page').scrollIntoView({ behavior: "smooth" });
}


// Remove the active class from all siblings.
static removeClass(node, className) {
  // Remove the active class from all siblings.
 
  [...node.children].map((child) => {
    child.classList.remove(className);
  });
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

  static async fetchChapter(book, chapter) {

    const url = `https://pubs.ocdla.org/${book}/${chapter}`;
    const req = new Request(url);
    const client = new HttpClient();
    const resp = await client.send(req);
    return resp.text();
  }

  static async renderContent(book, chapter) {

    let chapterReady = BooksOnlineController.fetchChapter(book, chapter).then((html) => {
      const chapter = document.createElement('div');
      chapter.setAttribute('class', 'document');
      const doc = document.createElement('div');
      doc.innerHTML = html;
      let sections = doc.querySelectorAll('header, section');
      for (let i = 0; i < sections.length; i++) {
        chapter.appendChild(sections[i]);
      }
      document.querySelector('.document').replaceWith(chapter);
    });
      
    const outlineReady = chapterReady.then(() => {
      const outline = Outline.fromCurrentDocument();
      outline.outline(".level1", ".level2", ".level3", ".level4", ".level5", ".level6");
      document.querySelector(".outline").replaceChildren(outline.toNodeTree());

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

      const refsReady = outlineReady.then(() => {
        // Process all citations in this document. List the citations as HTML links.  These links can be selected by the customer to navigate to where the source is referenced in the chapter.
        let refContainer = document.querySelector("#all-refs");
        let citations = document.querySelectorAll(".cite");
        let refs = document.querySelectorAll("[references], .cite");

        document.addEventListener("click", this);
        BooksOnlineController.convert(".document");
        formatReferences(citations);
        doRefs(refs, refContainer);

      });


    }


}
