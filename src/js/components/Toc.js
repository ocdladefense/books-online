import { Modal } from "@ocdladefense/modal/dist/modal.js";
export default function loadToc() {
    let config = {
        style: "display:block; width:auto; vertical-align:top; overflow-x: hidden; overflow-y: auto; height:60vh; padding: 8px;"
    };
    let modal = new Modal(config);
    modal.show();

    // TODO: Fetches are possibly better done using lib-http in all cases. This likely needs refactor
    fetch("/sites/pubs.ocdla.org/books/" + window.book + "/toc.tpl.php").then((resp) => {
        return resp.text();
    })
        .then((html) => {
            modal.render(html);
        });
}