/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { vNode, useEffect, useState } from "@ocdla/view";
import HttpClient from "@ocdla/lib-http/HttpClient.js";
import Navbar from "@ocdla/global-components/src/Navbar";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs";
import Footer from "@ocdla/global-components/src/Footer";
import TableOfContents from "@ocdla/table-of-contents";


const USE_HAMMER = false;



/**
 * Fetches the specified chapter of a book from the OCDLA publications website.
 *
 * @param {string} book - The title of the book to fetch a chapter from.
 * @param {string} chapter - The chapter number to fetch.
 * @return {string} The text content of the chapter.
 */
async function fetchChapter(book, chapter) {
  const url = `https://pubs.ocdla.org/${book}/${chapter}`;
  const req = new Request(url);
  const client = new HttpClient();
  const resp = await client.send(req);
  const html = await resp.text();

  return html;
}

function getChapterList(index, book) {
  const elems = index.querySelectorAll(`book[shortName="${book}"] > * > :is(part, chapter, appendix)`);
  return TableOfContents.fromXml(elems);
}

function getBookList(index) {
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
async function renderContent(book, unit) {


  // Display the content of the chapter.
  return fetchChapter(book, unit).then((html) => {

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




export default function App({ index }) {

  const [html, setHtml] = useState(null);
  const [book, setBook] = useState("fsm");
  const [chapter, setChapter] = useState("1");
  const [breadCrumbs, setBreadCrumbs] = useState([]);
  const [tableOfContents, setTableOfContents] = useState([]);

  /* @SullivanKE: Executes once during page load to fetch the index file.
   setIndex does not trigger updates if it is inside an async function.
   index is then set as a promise and unpacked later.
   I don't like this solution and I feel like it is a work around for something that has a more direct solution.
   */



  /* @SullivanKE: Executes every time the book or chapter changes.
  It also updates when the index is loaded.
  Index is a promise right now I know it shouldn't be unpacked more than once.
  This was the only way I could make the breadcrumbs render on page load, and not only when the chapter changed.
   */
  useEffect(() => {
    function updateBreadcrumbs(book = null, unit = null) {
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

      setBreadCrumbs(crumbs);
    }

    updateBreadcrumbs(book, chapter);

    async function fetchData() {
      let __html = await renderContent(book, chapter);
      setHtml(__html);
    }
    fetchData();
  }, [book, chapter]);

  // This should be executed just once when the page loads.
  // useEffect(function () { setHeading("Hello World!"); }, []);


  return (
    <div id="the-app-container">
      <div class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'></div>
      <header class="container mx-auto flex w-full flex-col bg-white lg:h-32 top-of-page">
        <Navbar />
      </header>


      {/* <Main cols='3' /> */}
      <div class="container mx-auto border-x">
        <div id="breadcrumbs" class="sticky top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
          <Breadcrumbs items={breadCrumbs} />
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
          <div id="toc" class="fixed top-0 right-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:right-auto bg-white"></div>
          <div
            id="document"
            class="flex w-full flex-col gap-4 p-4 lg:col-span-4 lg:col-start-2 lg:me-auto lg:border-x lg:p-8"
          >
            <div
              id="body"
              class="flex flex-col gap-4 subpixel-antialiased overflow-wrap break-words"
            >
              <button style="background-color:#000;" onclick={() => { setBook("fsm"); setChapter("2"); }}>Load next chapter</button>
              {!html && <p>Loading...</p>}
              <div dangerouslySetInnerHTML={html}> </div>
            </div>
          </div>
          <div id="outline" class="fixed top-0 left-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:left-auto bg-white"></div>
        </div>
      </div>
      <Footer
        showFacebook={true}
        showTwitter={true}
        useGoogleMapsIFrame={true}
      />
    </div>
  );
}
