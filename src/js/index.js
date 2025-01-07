// Global components
import "../css/input.css";
import BooksOnlineController from "./BooksOnlineController.js";
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

if (USE_MOCK) {
  HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}

let controller = new BooksOnlineController();

window.addEventListener("hashchange", controller);
      
// Enable selection of various chapters in the table of contents.
document.addEventListener("click", controller);

// Enable selection of books from the dropdown menu.
document.addEventListener("change", controller);

// Enable the loading of the chapter outline upon completion of the chapter content render.
document.addEventListener("onChapterContentRendered", new Outliner());

// This uses the Hammer.js library to detect panning on the page.
const touchArea = document.querySelector("#touch-area");
const hammer = new Hammer(touchArea, {
  inputClass: Hammer.TouchInput
});
hammer.get("pan").set({ threshold: 20 });
hammer.on("pan doubletap", (ev) => panHandler(ev));


