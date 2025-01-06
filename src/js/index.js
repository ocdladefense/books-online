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


import { BonMock } from "./mock/BonMock.js";

if (USE_MOCK) {
  HttpClient.register("https://pubs.ocdla.org/", new BonMock());
}


class MyOutliner {


  constuctor(opts) {
    this.opts = opts;


  }

  renderOutline() {
    // Display the outline of the chapter once the content has been rendered.
   // const outlineReady = chapterReady.then(() => {
      const outline = Outline.fromCurrentDocument();

      // Books-Online content is in section tags with .level1, .level2, etc.
      outline.outline(
        ".level1",
        ".level2",
        ".level3",
        ".level4",
        ".level5",
        ".level6"
      );

      // Display the outline in the sidebar
      const outlineRoot = View.createRoot(document.querySelector("#outline"));
      outlineRoot.render(
        <OutlineSidebar>{outline.getNested()}</OutlineSidebar>
      );

      // Callback function used to detect where the user is on the page.
      const handleIntersection = (observedEntries) => {
        // Filter out entries that are not intersecting
        const intersectingEntries = observedEntries.filter(
          (entry) => entry.isIntersecting
        );

        // Make sure we have at least one entry remaining
        if (intersectingEntries.length == 0) return;

        // Iterate through our outline items and clear their styles.
        outline.clearAllActive(
          ".bg-black.text-white",
          document.querySelector("#outline")
        );

        // We only want the first entry. It's possible to scroll through multiple headings at once.
        const entry = intersectingEntries[0];
        const id = entry.target.id;
        const outlineListItem = document.querySelector(`[id='${id}-outline-item']`);

        //When we see a new item, we want to make sure the outline sidebar is scrolling to it.
        if (outlineListItem != null) {
          outlineListItem.scrollIntoView({
            behavior: "instant",
            block: "nearest",
            inline: "center",
          });

          // Add the active class styling to the current item.
          outlineListItem.classList.add("bg-black");
          outlineListItem.classList.add("text-white");

          // Update the address bar for the fragment we are looking at
          this.updateHistory(`#${id}`);
        }

        
      };

      // Add the callback function to the intersection observer.
      outline.addIntersectionObserver(handleIntersection);


    

    // Sanitize fragments from the unit
    let fragment;
    if (unit != undefined) {
      fragment = unit.split("#")[1];
      unit = unit.split("#")[0];
    }
    



      // Scroll to the fragment if it exists
      if (fragment && document.querySelector(`[id='${fragment}`)) 
        requestAnimationFrame(() => {
          document.querySelector(`[id='${fragment}`).scrollIntoView();
        });



  }


  }





let controller = new BooksOnlineController();

window.addEventListener("hashchange", controller);
      
// Enable selection of various chapters in the table of contents.
document.addEventListener("click", controller);
      
document.addEventListener("change", controller);

document.addEventListener("onChapterContentRendered", new MyOutliner());



