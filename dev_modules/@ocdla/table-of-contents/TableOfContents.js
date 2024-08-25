import Entry from "./Entry";

export default class TableOfContents {
  #entries = new Array();

  constructor(entries) {
    this.#entries = entries;
  }

  static fromXml(doc) {
    const items = [...doc.querySelectorAll("part, chapter, appendix")];
    const entries = items.map((item) => {
      return new Entry(
        item.getAttribute("name"),
        item.getAttribute("label"),
        item.id
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
