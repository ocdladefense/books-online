import HttpMock from "@ocdla/lib-http/HttpMock";
import Url  from "@ocdla/lib-http/Url";
import BonIndex from './mock-data/books.xml';
import fsm1 from './mock-data/fsm/fsm-1.html';
export { BonMock };


console.log(BonIndex);
class BonMock extends HttpMock {
    imports = {
        '/fsm/foreword': fsm1,
        '/fsm/outline': fsm1,
        '/fsm/1': fsm1,
        '/fsm/2': fsm1,
        '/fsm/3': fsm1,
        '/fsm/4': fsm1,
        '/fsm/5': fsm1,
        '/fsm/6': fsm1,
        '/fsm/7': fsm1,
        '/fsm/8': fsm1,
        '/fsm/9': fsm1,
        '/fsm/10': fsm1
    }
    errors = {
        'success': false,
        'error': 'Invalid inputs'
    };


    getResponse(req) {
        let url = new Url(req.url);
        let id = url.getPath();
        return id.includes('index') ? new Response(BonIndex, { headers: { 'Content-Type': 'application/xml' } }) : new Response(this.imports[id]);
    }
}
