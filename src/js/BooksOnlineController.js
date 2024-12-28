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
import Hammer from "hammerjs/hammer.js";

/**
 * Controller for the Books Online application.
 * Processes actions on behalf of the user.
 */
export default class BooksOnlineController {
  modal = null;
  #index;

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
          <div class="grid lg:grid-cols-6" id="touch-area">
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
    const indexReady = this.getIndex().then((xml) => {
      this.#index = xml;
    });

    // Build the table of contents.
    const tocReady = indexReady.then(() => {
      // Get the book from the URL.
      const book = this.getBook();

      return this.changeBook(book);
    
    });

    tocReady.then(() => {
      // Add event listener for the toc
      this.delegate(
        "click",
        document.querySelector("#toc-sidebar"),
        this.changeChapter
      );


      // This uses the Hammer.js library to detect panning on the page.
      const toc = document.querySelector("#toc");
      const tocContent = toc.firstChild;
      const bookContent = document.querySelector("#document");
      const outline = document.querySelector("#outline");
      
      const touchArea = document.querySelector("#touch-area");
      const hammer = new Hammer(touchArea);

      // listen to events...
      hammer.on("panright panleft", (ev) => {
          const delta = ev.deltaX;
          const outlineContent = outline.firstChild || outline;
          
        console.log(delta);
        // Update the TOC's position based on the delta

        if (delta !== 0) {
          requestAnimationFrame(() => {
            toc.style.transform = `translateX(${Math.min(delta, 110)}px)`;
            bookContent.style.transform = `translateX(${Math.min(delta, 110)}px)`;
          });
        }
        

        outline.style.transform = 'translateX(100%)';
        outlineContent.classList.add('show');
        outlineContent.classList.remove('hidden');
        tocContent.classList.add('show');
        tocContent.classList.remove('hidden');


        touchArea.classList.add('grid-cols-2');

        // If the pan event ends, check if the TOC should be fully shown or hidden
        if (ev.isFinal) {
          if (delta > 50) {
            // Fully show the TOC
            toc.style.transform = 'translateX(0)';
            bookContent.style.transform = 'translateX(0)';
          // } else if (delta < -50) {
          //   // Fully show the Outline
          } else {
            // Hide the TOC
            touchArea.classList.remove('grid-cols-2');
            toc.classList.remove('show');
            tocContent.classList.add('hidden');
            toc.style.transform = 'translateX(-100%)';
            bookContent.style.transform = 'translateX(0%)';
          }
        }
      });

     

      const newSelectedChapter = document.getElementById("fsm-1");
      if (newSelectedChapter) {
        newSelectedChapter.classList.add("text-white");
        newSelectedChapter.classList.add("border-black");
        newSelectedChapter.classList.add("bg-black");
      }
      // Render the chapter.
      const book = this.getBook() || 'fsm';
      const chapter = this.getChapter() || '1';
      this.renderContent(book, chapter);
      this.updateBreadcrumbs(`${book}-${chapter}`);
      

      
    });

    // // Full-screen modal.
    // this.modal = new Modal();
    // window.modal = this.modal;

    // customElements.define("word-count", WordCount, { extends: "p" });


    

    this.renderContent = this.renderContent.bind(this);
    this.changeChapter = this.changeChapter.bind(this);
    this.changeBook = this.changeBook.bind(this);
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

    if (e.type === "change" && e.target.id === "breadcrumbs-dropdown") {
      console.log(e);
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

  changeBook(container) {
    let book = container;
    if (container instanceof Element) 
      book = container.querySelector("#breadcrumbs-dropdown").value;
    
    if (book[0] == "/") 
      book = book.substring(1);
    
    
    // Filter the table of contents for the current book.
    let index = null;
    if (!book) {
      index = TableOfContents.fromXml(
        this.#index,
        "book"
      );
    }
    else {
      const filteredXml = this.#index.querySelector(`book[shortName="${book}"]`);
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

    console.log("HERE", tocEntries);

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
  }

  /**
   * Updates the breadcrumbs based on the given Chapter ID.
   *
   * @param {string} id - The ID of the chapter in the XML index.
   * @return {void}
   */
  updateBreadcrumbs(id) {
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
    console.log(books);
    
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

      this.delegate(
        "change",
        document.querySelector("#breadcrumbs"),
        this.changeBook
      );

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

    // Display the outline of the chapter once the content has been rendered.
    const outlineReady = chapterReady.then(() => {
      const outline = Outline.fromCurrentDocument();

      // Books-Online content is in section tags with .level1, .level2, etc.
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

      // Callback function used to detect where the user is on the page.
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

        // When we see a new item, we want to make sure the outline sidebar is scrolling to it.
        outlineListItem.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "center",
        });

        // Add the active class styling to the current item.
        outlineListItem.classList.add("bg-black");
        outlineListItem.classList.add("text-white");
      };

      // Add the callback function to the intersection observer.
      outline.addIntersectionObserver(handleIntersection);
    });

    // Future feature: Setting up WebC-ORS and WebC-OAR components here.
    // const refsReady = outlineReady.then(() => {

    //})

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
  
}
