

export function panHandler(ev) {
    const toc = document.querySelector("#toc");
    const tocContent = toc.firstChild;

    const outline = document.querySelector("#outline");
    const outlineContent = outline.firstChild;

    const delta = ev.deltaX;
    
    // Revealing the TOC
    if (delta > 0) {
        requestAnimationFrame(() => {
            toc.style.transform = `translateX(${Math.min(delta, toc.offsetWidth + 10)}px)`;
        });
        hideOutline();
        tocContent.classList.remove('hidden');
    }
    // Revealing the Outline
    else if (delta < 0) {
        requestAnimationFrame(() => {
            outline.style.transform = `translateX(${Math.max(delta, (outline.offsetWidth + 10) * -1)}px)`;
        });
        hideTOC();
        outlineContent.classList.remove('hidden');
    }

    console.log(delta);
    

    // If the pan event ends, check if the TOC should be fully shown or hidden
    if (ev.isFinal || ev.isCancelled) {
        console.log("Pan ended");
        if (Math.abs(delta) < 50) 
            hideAll();

        // If we panned more than 50px, show the full menu
        if (delta > 50) {
            // Fully show the TOC
            requestAnimationFrame(() => {
            toc.style.transform = `translateX(${toc.offsetWidth}px)`;
            });
        }
        if (delta < -50) {
            // Fully show the Outline
            requestAnimationFrame(() => {
                outline.style.transform = `translateX(-${outline.offsetWidth}px)`;
            })
        }
    }

}

export function hideTOC() {
    console.log("Hide TOC");
    const toc = document.querySelector("#toc");
    const tocContent = toc.firstChild;

    tocContent.classList.add('hidden');
    requestAnimationFrame(() => {
        toc.style.transform = `translateX(0)`;
    });
}

export function hideOutline() {
    console.log("Hide Outline");
    const outline = document.querySelector("#outline");
    const outlineContent = outline.firstChild;

    outlineContent.classList.add('hidden');
    requestAnimationFrame(() => {
        outline.style.transform = `translateX(0)`;
    });
}

export function hideAll() {
    console.log("Hide all");
    hideOutline();
    hideTOC();
}
