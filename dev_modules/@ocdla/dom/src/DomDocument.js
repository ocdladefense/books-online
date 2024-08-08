export {DomDocument};


class DomDocument {

    doc = null;

    constructor(doc) {
        this.doc = doc || document;
    }


    cloneFromIds(startId, endId) {

        var startNode = this.doc.getElementById(startSection);
        console.log(firstNode);
        var endNode = this.doc.getElementById(endSection);
        console.log(secondNode);

        return clone(startNode, endNode);
    }


    // Clones the contents inside a range.
    clone(startNode, endNode) {

        let range = document.createRange();

        range.setStartBefore(startNode);
        range.setEndBefore(endNode);

        console.log(range);

        var contents = range.cloneContents();
        console.log(contents);

        return contents;
    }




    doTextOutline(query) {
        let elems = document.querySelectorAll(query);
        let nodes = [];
        const serializer = new XMLSerializer();

        for (let i = 0; i < elems.length; i++) {
            let node1 = elems[i];
            let node2 = elems[i + i];
            if (null == node2) continue;
            let result = clone(node1, node2);
            // let html = serializer.serializeToString(result);
            // nodes.push(result.toString());
            nodes.push(result.textContent);
        }

        console.log(nodes);
    }


    outline(selector) {
        // Take a comma separated string of html selectors
        const elems = [...this.doc.querySelectorAll(selector)];
        const root = document.createElement("ul");
        root.setAttribute("class", "outline-content");

        // Process all headings with anchor links and styling
        const nodes = elems.map((elem) => {
            let content = elem.textContent;
            let heading = document.createTextNode(content);

            // Create our anchor element that links to the id of the element
            let anchor = document.createElement("a");
            anchor.setAttribute("href", "#" + elem.id);
            anchor.setAttribute("class", "outline-anchor");

            // We want to put these into list items
            let node = document.createElement("li");

            // We are assuming the selectors are h1, h2, h3, etc. 
            // We can use the heading level as the nested level.
            let level = elem.tagName[1] || "1";

            node.setAttribute("class", "outline-item outline-item-level-" + level);
            node.setAttribute("data-level", level);


            anchor.appendChild(heading);
            node.appendChild(anchor);
            return node;
        });

        // Set up nested lists
        let currentList = root; // We want to operate out of a moving list. Start at the root, and change as we go deeper.
        
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let prevNode = nodes[i - 1] || root;

            // Get the nested level of our current node
            let level = parseInt(node.getAttribute("data-level"));
            let prevLevel = parseInt(prevNode.getAttribute("data-level")) || 1;

            // If the level is greater than the previous level, we want to start a new list
            // This does not check if we go from level 1 to level 3. I'm not sure we want to check for that.
            if (level > prevLevel) {
                let prevList = currentList;
                currentList = document.createElement("ul");
                currentList.setAttribute("class", "outline-list");
                prevList.appendChild(currentList);

            // If the level is less than the previous level, we want to go up to the proper level
            } else if (level < prevLevel) {

                // Example case: If we are at level 3, and we jump to level 1, we want to go up to level 1.
                // The while loop finds the correct level, up to the root.
                while (level < prevLevel) {
                    currentList = currentList.parentElement || root;
                    prevLevel--;
                }
            }
            currentList.appendChild(node);
        }

        
        return root;
    }

}