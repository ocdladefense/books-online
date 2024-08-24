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

import Footer from "@ocdla/global-components/src/Footer.jsx";
import Navbar from "@ocdla/global-components/src/Navbar.jsx";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs.jsx";
import Sidebar from "@ocdla/global-components/src/Sidebar.jsx";

import OutlineSidebar from "@ocdla/global-components/src/Outline.jsx";
import Sidebar_Item_Left from "@ocdla/global-components/src/Sidebar_Item_Left.jsx";

/**
 * Controller for the Books Online application.
 * Processes actions on behalf of the user.
 */
export default class BooksOnlineController {
  modal = null;

  constructor() {
    window.addEventListener("hashchange", this);

    // Create the base view using jsx.
    const body = document.querySelector("body");
    const root = View.createRoot(body);
    root.render(
      <>
        <div
          // Preserve whitespace at end of top-0
          // prettier-ignore
          class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'
        ></div>
        <header class="container mx-auto flex w-full flex-col bg-white lg:h-32 top-of-page">
          <Navbar />
          <div id="breadcrumbs">
            <Breadcrumbs items={[]} />
          </div>
        </header>

        <div class="modal inline-modal" id="inline-ors">
          <div class="modal-container">
            <div class="modal-content">Loading...</div>
          </div>
        </div>

        {/* <Main cols='3' /> */}
        <div class="container mx-auto border-x">
          <button
            onclick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            class="fixed bottom-0 right-0 z-10 rounded-lg p-4 bg-black text-white"
          >
            Top
          </button>
          {/* <div class='flex flex-col lg:flex-row'> */}
          <div class="lg:grid lg:grid-cols-6">
            <div id="toc"></div>
            <div
              id="document"
              class="flex w-full flex-col gap-4 p-4 lg:col-span-4 lg:col-start-2 lg:me-auto lg:border-x lg:p-8"
            >
              <div
                id="body"
                class="flex flex-col gap-4 leading-10 tracking-widest subpixel-antialiased overflow-wrap break-words"
              ></div>
            </div>
            <div id="outline"></div>
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

      // Create a root
      const tocContent = View.createRoot(document.querySelector("#toc"));

      // Get our entries in our toc
      const tocEntries = toc.getEntries();

      // Render the toc into the toc div
      tocContent.render(
        <Sidebar sticky={true}>
          <ul id="toc-sidebar" class="list-none">
            {tocEntries.map((entry) => {
              return (
                <Sidebar_Item_Left
                  active={false}
                  id={entry.getId()}
                  href={entry.getHref()}
                  heading={entry.isChapter() ? entry.getHeading() : null}
                  label={entry.getName()}
                >
                  <span class="font-bold">
                    {entry.isChapter() ? entry.getHeading() : null}
                  </span>
                  <div>{entry.getName()}</div>
                </Sidebar_Item_Left>
              );
            })}
          </ul>
        </Sidebar>
      );

      // Add an event listener to the toc
      this.delegate(
        "click",
        document.querySelector("#toc-sidebar"),
        this.changeChapter
      );
    });

    tocReady.then(() => {
      const newSelectedChapter = document.getElementById("fsm-1");
      if (newSelectedChapter) {
        newSelectedChapter.classList.add("text-white");
        newSelectedChapter.classList.add("border-black");
        newSelectedChapter.classList.add("bg-black");
      }
      // Render the chapter.
      // const book = tocItem.dataset.book;
      // const chapter = tocItem.dataset.chapter;
      this.renderContent("fsm", "1");

      this.updateBreadcrumbs("fsm-1");
    });

    // // Full-screen modal.
    // this.modal = new Modal();
    // window.modal = this.modal;

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
    let dataset = target.dataset || {};
    let action = dataset.action;
    let c = dataset.chapter;
    let s = dataset.section;

    e.preventDefault();
    e.stopPropagation();

    if (e.type === "hashchange") {
      let newId = e.newURL.split("#")[1];
      let newElem = document.getElementById(newId);
      console.log(newId);

      newElem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }); //({top: (rect.y + offset),behavior:"smooth"});

      return false;
    }

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
    const id = container.children[0].id;
    const book = id.split("-")[0];
    const unit = id.split("-")[1];

    this.updateBreadcrumbs(id);

    const toc = document.getElementById("toc");

    const oldSelectedChapter = toc.querySelector(
      ".text-white.border-black.bg-black"
    );
    if (oldSelectedChapter) {
      oldSelectedChapter.setAttribute(
        "class",
        "group hover:bg-neutral-100 flex flex-col gap-2 border-b px-4 py-2"
      );

      const h = oldSelectedChapter.querySelector("h1");
      if (h)
        h.setAttribute(
          "class",
          "text-blue-400 group-hover:text-blue-500 font-bold"
        );

      const p = oldSelectedChapter.querySelector("p");
      if (p) p.setAttribute("class", "");
    }

    // Add the active class to the current item.
    const newSelectedChapter = document.getElementById(id);
    if (newSelectedChapter) {
      newSelectedChapter.setAttribute(
        "class",
        "text-white border-black bg-black flex flex-col gap-2 border-b px-4 py-2"
      );
      const h = newSelectedChapter.querySelector("h1");
      if (h) h.setAttribute("class", "font-bold");

      const p = newSelectedChapter.querySelector("p");
      if (p) p.setAttribute("class", "text-white");
    }

    this.renderContent(book, unit);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async updateBreadcrumbs(id) {
    const index = await this.getIndex();
    const unit = index.querySelector(`#${id}`);
    const unitName = unit.getAttribute("name");
    const unitHref = id.replaceAll("-", "/");

    const bookNode = unit.closest("book");
    const bookName = bookNode.getAttribute("name");
    const bookHref = bookNode.getAttribute("shortName");

    const breadCrumbs = [
      {
        href: bookHref,
        text: bookName,
        type: "standard",
      },
      {
        href: unitHref,
        text: unitName,
        type: "standard",
      },
    ];
    const breadcrumbRoot = View.createRoot(
      document.getElementById("breadcrumbs")
    );
    breadcrumbRoot.render(<Breadcrumbs crumbs={breadCrumbs} />);
  }

  async renderContent(book, unit) {
    let chapterReady = this.fetchChapter(book, unit).then((html) => {
      const unit = document.createElement("div");
      unit.setAttribute("id", "body");
      const doc = document.createElement("div");
      doc.innerHTML = html;
      let sections = doc.querySelectorAll("header, section");
      for (let i = 0; i < sections.length; i++) {
        unit.appendChild(sections[i]);
      }

      // TODO: Jsx this
      document.querySelector("#body").replaceWith(unit);
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

      // Display the outline in the sidebar
      const outlineRoot = View.createRoot(document.querySelector("#outline"));
      outlineRoot.render(
        <OutlineSidebar>{outline.getNested()}</OutlineSidebar>
      );
      //document.querySelector(".outline").replaceChildren(outline.toNodeTree());

      const handleIntersection = (observedEntries) => {
        // Filter out entries that are not intersecting
        const intersectingEntries = observedEntries.filter(
          (entry) => entry.isIntersecting
        );

        // Make sure we have at least one entry remaining
        if (intersectingEntries.length == 0) return;

        // Iterate through our outline items and clear their styles.
        outline.clearAllActive(
          ".bg-black.text-white",
          document.querySelector("#outline")
        );

        // We only want the first entry. It's possible to scroll through multiple headings at once.
        const entry = intersectingEntries[0];
        const id = entry.target.id;
        const outlineListItem = document.getElementById(`${id}-outline-item`);
        // .scrollIntoView({ behavior: "auto", block: "center" });
        // outlineListItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        outlineListItem.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "center",
        });
        outlineListItem.classList.add("bg-black");
        outlineListItem.classList.add("text-white");
        //outlineListItem.firstChild.classList.add("outline-item-active");
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
