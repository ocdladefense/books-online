import HttpClient from "@ocdla/lib-http/HttpClient.js";
import TableOfContents from "@ocdla/table-of-contents";

let index;

export async function loadIndex() {
  let client = new HttpClient();
  let resp = await client.send(new Request("https://pubs.ocdla.org/index"));
  let xml = await resp.text();
  const parser = new DOMParser();
  index = parser.parseFromString(xml, "application/xml");

  return index;
}


/**
 * Fetches the specified chapter of a book from the OCDLA publications website.
 *
 * @param {string} book - The title of the book to fetch a chapter from.
 * @param {string} chapter - The chapter number to fetch.
 * @return {string} The text content of the chapter.
 */
export async function loadChapter(book, chapter) {
  const url = `https://pubs.ocdla.org/${book}/${chapter}`;
  const req = new Request(url);
  const client = new HttpClient();
  const resp = await client.send(req);
  const html = await resp.text();

  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

export function getChapterList(book, index) {
  if (!index) return '';
  const elems = index.querySelectorAll(`book[shortName="${book}"] > * > :is(part, chapter, appendix)`);
  const toc = TableOfContents.fromXml(elems);
  return toc.getEntries();
}

export function getBookList(index) {
  if (!index) return null;
  const elems = [...index.querySelectorAll('book')];
  const bookList = elems.map((elem) => {
        return {
          name: elem.getAttribute("name"),
          shortName: elem.getAttribute("shortName"),
          default: elem.getAttribute("default")
        }
      });
  return bookList;
}



/**
   * Renders the content of a book chapter, including the chapter HTML and an outline of the chapter's sections.
   *
   * @param {string} book - The book shortname identifier.
   * @param {string} unit - The unit identifier. This could be for example a chapter number, section identifier, or an appendix identifier.
   * @return {void}
   */
export async function getContent(book, unit) {


  // Display the content of the chapter.
  return loadChapter(book, unit).then((doc) => {

    // import node function

    let sections = doc.querySelectorAll("header, section");
    let fragment = doc.createDocumentFragment();
    fragment.append(...sections);
    const s = new XMLSerializer();

    return s.serializeToString(fragment);
  });
}

export function addIntersectionObserver(items) {
  const intersectionObserver = new IntersectionObserver(handleIntersection);
  console.log(items);
  items.map((item) => {
    if (!item.href) return;
    let node = document.querySelector(`[id="${item.href}"]`);
    console.log(node);
    if (!node) return;
    intersectionObserver.observe(node);
    console.log(node);
  });
}

function handleIntersection(observedEntries) {
  console.log("handleIntersection");
  // Filter out entries that are not intersecting
  const intersectingEntries = observedEntries.filter(
    (entry) => entry.isIntersecting
  );

  // Make sure we have at least one entry remaining
  if (intersectingEntries.length == 0) return;

  // Iterate through our outline items and clear their styles.
  const activeElems = [...document.querySelectorAll("#outline .bg-black.text-white")] || [];
  activeElems.forEach((elem) => {
    elem.classList.remove("bg-black");
    elem.classList.remove("text-white");
  });

  // We only want the first entry. It's possible to scroll through multiple headings at once.
  const entry = intersectingEntries[0];
  const id = entry.target.id;
  const outlineListItem = document.querySelector(`[id='${id}-outline-item']`);

  //When we see a new item, we want to make sure the outline sidebar is scrolling to it.
  if (outlineListItem != null) {
    outlineListItem.scrollIntoView({
      behavior: "instant",
      block: "nearest",
      inline: "center",
    });

    // Add the active class styling to the current item.
    outlineListItem.classList.add("bg-black");
    outlineListItem.classList.add("text-white");
  }
};

