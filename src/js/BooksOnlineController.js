/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode, View } from "@ocdla/view";

// Unused imports
// import {formatReferences,doRefs} from "../../dev_modules/citations/citations.js";
import "@ocdladefense/html/html.js";
import HttpClient from "@ocdla/lib-http/HttpClient.js";
import Outline from "@ocdla/outline";
import TableOfContents from "@ocdla/table-of-contents";
import Footer from "@ocdla/global-components/src/Footer.jsx";
import Navbar from "@ocdla/global-components/src/Navbar.jsx";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs.jsx";
import Sidebar from "@ocdla/global-components/src/Sidebar.jsx";
import OutlineSidebar from "@ocdla/global-components/src/Outline.jsx";
import Sidebar_Item_Left from "@ocdla/global-components/src/SidebarItemLeft.jsx";
import Url from "@ocdla/lib-http/Url";

// Is this the best syntax for these imports?
import Hammer from "hammerjs/hammer.js";
import { panHandler } from "/dev_modules/@ocdla/hammer-wrapper/HammerWrapper.js";

/**
 * Controller for the Books Online application.
 * Processes actions on behalf of the user.
 */
export default class BooksOnlineController {
  modal = null;
  #index;

  constructor() {
    

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
          
        </header>


        {/* <Main cols='3' /> */}
        <div class="container mx-auto border-x">
        <div id="breadcrumbs" class="sticky top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent">
            <Breadcrumbs items={[]} />
          </div>
          <button
            onclick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            class="fixed bottom-0 right-0 z-20 rounded-lg p-4 bg-black text-white"
          >
            Top
          </button>
          {/* <div class='flex flex-col lg:flex-row'> */}
          <div class="lg:grid lg:grid-cols-6" id="touch-area">
            <div id="toc" class="fixed top-0 right-[100%] z-10 h-screen shadow-2xl lg:shadow-none lg:h-auto lg:static lg:top-auto lg:right-auto bg-white"></div>
            <div
              id="document"
              class="flex w-full flex-col gap-4 p-4 lg:col-span-4 lg:col-start-2 lg:me-auto lg:border-x lg:p-8"
            >
              <div
                id="body"
                class="flex flex-col gap-4 subpixel-antialiased overflow-wrap break-words"
              ></div>
            </div>
            <div id="outline" class="fixed top-0 left-[100%] z-10 h-screen shadow-2xl lg:shadow-none lg:h-auto lg:static lg:top-auto lg:left-auto bg-white"></div>
          </div>
        </div>
        <Footer
          showFacebook={true}
          showTwitter={true}
          useGoogleMapsIFrame={true}
        />
      </>
    );


    // This uses the Hammer.js library to detect panning on the page.
    const touchArea = document.querySelector("#touch-area");
    const hammer = new Hammer(touchArea, {
      inputClass: Hammer.TouchInput
    });
    hammer.get("pan").set({ threshold: 20 });
    hammer.on("pan doubletap", (ev) => panHandler(ev));


    const indexReady = this.getIndex().then((xml) => {
      this.#index = xml;
    });


    // I think you're doing at least two things here; probably three.
    // Build the table of contents.
    const tocReady = indexReady.then(() => {
      // Get the book from the URL.
      const book = this.getBook();

      return this.changeBook(book);
    
    });



    tocReady.then(() => {

      /* @Katelyn will rework this if necessary.
      const newSelectedChapter = document.getElementById("fsm-1");
      
      if (newSelectedChapter) {
        newSelectedChapter.classList.add("text-white");
        newSelectedChapter.classList.add("border-black");
        newSelectedChapter.classList.add("bg-black");
      }
      */


      // Rudimetnary routing.
      const book = this.getUrlPart(1) || 'fsm';
      const chapter = this.getUrlPart(2) || '1';
      const fragment = this.getUrlPart(3) || '';
      // Render the chapter.
      this.renderContent(book, chapter);
      this.updateBreadcrumbs(`${book}-${chapter}`);
    });


  // this.renderContent = this.renderContent.bind(this);
    // this.changeChapter = this.changeChapter.bind(this);
    // this.changeBook = this.changeBook.bind(this);
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


    /* Here we can handle click/touch events which get interpreted as changing books or changing chapter.*/
    // This doesn't handle Outline.
    if(e.type == "click") {

    }

    if (e.type === "change" && e.target.id === "breadcrumbs-dropdown") {
      this.changeBook(e);
    }

    if (e.type === "hashchange") {
      let newId = e.newURL.split("#")[1];
      let newElem = document.getElementById(newId);

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

    // e.preventDefault();
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



  changeBook(container) {
    let book = container;
    if (container instanceof Element) 
      book = container.querySelector("#breadcrumbs-dropdown").value;
    
    if (book[0] == "/") 
      book = book.substring(1);
    
    
    // Filter the table of contents for the current book.
    let index = null;
    let entryChapter = null;
    if (!book) {
      index = TableOfContents.fromXml(
        this.#index,
        "book"
      );
    }
    else {
      // This gets only the chapters in the book selected
      const filteredXml = this.#index.querySelector(`book[shortName="${book}"]`);
      entryChapter = filteredXml.getAttribute("entry");
      index = TableOfContents.fromXml(
        filteredXml,
        "part",
        "chapter",
        "appendix"
      );
    }
    

    // Create a root
    const tocContent = View.createRoot(document.querySelector("#toc"));

    // Get our entries in our toc
    const tocEntries = index.getEntries();



    // Render the toc into the toc div
    // We need to return here so that we actually wait for the toc to be rendered
    return tocContent.render(
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
  }



  /**
   * Changes the currently selected chapter in the table of contents.
   *
   * Updates the breadcrumbs, removes the active class from the previously selected chapter,
   * adds the active class to the newly selected chapter, and renders the content of the new chapter.
   *
   * @param {HTMLElement} container - The container element of the chapter to select.
   * @return {void}
   */
  changeChapter(container) {
    const id = container.children[0].id;
    const book = id.split("-")[0];
    const unit = id.split("-")[1];

    if (!unit) this.changeBook(book);

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

    const newRoute = `/${book}/${unit || ""}`;
    this.updateHistory(newRoute);
  }






 /** Let's deprecate these in favor of a single getUrlPart() method. */
  getBook() {
   let url = new Url(window.location.href);
    let id = url.getPath();
    return id.split("/")[1];
  }
  getChapter() {
    let url = new Url(window.location.href);
    let id = url.getPath();
    return id.split("/")[2];
  }

  getFragment() {
    let url = new Url(window.location.href);
    let id = url.getPath();
    return id.split("/")[2];
  }




  getUrlPart(index) {
     let url = new Url(window.location.href);
    let parts = url.getPath().split(/[\/\#]/);

    return parts[index];
  }


    /**
   * Fetches the specified chapter of a book from the OCDLA publications website.
   *
   * @param {string} book - The title of the book to fetch a chapter from.
   * @param {string} chapter - The chapter number to fetch.
   * @return {string} The text content of the chapter.
   */
  async fetchChapter(book, chapter) {
    const url = `https://pubs.ocdla.org/${book}/${chapter}`;
    const req = new Request(url);
    const client = new HttpClient();
    const resp = await client.send(req);
    return resp.text();
  }

  /**
   * Retrieves the index from the specified URL and parses it into an XML document.
   *
   * @return {Document} The parsed XML document.
   */
  async getIndex() {
    let client = new HttpClient();

    let resp = await client.send(new Request("https://pubs.ocdla.org/index"));

    let xml = await resp.text();

    const parser = new DOMParser();

    return parser.parseFromString(xml, "application/xml");
  }



  /**
   * Updates the breadcrumbs based on the given Chapter ID.
   *
   * @param {string} id - The ID of the chapter in the XML index.
   * @return {void}
   */
  updateBreadcrumbs(id) {
    // Sanitize fragments from the id
    id = id.split("#")[0];

    let breadCrumbs = [];
    const unit = this.#index.querySelector(`#${id}`) || this.#index.querySelector(`book[shortName='${id}']`);

    if (id.indexOf("-") > -1) {
      // This is a chapter in a book
      const unitName = unit.getAttribute("name");
      const unitHref = id.replaceAll("-", "/");

      breadCrumbs.push({
        href: unitHref,
        label: unitName,
      })
    }

    const books = this.getBookList();
    
    const bookNode = unit.closest("book");
    const bookName = bookNode.getAttribute("name");
    const bookHref = bookNode.getAttribute("shortName");


    breadCrumbs.unshift({
      href: '/' + bookHref,
      label: bookName,
      entries: books
    })


      const breadcrumbRoot = View.createRoot(
        document.getElementById("breadcrumbs")
      );
      breadcrumbRoot.render(<Breadcrumbs crumbs={breadCrumbs} />);



  }

  /**
   * Renders the content of a book chapter, including the chapter HTML and an outline of the chapter's sections.
   *
   * @param {string} book - The book shortname identifier.
   * @param {string} unit - The unit identifier. This could be for example a chapter number, section identifier, or an appendix identifier.
   * @return {void}
   */
  renderContent(book, unit) {  


    // Display the content of the chapter.
    let chapterReady = this.fetchChapter(book, unit).then((html) => {

      const parser = new DOMParser();

      const doc2 = parser.parseFromString(html, "text/html");
      // import node function

      let sections = doc2.querySelectorAll("header, section");

      // Some entries have 2 or less sections, such as introductions, forewords, etc
      if (sections.length <= 2)
        sections = doc2.querySelectorAll("body");

      document.querySelector("#body").replaceChildren(...sections); 
    });


    // Fire a custom event when the chapter is ready.
    // Fire a custom "onChapterContentRendered" event.
  }



// @jbernal - Should go away; instead use our handleEvent() method.
  getNodeChildrenEventHandler(e, elem, fn) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const children = [...elem.children];
    const container = children.filter((child) => child.contains(target))[0];

    if (!container) return false;
    fn(container);
  }

// @jbernal - Should go away; instead use our handleEvent() method.
  /*
  delegate(type, elem, fn) {
    return elem.addEventListener(type, (e) =>
      this.getNodeChildrenEventHandler(e, elem, fn)
    );
  }
*/


  getBookList() {
    const books = TableOfContents.fromXml(
      this.#index,
      "book"
    ).getEntries();

    return books.map(b => ({
      label: b.getName(),
      href: b.getHref()
    }));
  }

  updateHistory(newRoute) {
    const history = window.history;
    history.replaceState({}, '', newRoute);
  }
  
}
