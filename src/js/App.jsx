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

  const [book, setBook] = useState('fsm');
  const [chapter, setChapter] = useState('1');
  const [title, setTitle] = useState();
  const [chapterTitle, setChapterTitle] = useState();
  const [chapterAuthors, setChapterAuthors] = useState();
  const [bookShortName, setBookShortName] = useState('fsm');
  const [edition, setEdition] = useState();
  const [html, setHtml] = useState();
  const [bookList, setBookList] = useState();
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

      const title = bookNode.querySelector('meta[name="title"]').getAttribute("content");
      const edition = bookNode.querySelector('meta[name="edition"]').getAttribute("content");
      const editor = bookNode.querySelector('meta[name="editor"]').getAttribute("content");
      const label = chapterNode.getAttribute("label");
      const name = chapterNode.getAttribute("name");
      const chapterTitle = `${label} - ${name}`;
      const authors = chapterNode.getAttribute("authors");
      const authorNode = chapterNode.querySelector("meta[name='authors']");
      const chapterAuthors = (authorNode && authorNode.getAttribute("content")) || authors || editor;

      setTitle(title);
      setEdition(edition);
      setChapterTitle(chapterTitle);
      setChapterAuthors(chapterAuthors);
      setBookShortName(book.toUpperCase());
      
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
      const opts = { selectors: [".level2", ".level3"] };
      const outline = new Outline(opts);
      setOutline(outline.build(doc));
      // setIntersectionElems(outline.build(doc, true));
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
    console.log("Using hammer");
    const touchArea = document;
    const hammer = new Hammer(touchArea, {
      inputClass: Hammer.TouchInput
    });
    hammer.get("pan").set({ threshold: 20 });
    hammer.on("pan doubletap", (ev) => panHandler(ev));
  }, []);




  return (
    <div id="the-app-container">
      <div class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'></div>
      <header class="container mx-auto flex w-full flex-col bg-white top-of-page">
        <Navbar />
      </header>


      {/* <Main cols='3' /> */}
      <div class="container mx-auto border-x">
        <div id="bookpicker" class="sticky top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
          <BookPicker onBookChange={setBook} onChapterChange={setChapter} books={bookList} currentBook={book} />
        </div>
        {/*<div id="breadcrumbs" class="bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
          <Breadcrumbs items={breadcrumbs} />
        </div>*/}
        <div class="bg-ocdla-dark-blue text-white p-16 pb-20">
          <p>OCDLA Books Online</p>
          <h1 class="text-4xl font-bold">{title}</h1>
          <p class="mt-4">{edition}</p>  
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
            <h2 class="text-3xl font-bold my-0">{chapterTitle}</h2>
            <h3 class="my-0">{chapterAuthors}</h3>  
            <h2 style="border-radius: 0px 0px 8px 8px; z-index:100;" class="my-0 sticky top-0 p-4 bg-ocdla-dark-blue text-white">{bookShortName} | {chapterTitle}</h2>
            <div dangerouslySetInnerHTML={html}>Loading...</div>
          </div>
          <div id="outline" class="fixed top-8 left-[100%] z-10 h-screen shadow-2xl max-w-[50vw] lg:shadow-none lg:h-auto lg:static lg:top-auto lg:left-auto bg-white">
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
