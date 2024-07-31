export default class Outline {
    /**
     * An outline item in the document that references a specific node in the document.
     * 
     * @param {string} content Content of the node, the main body of text pulled from the page.
     * @param {string} href Reference to the node that was parsed. Used to link to the node in the page.
     * @param {int} level Level of indendation in the list. Level 1 is the top level.
     */
    constructor(content = '', href = '', level = 0) {
        this.content = content;
        this.href = href;
        this.level = level;
        this.children = [];
        this.parent = null;
    }

    /**
    * @param {Outline} child Child outline to be adopted
    * Adds a child to the current outline, and registers this outline as its parent.
    */
    adopt(child) {
        child.parent = this;
        this.children.push(child);
    }

    /**
    * @param {string} selectorList Comma separated string of html selectors
    * @param {DomDocument} doc DOM document, defaults to entire page
    * Parses the page and creates an array of outline objects. Use these objects to create an on-the-fly outline of the document.
    */
    static parse(selectorList, doc = document) {
        // Order of selectors should be used to determine the level of the list
        const selectors = selectorList.replaceAll(" ", "").toLowerCase().split(",");

        // Take a comma separated string of html selectors
        const elems = [...doc.querySelectorAll(selectorList)];

        // Process all headings with anchor links and styling
        const outlines = elems.map((elem) => {
            return new Outline(elem.textContent, elem.id, selectors.indexOf(elem.tagName.toLowerCase()) + 1);
        });

        const sortedOutline = Outline.nestChildren(outlines);
        console.log(sortedOutline);
        return sortedOutline;
    }

    /**
    * @param {Array<Outline>} outlines
    * Nests children based on their level into other outlines.
    */
    static nestChildren(outlines) {
        const root = new Outline(); // We use a new outline because it may be compared later. We only want the children from this later.
        let parent = root;
        let prevOutline = null;

        outlines.map((outline) => {

            const level = outline.level;
            let prevLevel = prevOutline ? prevOutline.level : 1;


            // Case: We are looking at a top level outline
            if (!prevOutline || level == 1) {
                parent = root;
                parent.children.push(outline); // We don't adopt here because these are top level outlines

                prevOutline = outline;
                return;
            }

            // Case: The item is at the same level as the previous
            if (level == prevLevel) {
                parent.adopt(outline);

                prevOutline = outline;
                return;
            }

            // Case: The item is at a lower level and should be nested into the previous outline
            if (level > prevLevel) {
                parent = prevOutline;
                parent.adopt(outline);

                prevOutline = outline;
                return;
            }


            // Case: The item is at a higher level and should be nested into the correct parent
            if (level < prevLevel) {
                // We need to find the correct parent, so go backwards until we are at the right level.
                while (level <= parent.level) {
                    parent = parent.parent;
                }
                parent.adopt(outline);

                prevOutline = outline;
                return;
            }

            return;
        });


        return root.children;
    }

    /**
    * @param {Array<Outline>} outlines
    * Creates a treeNode from the outlines as a set of nested unordered lists.
    */
    static toHtml(outlines) {
        const root = document.createElement("ul");
        root.setAttribute("class", "outline-content");

        let recNestLists = (outlines) => {
            const list = document.createElement("ul");

            outlines.map((outline) => {
                list.appendChild(Outline.toNode(outline));
                if (outline.children.length > 0)
                    list.appendChild(recNestLists(outline.children));
            });

            return list;
        }

        outlines.map((outline) => {
            root.appendChild(Outline.toNode(outline));
            if (outline.children.length > 0)
                root.appendChild(recNestLists(outline.children));
        });

        return root;
    }
    
    /**
    * @param {Outline} outline
    * Converts an outline object to a list item, with an anchor.
    */
    static toNode(outline) {
        let content = document.createTextNode(outline.content);
        let anchor = document.createElement("a");

        anchor.setAttribute("href", "#" + outline.href);
        anchor.setAttribute("class", "outline-anchor");

        let node = document.createElement("li");
        node.setAttribute("class", "outline-item outline-item-level-" + outline.level);

        anchor.appendChild(content);
        node.appendChild(anchor);

        return node;
    };
}