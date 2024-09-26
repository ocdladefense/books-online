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
import WebcOrs from "@ocdladefense/webc-ors/src/WebcOrs.js";
import {parseChapterAndSection, parseSubsections, parseReferences, toSelectors} from "@ocdladefense/ors/src/ReferenceParser.js";

import { BonMock } from "./mock/BonMock.js";

if (USE_MOCK) {
  HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}

window.parseChapterAndSection = parseChapterAndSection;
window.parseSubsections = parseSubsections;
window.parseReferences = parseReferences;
window.toSelectors = toSelectors;
window.WebcOrs = WebcOrs;

function loadOrs(ref) {
  let chapter = WebcOrs.loadChapter(182);
  chapter.then((chapter) => {
    console.log(chapter);
    chapter.download();
  });
}

// loadOrs(182);
let controller = new BooksOnlineController();