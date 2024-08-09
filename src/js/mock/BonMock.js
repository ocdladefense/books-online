import HttpMock from "@ocdla/lib-http/HttpMock";
import Url  from "@ocdla/lib-http/Url";
import BonIndex from './mock-data/books.xml';
import fsm1 from './mock-data/fsm-1.html';
export { BonMock };


console.log(BonIndex);
class BonMock extends HttpMock {
    errors = {
        'success': false,
        'error': 'Invalid inputs'
    };


    getResponse(req) {
        let url = new Url(req.url);
        //let data = [];

        //let query = url.getQuery();


        return url.path.includes('index') ? new Response(BonIndex, { headers: { 'Content-Type': 'application/xml' } }) : new Response(fsm1);
    }

    /* filterSections(chapter, section = null) {
        let results = [];
        let ch = chapters[chapter];
        if (!section) {
            return ch;
        }
        for (let i = 0; i < ch.length; i++) {
            let sect = ch[i];
            let parts = sect.slice(0, 7);
            parts = parts.split(".");
            if (parts[1] == section) {
                results.push(sect);
            }
        }
        console.log(results.length);
        if (results.length == 0) {
            throw new RangeError("Section does not exist.", { cause: "INVALID_SECTION" });
        }
        return results;
    } */


}
