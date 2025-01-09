import Entry from "./Entry";

export default class TableOfContents {
  #entries = new Array();

  constructor(entries) {
    this.#entries = entries;
  }

  // static fromXml(doc) {
  //   let selectors = Array.from(arguments).map((arg) =>
  //     typeof arg === "string" ? arg.toLowerCase().trim() : arg
  //   );
  //   selectors.shift();

  //   // Take a comma separated string of html selectors
  //   const items = [...doc.querySelectorAll(selectors.join(","))];

  //   const entries = items.map((item) => {
  //     return new Entry(
  //       item.getAttribute("name"),
  //       item.getAttribute("label") || item.getAttribute("name"),
  //       item.id || item.getAttribute("shortName")
  //     );
  //   });
  //   return new TableOfContents(entries);
  // }

  static fromXml(elems) {
    elems = Array.from(elems);
    const entries = elems.map((elem) => {
      return new Entry(
        elem.getAttribute("name"),
        elem.getAttribute("label") || elem.getAttribute("name"),
        elem.id || elem.getAttribute("shortName")
      );
    });
    return new TableOfContents(entries);
  }

  getEntries() {
    return this.#entries;
  }

  toNodeTree() {
    // Make our table of contents root element
    const root = document.createElement("div");
    root.setAttribute("class", "toc-content");

    let entries = this.#entries.map((entry) => {
      return entry.toNode();
    });

    // Loop through our chapters and add them to the table of contents
    entries.forEach((node) => {
      // Make our table of contents item

      root.appendChild(node);
    });

    return root;
  }

  static setActive(idSelector) {
    idSelector = "#" + idSelector;
    let tocItem = document.querySelector(idSelector);
    tocItem.setAttribute("class", "toc-active toc-item");
  }

  static removeClass(node, className) {
    // Remove the active class from the table of contents.

    [...node.children].map((child) => {
      child.classList.remove(className);
    });
  }
}
