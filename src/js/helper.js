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

  return html;
}

export function getChapterList(index, book) {
  const elems = index.querySelectorAll(`book[shortName="${book}"] > * > :is(part, chapter, appendix)`);
  return TableOfContents.fromXml(elems);
}

export function getBookList(index) {
  const elems = index.querySelectorAll('book');
  return TableOfContents.fromXml(elems);
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
  return loadChapter(book, unit).then((html) => {

    const parser = new DOMParser();

    const doc2 = parser.parseFromString(html, "text/html");
    // import node function

    let sections = doc2.querySelectorAll("header, section");
    let fragment = doc2.createDocumentFragment();
    fragment.append(...sections);
    const s = new XMLSerializer();

    return s.serializeToString(fragment);
  });
}




export function getBreadcrumbs(book = null, unit = null) {
  const bookNode = index.querySelector(`book[shortName='${book}']`) || index.firstElementChild;
  const books = getBookList(index).getEntries();
  const bookEntries = books.map(b => ({ label: b.getName(), href: b.getHref() }));

  const crumbs = [
    {
      href: '/' + bookNode.getAttribute("shortName"),
      label: bookNode.getAttribute("name"),
      entries: bookEntries
    }
  ];

  if (unit) {
    const unitId = book + '-' + unit;
    const unitNode = bookNode.querySelector(`[id='${unitId}']`);

    crumbs.push({
      href: '/' + book + '/' + unit,
      label: unitNode.getAttribute("name"),
    });
  }

 return crumbs;
}
//if (index)
//  index.then((data) => updateBreadcrumbs(data, book, chapter));
