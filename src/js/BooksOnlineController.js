/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode, View } from "@ocdla/view";

// Unused imports
import domReady from "@ocdladefense/web/src/web.js";
import WebcOrs from "@ocdladefense/webc-ors/src/WebcOrs.js";
import WebcOar from "@ocdladefense/webc-oar/src/WebcOar.js";
import {
  formatReferences,
  doRefs,
} from "../../dev_modules/citations/citations.js";
import { DomDocument } from "@ocdladefense/dom/src/DomDocument.js";

import "@ocdladefense/html/html.js";
import { OrsParser } from "@ocdladefense/ors/src/OrsParser.js";
import { Modal } from "@ocdladefense/modal/dist/modal.js";

import HttpClient from "@ocdla/lib-http/HttpClient.js";

import Outline from "@ocdla/outline";
import TableOfContents from "@ocdla/table-of-contents";

// Global components
import "../css/input.css";
//import App from "./App";
import Footer from "@ocdla/global-components/src/Footer.jsx";
import Navbar from "@ocdla/global-components/src/Navbar.jsx";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs.jsx";
import Sidebar from "@ocdla/global-components/src/Sidebar.jsx";
import Body from "@ocdla/global-components/src/Body.jsx";

/**
 * Controller for the Books Online application.
 * Processes actions on behalf of the user.
 */
export default class BooksOnlineController {
  modal = null;

  constructor() {
    // TODO: Create base page with jsx
    const body = document.querySelector("body");
    const root = View.createRoot(body);
    root.render(
      <>
        <div
          // Preserve whitespace at end of top-0
          // prettier-ignore
          class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'
        ></div>
        <header class="sticky top-0 container mx-auto flex w-full flex-col bg-white lg:h-32">
          <Navbar />
          <Breadcrumbs items={[]} />
        </header>

        <div class="modal inline-modal" id="inline-ors">
          <div class="modal-container">
            <div class="modal-content">Loading...</div>
          </div>
        </div>

        {/* <Main cols='3' /> */}
        <div class="container mx-auto border-x">
          {/* <div class='flex flex-col lg:flex-row'> */}
          <div class="lg:grid lg:grid-cols-6">
            <div class="toc">
              <div class="toc-content"></div>
            </div>

            <div class="workspace">
              <div class="top-of-page"></div>
              <div class="document"></div>
              <div class="outline"></div>
            </div>
          </div>
        </div>
        <Footer
          showFacebook={true}
          showTwitter={true}
          useGoogleMapsIFrame={true}
        />
      </>
    );

    // Build the table of contents.
    const tocReady = this.getIndex().then((xml) => {
      // Create a table of contents from the XML loaded.
      const toc = TableOfContents.fromXml(xml);

      // Create the html for the table of contents.
      const nodeTree = toc.toNodeTree();
      this.delegate("click", nodeTree, this.changeChapter);

      const tocContent = document.querySelector(".toc-content");

      // TODO: Jsx this
      tocContent.replaceWith(nodeTree);
    });

    tocReady.then(() => {
      TableOfContents.setActive("fsm-1");
      // Render the chapter.
      // const book = tocItem.dataset.book;
      // const chapter = tocItem.dataset.chapter;
      this.renderContent("fsm", "1");
    });

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

    this.renderContent = this.renderContent.bind(this);
    this.changeChapter = this.changeChapter.bind(this);
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

  async getIndex() {
    let client = new HttpClient();

    let resp = await client.send(new Request("https://pubs.ocdla.org/index"));

    let xml = await resp.text();

    const parser = new DOMParser();

    return parser.parseFromString(xml, "application/xml");
  }

  async fetchChapter(book, chapter) {
    const url = `https://pubs.ocdla.org/${book}/${chapter}`;
    const req = new Request(url);
    const client = new HttpClient();
    const resp = await client.send(req);
    return resp.text();
  }

  async changeChapter(container) {
    const id = container.id;
    const book = id.split("-")[0];
    const unit = id.split("-")[1];

    TableOfContents.removeClass(container.parentNode, "toc-active");

    // Add the active class to the current item.
    TableOfContents.setActive(id);

    this.renderContent(book, unit);
    document
      .querySelector(".top-of-page")
      .scrollIntoView({ behavior: "smooth" });
  }

  async renderContent(book, unit) {
    let chapterReady = this.fetchChapter(book, unit).then((html) => {
      const unit = document.createElement("div");
      unit.setAttribute("class", "document");
      const doc = document.createElement("div");
      doc.innerHTML = html;
      let sections = doc.querySelectorAll("header, section");
      for (let i = 0; i < sections.length; i++) {
        unit.appendChild(sections[i]);
      }

      // TODO: Jsx this 2
      document.querySelector(".document").replaceWith(unit);
    });

    const outlineReady = chapterReady.then(() => {
      const outline = Outline.fromCurrentDocument();
      outline.outline(
        ".level1",
        ".level2",
        ".level3",
        ".level4",
        ".level5",
        ".level6"
      );

      // TODO: Jsx this 3
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

    // const refsReady = outlineReady.then(() => {
    //   // Process all citations in this document. List the citations as HTML links.  These links can be selected by the customer to navigate to where the source is referenced in the chapter.
    //   let refContainer = document.querySelector("#all-refs");
    //   let citations = document.querySelectorAll(".cite");
    //   let refs = document.querySelectorAll("[references], .cite");

    //   document.addEventListener("click", this);
    //   BooksOnlineController.convert(".document");
    //   formatReferences(citations);
    //   doRefs(refs, refContainer);
    // });
  }

  getNodeChildrenEventHandler(e, elem, fn) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const children = [...elem.children];
    const container = children.filter((child) => child.contains(target))[0];

    if (!container) return false;
    fn(container);
  }

  delegate(type, elem, fn) {
    return elem.addEventListener(type, (e) =>
      this.getNodeChildrenEventHandler(e, elem, fn)
    );
  }
}
