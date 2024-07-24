
import OregonLegislatureNetwork from "/node_modules/@ocdladefense/ors/src/Network.js";
import {InlineModal} from "/node_modules/@ocdladefense/modal/dist/inline-modal.js";






// Convert the document to be ORS-ready.

let inlineModalFired = false;


export default function init() {

    // Inline modal initialization.
    let inline = new InlineModal("inline-ors");
    window.inline = inline;

    const serializer = new XMLSerializer();

    let modalTarget = inline.getRoot();



    let mouseOutCb = getMouseLeaveCallback(modalTarget, function() { inline.hide(); });
    let mouseOverCb = getMouseOverCallback(async function(x, y, chapterNum, startSection) {
        console.log("X coord is ", x);
        console.log("Y coord is ", y);
        console.log("Chapter is: ", chapterNum);
        console.log("Section is: ", startSection);

        // If the modal is already being setup then
        // don't re-initialize.
        if (inlineModalFired == true) {
            return false;
        }
        inlineModalFired = true;


        inline.show(x, y-141);


        let chapter = await OregonLegislatureNetwork.fetchOrs({chapter:chapterNum});
        let startId = "section-" + parseInt(startSection);
        let endId = chapter.getNextSectionId(startId);
        console.log(endId);
        let cloned = chapter.cloneFromIds(startId, endId);
        let html = serializer.serializeToString(cloned);
        console.log(html);
        inline.renderHtml(html);
        inlineModalFired = false;

        let id = inline.getRoot();
        let marker = document.querySelector(".inline-modal #"+startId);
        console.log(marker);
        // marker.scrollIntoView({ behavior: "smooth", block: "start"});//, inline: "nearest" });
    });


    modalTarget.addEventListener("mouseleave", mouseOutCb);

    let links = document.querySelectorAll("a[data-action]");

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("mouseenter", mouseOverCb);
        links[i].addEventListener("mouseleave", mouseOutCb);
    }
}







function getMouseOverCallback(fn) {


    return (function (e) {
        let target = e.target;
        //console.log(e);

        let rectangle = target.getBoundingClientRect();
        let recW = rectangle.width;
        let recH = rectangle.height;

        //need to fix this, doesnt work right
        let x = recW + (rectangle.width - e.pageX);
        if (x > 1575) {
            x = 1575;
        }
        let y = e.pageY;
        fn(e.pageX - 50, e.pageY + 1, target.dataset.chapter, target.dataset.section);

    });
}


function getMouseLeaveCallback(compareNode, fn) {
    return (function (e) {
        let relatedTarget = e.relatedTarget;
        let areTheyEqual = compareNode == relatedTarget;
        console.log("Leave");
        if (areTheyEqual) {
            return false;
        }
        if (!compareNode.contains(relatedTarget)) {
            fn();
        }
    });
}



