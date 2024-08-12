import Chapter from "./Chapter";
export default class TableOfContents {
    #chapters = new Array();
    constructor(chapters) {
        this.#chapters = chapters;
    }       
    static fromXml(xml) {
        const items = [...xml.querySelectorAll("section, chapter")];
        const chapters = items.map((item) => {
            
            const nodeName = item.nodeName;
            const titleCase = nodeName.charAt(0).toUpperCase() + nodeName.substring(1).toLowerCase();
            const heading = titleCase + ' ' + item.id.split('-')[1];
            return new Chapter(item.id, item.attributes.name.textContent, heading)
    });
        return new TableOfContents(chapters);
    }

    getChapters() {
        return this.#chapters;
    }

    toNodeTree() {
        // Make our table of contents root element
        const root = document.createElement("div");
        root.setAttribute("class", "toc-content");

        // Loop through our chapters and add them to the table of contents
        this.#chapters.forEach((chapter) => {

            // Make our table of contents item
            
            //div.setAttribute("class", "nav-item");

            

            // Make our table of contents link from our ID.
            // This is the entire item as well, since we want it all to be clickable
            const href = '/' + chapter.getId().replace("-", "/");
            const a = document.createElement("a");
            a.setAttribute("href", href);
            a.setAttribute("title", ' - ' + chapter.getName());
            a.setAttribute("class", "nav-item");
            a.setAttribute("data-book", chapter.getBook());
            a.setAttribute("data-chapter", chapter.getChapter());
            

            // Get the name of our TOC item
            // Example: Crime Seriousness Rankings
            const div = document.createElement("div");
            div.setAttribute("class", "chapter-name");
            div.innerHTML = chapter.getName();


            // Get the label of our TOC item
            // Example: Chapter 1
            const span = document.createElement("span");
            span.setAttribute("class", "label");
            span.innerHTML = chapter.getHeading();

            // We don't want sections to have labels
            if (chapter.isChapter())
                a.appendChild(span);

            a.appendChild(div);
            root.appendChild(a);
        });

        return root;
    }

    toHtml() {
        let doc = new Document();
        let wordSection = doc.createElement("div");
        wordSection.setAttribute("class", "WordSection1");
        let nodeTree = this.toNodeTree();

        wordSection.appendChild(nodeTree);
        doc.appendChild(wordSection);
        
        const serializer = new XMLSerializer();
        const subset = doc.querySelector(".WordSection1");
        return serializer.serializeToString(subset);

    }
}