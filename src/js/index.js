/** @jsx vNode */ /** @jsxFrag "Fragment" */
// The new home of everything View related.
/* eslint-disable no-unused-vars */
import { View, vNode } from "@ocdla/view";
import App from "./App.jsx";
// Global components
import "../css/input.css";
// import BooksOnlineController from "./BooksOnlineController.js";
import "/themes/books-online/css/main.css";
import "/themes/books-online/css/citations.css";
import "/themes/books-online/css/headings.css";
import "/themes/books-online/css/toc.css";
import "/themes/books-online/css/modal.css";
import "/themes/books-online/css/tools.css";
import "/themes/books-online/css/desktop.css";
import HttpClient from "@ocdla/lib-http/HttpClient.js";
import Outliner from "./Outliner.js";
import Hammer from "hammerjs";
import panHandler from '@ocdla/hammer-wrapper';


import { BonMock } from "./mock/BonMock.js";

const USE_HAMMER = false;

if (USE_MOCK) {
  HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}

// Create the base view using jsx.
const container = document.querySelector("#app");
const root = View.createRoot(container);
root.render(<App />);


/*



let controller = new BooksOnlineController();

window.addEventListener("hashchange", controller);

// 
//     pageReady.then(() => {
//       // Get the fragment from the URL.
      

//       // If there is a fragment, scroll to it.
//       if (fragment) {
//         const scrollTarget = document.querySelector(`[id = "${fragment}"]`);
//         if (scrollTarget) scrollTarget.scrollIntoView();
//       }
//     });
//  

// Enable selection of various chapters in the table of contents.
document.addEventListener("click", controller);
*/

// Enable the loading of the chapter outline upon completion of the chapter content render.
//document.addEventListener("onChapterContentRendered", new Outliner());


/*
// Enable selection of books from the dropdown menu.
document.addEventListener("change", controller);



// This uses the Hammer.js library to detect panning on the page.


if(USE_HAMMER) {
  const touchArea = document.querySelector("#touch-area");
  const hammer = new Hammer(touchArea, {
    inputClass: Hammer.TouchInput
  });
  hammer.get("pan").set({ threshold: 20 });
  hammer.on("pan doubletap", (ev) => panHandler(ev));


}

*/