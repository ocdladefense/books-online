/** @jsx vNode */ /** @jsxFrag "Fragment" */
/* eslint-disable no-unused-vars */
import { vNode, View } from "@ocdla/view";
import OutlineSidebar from "@ocdla/global-components/src/Outline.jsx";
import Outline from "@ocdla/outline";
export default class Outliner {

    constructor() {
        this.outline = Outline.fromCurrentDocument();
        this.renderOutline();
        this.outline.addIntersectionObserver(this.handleIntersection);
        this.handleIntersection = this.handleIntersection.bind(this);
    }

    handleEvent(event) {
        if (event.type === 'onChapterContentRendered') {
            // Call the constructor
            this.constructor();
        }
      }
  
    renderOutline() {
        // Books-Online content is in section tags with .level1, .level2, etc.
        this.outline.outline(
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
          <OutlineSidebar>{this.outline.getNested()}</OutlineSidebar>
        );
    }

    // Callback function used to detect where the user is on the page.
    handleIntersection(observedEntries) {
        // Filter out entries that are not intersecting
        const intersectingEntries = observedEntries.filter(
          (entry) => entry.isIntersecting
        );

        // Make sure we have at least one entry remaining
        if (intersectingEntries.length == 0) return;

        // Iterate through our outline items and clear their styles.
        this.outline.clearAllActive(
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

        
        }
      };
}