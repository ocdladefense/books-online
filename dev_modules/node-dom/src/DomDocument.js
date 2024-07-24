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
        let elems = this.doc.querySelectorAll(selector);
        let headings = [...elems].map((node) => node.textContent);
        return headings.map((heading) => {
            let l = heading.match(/Part/) == null ? 2 : 1;
            let h = document.createTextNode(heading);
            let n = document.createElement("div");
            n.setAttribute("class", "outline-item");
            if (1 == l) {
                n.setAttribute("class", "outline-item outline-item-level-1");
            }
            n.appendChild(h);
            return n;
        });
    }

}