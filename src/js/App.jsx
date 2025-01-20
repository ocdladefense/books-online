/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { vNode, useEffect, useState } from "@ocdla/view";

import Navbar from "@ocdla/global-components/src/Navbar";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs";
import BookPicker from "@ocdla/global-components/src/BookPicker";
import Footer from "@ocdla/global-components/src/Footer";
import TableOfContents from "@ocdla/global-components/src/TableOfContents.jsx";
import OutlineSidebar from "@ocdla/global-components/src/OutlineSidebar.jsx";
import Outline from "@ocdla/outline";
import Hammer from "hammerjs";
import panHandler from '@ocdla/hammer-wrapper';



import { loadIndex, getChapterList, getBookList, getContent, loadChapter, addIntersectionObserver } from "./helper";

const USE_HAMMER = true;

export default function App() {
  // Get routing from the URL
  const urlParts = window.location.pathname.split('/');
  const _book = urlParts[1] || 'fsm';
  const _chapter = urlParts[2] || '1';

  const [book, setBook] = useState(_book);
  const [chapter, setChapter] = useState(_chapter);
  const [html, setHtml] = useState(null);
  const [bookList, setBookList] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [toc, setToc] = useState([]);
  const [outline, setOutline] = useState([]);
  const [interectionElems, setIntersectionElems] = useState([]);


  useEffect(() => {
    async function doBookList() {
      const index = await loadIndex();
      const __bookList = getBookList(index);
      setBookList(__bookList);
    }
    doBookList();
  }, []);


  useEffect(() => {
    async function doCrumbs() {
      const index = await loadIndex();
      const bookNode = index.querySelector(`[shortName='${book}']`);
      const chapterNode = index.querySelector(`[id='${book}-${chapter}']`);
      const crumbs = [{ href: '/' + book, label: bookNode.getAttribute("name") }, { href: '/' + book + '/' + chapter, label: chapterNode.getAttribute("name") }];
      setBreadcrumbs(crumbs);
    };
    doCrumbs();
  }, [book, chapter]);

  useEffect(() => {
    async function fetchData() {
      let __html = await getContent(book, chapter);
      setHtml(__html);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    fetchData();
  }, [book, chapter]);

  useEffect(() => {
    async function doOutline() {
      let doc = await loadChapter(book, chapter);
      const opts = { selectors: [".level1", ".level2", ".level3"] };
      const outline = new Outline(opts);
      setOutline(outline.build(doc));
      setIntersectionElems(outline.build(doc, true));
    }
    doOutline();
  }, [book, chapter]);

  useEffect(() => {
   addIntersectionObserver(interectionElems);
  }, [interectionElems]);


  useEffect(() => {
    async function doToc() {
      const index = await loadIndex();
      const __toc = getChapterList(book, index);
      setToc(__toc);
    }
    doToc();
  }, [book])

  useEffect(() => {
    if (!USE_HAMMER) return;
      // A timeout of 0 will execute code after the current execution stack has finished, which is after the component has rendered.
      // This is a work around for us not having useLayoutEffect.
      // setTimeout(() => {
        console.log("Using hammer");
        const touchArea = document;
        const hammer = new Hammer(touchArea, {
          inputClass: Hammer.TouchInput
        });
        hammer.get("pan").set({ threshold: 20 });
        hammer.on("pan doubletap", (ev) => panHandler(ev));
      //}, 0);
    // }
  }, []);

  // This should be executed just once when the page loads.
  // useEffect(function () { setHeading("Hello World!"); }, []);

  // useEffect(() => {
  //   console.log("rendered");
  //   console.log("chapter", chapter);
  //   console.log("book", book);
  //   //console.log("html", html);
  //   //console.log("index", index);
  //   //console.log("bookList", bookList);
  //   //console.log("toc", toc);
  //   //console.log("outline", outline);
  //   //console.log("breadcrumbs", breadcrumbs);
  // })


  return (
    <div id="the-app-container">
      <div class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'></div>
      <header class="container mx-auto flex w-full flex-col bg-white lg:h-32 top-of-page">
        <Navbar />
      </header>


      {/* <Main cols='3' /> */}
      <div class="container mx-auto border-x">
        <div id="bookpicker" class="sticky top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
          <BookPicker onBookChange={setBook} onChapterChange={setChapter} books={bookList} currentBook={book} />
        </div>
        <div id="breadcrumbs" class="bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
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
            <TableOfContents onChapterChange={setChapter} currentChapter={chapter} entries={toc} />
          </div>
          <div
            id="document"
            class="flex w-full flex-col gap-4 p-4 lg:col-span-4 lg:col-start-2 lg:me-auto lg:border-x lg:p-8"
          >
            <div
              id="body"
              class="flex flex-col gap-4 subpixel-antialiased overflow-wrap break-words"
            >
              <div dangerouslySetInnerHTML={html}>Loading...</div>
            </div>
          </div>
          <div id="outline" class="fixed top-0 left-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:left-auto bg-white">
            <aside class='sticky top-0 hidden h-full lg:h-[87.5vh] overflow-y-scroll lg:block overflow-x-clip'>
              <OutlineSidebar items={outline} />
            </aside>
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
