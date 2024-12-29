

export function revealTOC(ev) {
    const toc = document.querySelector("#toc");
    const tocContent = toc.firstChild;

    const outline = document.querySelector("#outline");
    const outlineContent = outline.firstChild;

    const delta = ev.deltaX;
    
    // Revealing the TOC
    if (delta > 0) {
        requestAnimationFrame(() => {
            toc.style.transform = `translateX(${Math.min(delta, 210)}px)`;
        });
        hideOutline();
        tocContent.classList.remove('hidden');
    }
    // Revealing the Outline
    else if (delta < 0) {
        requestAnimationFrame(() => {
            outline.style.transform = `translateX(${Math.max(delta, -210)}px)`;
        });
        hideTOC();
        outlineContent.classList.remove('hidden');
    }
    

    // If the pan event ends, check if the TOC should be fully shown or hidden
    if (ev.isFinal || ev.isCancelled) {

        // If we panned more than 50px, show the full TOC
        if (delta > 50) {
            // Fully show the TOC
            requestAnimationFrame(() => {
            toc.style.transform = `translateX(200px)`;
            });
        }
        else if (delta < -50) {
            // Fully show the Outline
            requestAnimationFrame(() => {
                outline.style.transform = `translateX(-200px)`;
            })
        } else {
            hideOutline();
            hideTOC();
        }
    }

}

export function hideTOC() {
    const toc = document.querySelector("#toc");
    const tocContent = toc.firstChild;

    tocContent.classList.add('hidden');
    requestAnimationFrame(() => {
        toc.style.transform = `translateX(0)`;
    });
}

export function hideOutline() {
    const outline = document.querySelector("#outline");
    const outlineContent = outline.firstChild;

    outlineContent.classList.add('hidden');
    requestAnimationFrame(() => {
        outline.style.transform = `translateX(0)`;
    });
}

export function hideAll() {
    hideOutline();
    hideTOC();
}
