/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { vNode, useEffect, useState } from "@ocdla/view";
import HttpClient from "@ocdla/lib-http/HttpClient.js";
import Navbar from "@ocdla/global-components/src/Navbar";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs";
import Footer from "@ocdla/global-components/src/Footer";


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



export default function App({ }) {

  const [html, setHtml] = useState(null);
  const [book, setBook] = useState("fsm");
  const [chapter, setChapter] = useState("1");

  // This should be executed just once when the page loads.
  // useEffect(function () { setHeading("Hello World!"); }, []);
  useEffect(() => {
    async function fetchData() {
      let __html = await renderContent(book,chapter);
      setHtml(__html);
    }

    fetchData();
  }, [book,chapter]);

  return (
    <div id="the-app-container">
      <div class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'></div>
      <header class="container mx-auto flex w-full flex-col bg-white lg:h-32 top-of-page">
        <Navbar />
      </header>


      {/* <Main cols='3' /> */}
      <div class="container mx-auto border-x">
        <div id="breadcrumbs" class="sticky top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
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
          <div id="toc" class="fixed top-0 right-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:right-auto bg-white"></div>
          <div
            id="document"
            class="flex w-full flex-col gap-4 p-4 lg:col-span-4 lg:col-start-2 lg:me-auto lg:border-x lg:p-8"
          >
            <div
              id="body"
              class="flex flex-col gap-4 subpixel-antialiased overflow-wrap break-words"
            >
              <button style="background-color:#000;" onclick={() => {setBook("fsm"); setChapter("2");}}>Load next chapter</button>
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
