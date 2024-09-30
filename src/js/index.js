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
import WebcOar from "@ocdladefense/webc-oar/src/WebcOar.js";
import {ReferenceParser} from "@ocdladefense/ors/src/ReferenceParser.js";

import { BonMock } from "./mock/BonMock.js";

if (USE_MOCK) {
  HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}

/*
window.parseChapterAndSection = parseChapterAndSection;
window.parseSubsections = parseSubsections;
window.parseReferences = parseReferences;
window.toSelectors = toSelectors;
window.WebcOrs = WebcOrs;
*/


// https://appdev.ocdla.org/books-online/index.php?chapter=182
// https://www.law.cornell.edu/regulations/oregon/OAR-863-010-0610
function loadOrs(ref) {
  
  // Translate the reference into matrixes.
  // Each target document (in this case an OrsChapter object) should know how to translate a matrix into selectors
  // valid for that document type.
  let matrixes = ReferenceParser.toMatrix(ref);


  console.log("For "+ref+" matrixes are: ", matrixes);
  // 182.515 Definitions for ORS 182.515 and 182.525.

  let load = WebcOrs.loadChapter(138);
  load.then((chapter) => {
    // console.log(chapter);
    // chapter.download();
    // Note: had to truncate the 182 off.
    let selectors = chapter.toSelectors(matrixes);
    console.log("SELECTORS: ", selectors);
    let nodes = chapter.getNodes(selectors);

    console.log(nodes);
  });
}



// loadOrs("182.515(5),(2)-(3)");
// loadOrs("138.005(5)(a)-(b)");
let controller = new BooksOnlineController();