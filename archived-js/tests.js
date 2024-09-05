

//Test building Table of Contents
window.tocTest = tocTest;
function tocTest() {
    var chapter = new OrsChapter(813);
    chapter.load().then(function () {
        chapter.injectAnchors();
        let toc = chapter.buildToC();
        modal.show();
        modal.toc(toc);
        modal.renderHtml(chapter.toString(), "ors-statutes");

        window.location.hash = section;
    });
}

//Test building of Volumes
window.volTest = volTest;
function volTest() {
    var chapter = new OrsChapter(813);
    chapter.load().then(function () {
        chapter.injectAnchors();
        let toc = chapter.buildToC();
        let vols = chapter.buildVolumes();
        modal.show();
        modal.toc(toc);
        modal.titleBar(vols);
        modal.renderHtml(chapter.toString(), "ors-statutes");
        modal.titleBar(vols);
        window.location.hash = section;
    });
}

//Test event handling on dropdown volume selector 
window.dropdownTest = dropdownTest;
function dropdownTest(){
    var selector = document.getElementById("dropdown");
    selector.addEventListener('change', function(){
        
    });
}
