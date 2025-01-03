
let currentOffset = 0;

/**
 * Handles a Hammer.js pan event on the document, used to reveal and hide the
 * table of contents and outline.
 *
 * @param {Object} ev - The Hammer.js event.
 *
 * @private
 */
export function panHandler(ev) {

    // Maximum screen width where Hammer.js gestures are enabled
    const maxWidth = 1023;
    if (window.innerWidth > maxWidth) return;

    const toc = document.querySelector("#toc");
    const tocContent = toc.firstChild;

    const outline = document.querySelector("#outline");
    const outlineContent = outline.firstChild;

    const delta = ev.deltaX + currentOffset;

    
    // Revealing the TOC
    if (delta !== 0) {
        requestAnimationFrame(() => {
            toc.style.transform = `translateX(${constrainNumber(delta, 0, toc.offsetWidth + 10)}px)`;
            outline.style.transform = `translateX(${constrainNumber(delta, (outline.offsetWidth + 10) * -1, 0)}px)`;
        });
        
        tocContent.classList.remove('hidden');
        outlineContent.classList.remove('hidden');
    }


    // If the pan event ends, check if the TOC should be fully shown or hidden
    if (ev.isFinal || ev.isCancelled) {
        // If the pan gesture is closing, but isn't opening the other menu.
        const deltaThreshold = 50;
        const menuIsOpen = currentOffset !== 0;
        const deltaUnderOffset = Math.abs(ev.deltaX) < Math.abs(currentOffset);
        const deltaExceedsThreshold = Math.abs(ev.deltaX) > deltaThreshold;
        const isClosingGesture = deltaExceedsThreshold && deltaUnderOffset && menuIsOpen;

        if (Math.abs(delta) < 50 || isClosingGesture) 
            hideAll();

        // If we panned more than 50px, show the full menu
        if (delta > 50 && !isClosingGesture) {
            // Fully show the TOC
            requestAnimationFrame(() => {
            toc.style.transform = `translateX(${toc.offsetWidth}px)`;
            });
            hideOutline();
            currentOffset = toc.offsetWidth;
        }
        if (delta < -50 && !isClosingGesture) {
            // Fully show the Outline
            requestAnimationFrame(() => {
                outline.style.transform = `translateX(-${outline.offsetWidth}px)`;
            })
            hideTOC();
            currentOffset = -outline.offsetWidth;
        }
    }

}

/**
 * Hide the TOC. This translates the TOC back to its original position and hides it
 * @function
 * @memberof HammerWrapper
 */

function hideTOC() {
    const toc = document.querySelector("#toc");
    const tocContent = toc.firstChild;

    tocContent.classList.add('hidden');
    requestAnimationFrame(() => {
        toc.style.transform = `translateX(0)`;
    });
}

/**
 * Hide the outline. This translates the outline back to its original position and hides it
 * @function
 * @memberof HammerWrapper
 */

function hideOutline() {
    const outline = document.querySelector("#outline");
    const outlineContent = outline.firstChild;

    outlineContent.classList.add('hidden');
    requestAnimationFrame(() => {
        outline.style.transform = `translateX(0)`;
    });
}

/**
 * Hide both the TOC and the outline
 * @function
 * @memberof HammerWrapper
 */
function hideAll() {
    hideOutline();
    hideTOC();
    currentOffset = 0;
}

/**
 * Constrains a number to be within a certain range.
 * @param {number} value - The value to constrain.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The constrained value.
 */
function constrainNumber(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
