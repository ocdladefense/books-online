import HttpMock from "@ocdla/lib-http/HttpMock";
import Url from "@ocdla/lib-http/Url";
import BonIndex from "./mock-data/books.xml";
import fsmforeword from "./mock-data/fsm/fsm-foreword.html";
import fsmoutline from "./mock-data/fsm/fsm-outline.html";
import fsm1 from "./mock-data/fsm/fsm-1.html";
import fsm2 from "./mock-data/fsm/fsm-2.html";
import fsm3 from "./mock-data/fsm/fsm-3.html";
import fsm4 from "./mock-data/fsm/fsm-4.html";
import fsm5 from "./mock-data/fsm/fsm-5.html";
import fsm6 from "./mock-data/fsm/fsm-6.html";
import fsm7 from "./mock-data/fsm/fsm-7.html";
import fsm8 from "./mock-data/fsm/fsm-8.html";
import fsm9 from "./mock-data/fsm/fsm-9.html";
import fsm10 from "./mock-data/fsm/fsm-10.html";
export { BonMock };

console.log(BonIndex);
class BonMock extends HttpMock {
  imports = {
    "/fsm/foreword": fsmforeword,
    "/fsm/outline": fsmoutline,
    "/fsm/1": fsm1,
    "/fsm/2": fsm2,
    "/fsm/3": fsm3,
    "/fsm/4": fsm4,
    "/fsm/5": fsm5,
    "/fsm/6": fsm6,
    "/fsm/7": fsm7,
    "/fsm/8": fsm8,
    "/fsm/9": fsm9,
    "/fsm/10": fsm10,
  };
  errors = {
    success: false,
    error: "Invalid inputs",
  };

  getResponse(req) {
    let url = new Url(req.url);
    let id = url.getPath();
    return id.includes("index")
      ? new Response(BonIndex, {
          headers: { "Content-Type": "application/xml" },
        })
      : new Response(this.imports[id]);
  }
}
