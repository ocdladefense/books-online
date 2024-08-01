export default class Outline {
    /**
     * An outline item in the document that references a specific node in the document.
     * 
     * @param {string} [content=''] content Content of the node, the main body of text pulled from the page.
     * @param {string} [href=''] Reference to the node that was parsed. Used to link to the node in the page.
     * @param {int} [level=0] Level of indendation in the list. Level 1 is the top level.
     */
    constructor(content = '', href = '', level = 0) {
        this.content = content;
        this.href = href;
        this.level = level;

        // Outline items can have outlines as children.
        this.children = [];

        // The parent outline allows us to move up the tree. This is the outline that this is a child of.
        this.parent = null;
    }

    /**
    * Adds a child to the current outline, and registers this outline as its parent.
    * @param {Outline} child Child outline to be adopted
    */
    adopt(child) {
        child.parent = this;
        this.children.push(child);
    }

    /**
    * Parses the page and creates an array of outline objects. Use these objects to create an on-the-fly outline of the document.
    * @param {string} selectorList Comma separated string of html selectors
    * @param {DomDocument} [doc=document] doc DOM document, defaults to entire page
    * @returns {Array<Outline>} Array of outline objects.
    */
    static parse(selectorList, doc = document) {
        // Order of selectors should be used to determine the level of the list
        const selectors = selectorList.replaceAll(" ", "").toLowerCase().split(",");

        // Take a comma separated string of html selectors
        const elems = [...doc.querySelectorAll(selectorList)];

        // Process all headings with anchor links and styling
        return elems.map((elem) => {
            return new Outline(elem.textContent, elem.id, selectors.indexOf(elem.tagName.toLowerCase()) + 1);
        });
    }

    /**
    * Nests children based on their level into other outlines.
    * @param {Array<Outline>} outlines
    * @returns {Array<Outline>} Array of top level outline objects. The array itself is the outline tree.
    */
    static nestChildren(outlines) {
        const root = new Outline();
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

            // Case: The item is at a deeper level and should be nested into the previous outline
            if (level > prevLevel) {
                parent = prevOutline;
                parent.adopt(outline);

                prevOutline = outline;
                return;
            }


            // Case: The item is at a shallower level and should be nested into the last outline that would be its parent
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
    * Creates a treeNode from the outlines as a set of nested unordered lists.
    * @param {Array<Outline>} outlines Expects an array of Outline objects with children nested via nestChildren
    * @returns {DomElement} Single unordered list node as a treeNode.
    */
    static toHtml(outlines) {
        // Create our root list node and add some styling
        const root = document.createElement("ul");
        root.setAttribute("class", "outline-content");

        // This is our recursive function to nest the lists
        // It takes the children array of an outline and wraps it in an unordered list while checking for grandchildren.
        // It also converts the children to list items and adds them to the parent list.
        let recNestLists = (outlines) => {
            const list = document.createElement("ul");

            // Go through each child
            outlines.map((outline) => {
                // Convert it to a list item and add it to the list
                list.appendChild(outline.toListItem());

                // If it has children, perform this same function on the child array and append that list to the current one.
                if (outline.children.length > 0)
                    list.appendChild(recNestLists(outline.children));
            });

            return list;
        }

        // Create our top level items in our list.
        outlines.map((outline) => {
            root.appendChild(outline.toListItem());

            // If it has children, begin recursing through them building nested lists.
            if (outline.children.length > 0)
                root.appendChild(recNestLists(outline.children));
        });

        return root;
    }
    
    /**
    * Converts an outline object to a list item, with an anchor.
    * @returns {DomElement} Single list item based on the current object
    */
    toListItem() {
        // Create our dom elements
        let content = document.createTextNode(this.content);
        let anchor = document.createElement("a");

        // Set attributes for the anchor. This creates our link and does some styling
        anchor.setAttribute("href", "#" + this.href);
        anchor.setAttribute("class", "outline-anchor");

        // Create the list item and add some styling
        let node = document.createElement("li");
        node.setAttribute("class", "outline-item outline-item-level-" + this.level);

        // Build the list item
        anchor.appendChild(content);
        node.appendChild(anchor);

        return node;
    };
}