export default class Chapter {
    #id;
    #name;
    #heading;

    constructor(id, name, heading) {
        this.#id = id;
        this.#name = name;
        this.#heading = heading;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getHeading() {
        return this.#heading;
    }

    isChapter() {
        return this.#heading.includes("Chapter");
    }

    getBook() {
        return this.#id.split("-")[0];
    }

    getChapter() {
        return this.#id.split("-")[1];
    }
}