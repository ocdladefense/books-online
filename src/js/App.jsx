/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { vNode } from "@ocdla/view";
import Navbar from "@ocdla/global-components/src/Navbar";
import Breadcrumbs from "@ocdla/global-components/src/Breadcrumbs";
import Footer from "@ocdla/global-components/src/Footer";

export default function App({ }) {

  return (
    <>
      <div
        // Preserve whitespace at end of top-0
        // prettier-ignore
        class='fixed right-0 z-10 flex w-max gap-2 bg-white p-4 lg:left-0 lg:p-2'
      ></div>
      <header class="container mx-auto flex w-full flex-col bg-white lg:h-32 top-of-page">
        <Navbar />

      </header>


      {/* <Main cols='3' /> */}
      <div class="container mx-auto border-x">
        <div id="breadcrumbs" class="sticky top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent">
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
          <div id="toc" class="fixed top-0 right-[100%] z-10 h-screen shadow-2xl lg:shadow-none lg:h-auto lg:static lg:top-auto lg:right-auto bg-white"></div>
          <div
            id="document"
            class="flex w-full flex-col gap-4 p-4 lg:col-span-4 lg:col-start-2 lg:me-auto lg:border-x lg:p-8"
          >
            <div
              id="body"
              class="flex flex-col gap-4 subpixel-antialiased overflow-wrap break-words"
            ></div>
          </div>
          <div id="outline" class="fixed top-0 left-[100%] z-10 h-screen shadow-2xl lg:shadow-none lg:h-auto lg:static lg:top-auto lg:left-auto bg-white"></div>
        </div>
      </div>
      <Footer
        showFacebook={true}
        showTwitter={true}
        useGoogleMapsIFrame={true}
      />
    </>
  );
}
