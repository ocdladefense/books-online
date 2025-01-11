/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { vNode, useEffect, useState } from "@ocdla/view";

import Navbar from "@ocdla/global-components/src/Navbar";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs";
import Footer from "@ocdla/global-components/src/Footer";
import TableOfContents from "./components/TableOfContents";
import OutlineSidebar from "@ocdla/global-components/src/Outline.jsx";



import { loadIndex, getChapterList, getBookList, getBreadcrumbs, getContent, outliner } from "./helper";


export default function App() {

  const [html, setHtml] = useState(null);
  const [index, setIndex] = useState(null);
  const [book, setBook] = useState("fsm");
  const [chapter, setChapter] = useState("1");
  const [breadcrumbs, setBreadcrumbs] = useState(null);
  const [toc, setToc] = useState([]);
  const [outline, setOutline] = useState([]);

  /* @SullivanKE: Executes once during page load to fetch the index file.
   setIndex does not trigger updates if it is inside an async function.
   index is then set as a promise and unpacked later.
   I don't like this solution and I feel like it is a work around for something that has a more direct solution.
   */
  useEffect(() => {
    async function fetchIndexFile() {
      const index = await loadIndex();
      setIndex(index);
      console.log("index set");
    };
    fetchIndexFile();
  }, []);


  /* @SullivanKE: Executes every time the book or chapter changes.
  It also updates when the index is loaded.
  Index is a promise right now I know it shouldn't be unpacked more than once.
  This was the only way I could make the breadcrumbs render on page load, and not only when the chapter changed.
   */
  useEffect(() => {
    let doCrumbs = async () => {
      if (!index) return;
      const crumbs = await getBreadcrumbs(book, chapter);
      setBreadcrumbs(crumbs);
    };

    doCrumbs();
  }, [index, book, chapter]);



  useEffect(() => {
    async function fetchData() {
      let __html = await getContent(book, chapter);
      setHtml(__html);
      const chapterRendered = new CustomEvent("onChapterContentRendered", { detail: { doc: __html } });
      document.dispatchEvent(chapterRendered);
    }
    fetchData();
  }, [book, chapter]);

  useEffect(() => {
    function doOutline() {
      const __outline = outliner(html);
      setOutline(__outline);
      //outliner.addIntersectionObserver(outliner.handleIntersection);
    }
    doOutline();
  }, [html, book, chapter]);


  useEffect(() => {

    let doToc = async () => {
      if (!index) return;
      const __toc = await getChapterList(book);
      setToc(__toc);
    }
    doToc();
  }, [index, book])

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
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
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
          <div id="toc" class="fixed top-0 right-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:right-auto bg-white">
            <TableOfContents entries={toc} />
          </div>
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
          <div id="outline" class="fixed top-0 left-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:left-auto bg-white">
            <OutlineSidebar>{outline}</OutlineSidebar>
          </div>
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
