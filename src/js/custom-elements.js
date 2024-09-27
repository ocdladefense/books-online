import WebcOrs from "@ocdladefense/webc-ors/src/WebcOrs.js";
import WebcOar from "@ocdladefense/webc-oar/src/WebcOar.js";

customElements.define("webc-ors", WebcOrs, { extends: "div" });
customElements.define("webc-oar", WebcOar, { extends: "div" });
