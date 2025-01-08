/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode, View } from "@ocdla/view";

import "@ocdladefense/html/html.js";
import HttpClient from "@ocdla/lib-http/HttpClient.js";
import TableOfContents from "@ocdla/table-of-contents";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs.jsx";
import Sidebar from "@ocdla/global-components/src/Sidebar.jsx";
import Sidebar_Item_Left from "@ocdla/global-components/src/SidebarItemLeft.jsx";
import Url from "@ocdla/lib-http/Url";
import App from "./App.jsx";


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
    root.render(<App />);



    const indexReady = this.getIndex().then((xml) => {
      this.#index = xml;
    });


    // Initial render of the table of contents.
    const tocReady = indexReady.then(() => {
      // Get the book from the URL.
      const book = this.getUrlPart(1);
      const tocEntries = this.filterXmlForToc(book).getEntries();
      return this.renderTableOfContents(tocEntries);
    });



    const pageReady = tocReady.then(() => {

      // Initial routing for BON.  Get the book and unit from the URL, and the fragment if any.
      const book = this.getUrlPart(1) || null;
      const unit = this.getUrlPart(2) || null;
      
      // Render the chapter.
      return this.updateViewState(book, unit);
    });


    pageReady.then(() => {
      // Get the fragment from the URL.
      const fragment = this.getUrlPart(3) || "";

      // If there is a fragment, scroll to it.
      if (fragment) {
        const scrollTarget = document.querySelector(`[id = "${fragment}"]`);
        if (scrollTarget) scrollTarget.scrollIntoView();
      }
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
    let dataset = target.dataset || {};
    let action = dataset.action;
    let c = dataset.chapter;
    let s = dataset.section;

    e.preventDefault();
    e.stopPropagation();


    /* Here we can handle click/touch events which get interpreted as changing books or changing chapter.*/
    // This doesn't handle Outline.
    if(e.type == "click") {
      if (target.closest('#toc-sidebar a') !== null) {
        const bookUnitId = target.closest('#toc-sidebar a').id;
        const book = bookUnitId.split("-")[0];
        let unit = bookUnitId.split("-")[1] || null;
        
        this.updateViewState(book, unit);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (target.closest('#outline a') !== null) {
        const outlineItem = target.closest('#outline a');
        window.location = outlineItem.href;
      }
    }

    /* This handles the dropdown to change books. */
    if (e.type === "change" && target.id === "breadcrumbs-dropdown") {
      const book = target.value.substring(1);
      this.updateViewState(book);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
   * Updates the view state of the application based on the specified book and unit.
   * If no book is specified, the entire catalog of BON is shown.
   * If no unit is specified, the table of contents for the book is shown and the default unit for the book is selected.
   * @param {string} [book=null] The name of the book to update the view state for.
   * @param {string} [unit=null] The identifier of the unit (e.g., chapter) within the book to update the view state for.
   */
  updateViewState(book = null, unit = null) {
    
    // If there is no book, show the entire catalog of BON and return.
    if (!book) {
      const tocEntries = this.filterXmlForToc().getEntries();
      this.renderTableOfContents(tocEntries);
      this.updateBreadcrumbs();
      return;
    }

    // If there is no unit, render the table of contents for the book and select the default unit for the book.
    if (unit == null) {
      const tocEntries = this.filterXmlForToc(book).getEntries();
      this.renderTableOfContents(tocEntries);
      unit = this.getDefaultBookEntry(book);
    }
    this.setActiveTocStyle(book, unit);
    this.renderContent(book, unit);
    this.updateBreadcrumbs(book, unit);
    
    const newRoute = `/${book}/${unit}`;
    this.updateHistory(newRoute);
  }


  
  /**
   * Filters the XML index to generate a TableOfContents object.
   *
   * If no book is provided, the top level book elements in the XML index are used to generate the
   * TableOfContents object. If a book is provided, a filtered version of the
   * XML index is used. The filtered index includes only children of the book
   * element with the provided shortName.
   *
   * @param {string} [book] The shortName of the book to filter by.
   * @return {TableOfContents} A TableOfContents object based on the filtered
   *   XML index.
   */
  filterXmlForToc(book = null) {
    if (!book) {
      return TableOfContents.fromXml(
        this.#index,
        "book"
      );
    }
    else {
      // This gets only the chapters in the book selected
      const filteredXml = this.#index.querySelector(`book[shortName="${book}"]`);
      return TableOfContents.fromXml(
        filteredXml,
        "part",
        "chapter",
        "appendix"
      );
    }
  }

  /**
   * Renders the table of contents into the toc div.
   *
   * @param {OrsTocEntry[]} tocEntries The entries to render in the table of contents.
   * @returns {Promise<void>} A promise that resolves when the table of contents
   *   has been rendered.
   */
  renderTableOfContents(tocEntries) {
    // Create a root
    const tocContent = View.createRoot(document.querySelector("#toc"));

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
   * Changes the currently selected TOC style in the table of contents.
   *
   * Removes the active class from the previously selected chapter,
   * adds the active class to the newly selected chapter.
   *
   * @param {string} book - The container element of the chapter to select.
   * @param {string} unit - The chapter, section, or appendix to select.
   * @return {void}
   */
  setActiveTocStyle(book, unit) {
    
    const toc = document.getElementById("toc");
    const oldSelectedUnit = toc.querySelector(
      ".text-white.border-black.bg-black"
    );
    if (oldSelectedUnit) {
      oldSelectedUnit.setAttribute(
        "class",
        "group hover:bg-neutral-100 flex flex-col gap-2 border-b px-4 py-2"
      );

      const h = oldSelectedUnit.querySelector("h1");
      if (h)
        h.setAttribute(
          "class",
          "text-blue-400 group-hover:text-blue-500 font-bold"
        );

      const p = oldSelectedUnit.querySelector("p");
      if (p) p.setAttribute("class", "");
    }

    // Add the active class to the current item.
    const newSelectedToc = document.getElementById(`${book}-${unit}`);
    if (newSelectedToc) {
      newSelectedToc.setAttribute(
        "class",
        "text-white border-black bg-black flex flex-col gap-2 border-b px-4 py-2"
      );
      const h = newSelectedToc.querySelector("h1");
      if (h) h.setAttribute("class", "font-bold");

      const p = newSelectedToc.querySelector("p");
      if (p) p.setAttribute("class", "text-white");
    }
  }

  /**
   * Gets a part of the current URL path by its index.
   *
   * @param {number} index
   *   The index of the part to get.
   *
   * @return {string}
   *   The part of the URL path at the given index.
   */
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
 * Updates the breadcrumb navigation based on the selected book and unit.
 *
 * Constructs a breadcrumb trail for the current view state, using the book and optionally the unit
 * within the book. Renders the breadcrumb trail using the Breadcrumbs component.
 *
 * @param {string} [book=null] - The short name identifier of the book.
 * @param {string} [unit=null] - The identifier of the unit (e.g., chapter) within the book.
 */
  updateBreadcrumbs(book = null, unit = null) {
    let breadCrumbs = [];

    const bookNode = this.#index.querySelector(`book[shortName='${book}']`) || this.#index.firstElementChild;
    const bookName = bookNode.getAttribute("name");
    const bookShortName = bookNode.getAttribute("shortName");
    const books = this.getBookList();
    breadCrumbs.push({
      href: '/' + bookShortName,
      label: bookName,
      entries: books
    })

    if (unit) {
      // This is a chapter in a book
      const unitId = book + '-' + unit;
      const unitNode = bookNode.querySelector(`[id='${unitId}']`);
      const unitName = unitNode.getAttribute("name");

      breadCrumbs.push({
        href: '/' + book + '/' + unit,
        label: unitName,
      })
    }
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
    this.fetchChapter(book, unit).then((html) => {

      const parser = new DOMParser();

      const doc2 = parser.parseFromString(html, "text/html");
      // import node function

      let sections = doc2.querySelectorAll("header, section");

      // Some entries have 2 or less sections, such as introductions, forewords, etc
      if (sections.length <= 2)
        sections = doc2.querySelectorAll("body");

      document.querySelector("#body").replaceChildren(...sections); 

      // Fire a custom event when the chapter is ready.
      // Fire a custom "onChapterContentRendered" event.
      const bookRendered = new CustomEvent("onChapterContentRendered");

      // Dispatch the event.
      document.dispatchEvent(bookRendered);
    });
  }

  /**
   * Retrieves a list of books from the index.
   *
   * @return {Array.<{label: string, href: string}>} An array of objects with label and href properties.
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

/**
 * Updates the browser's history state with a new route.
 *
 * Modifies the current history entry to reflect the new route provided,
 * without reloading the page.
 *
 * @param {string} newRoute - The new route to set in the browser's history.
 */

  updateHistory(newRoute) {
    const history = window.history;
    history.replaceState({}, '', newRoute);
  }

  /**
   * Retrieves the default entry for a given book. This is the book chapter, section, or appendix that is displayed when the book is first loaded.
   *
   * @param {string} book - The short name of the book.
   * @return {string} The default entry ID for the book.
   */
  getDefaultBookEntry(book) {
    return this.#index.querySelector(`book[shortName="${book}"]`).getAttribute("entry");
  }
  
}
