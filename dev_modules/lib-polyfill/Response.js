

// Check if Response.json() exists
// If not, add function declaration

// Response.json() is the static function - it doesn't need to use the 'this' keyword.
// The way to add a static function to an already existing class is either prototype or just assignment.
(function ResponsePolyFill() {
    if (typeof Response.json !== "function") {
        Response.json = function(...args) {

            // Get original arguments for method
            const data = args.slice(0), options = args.slice(1);

            // new variables to put transformed arguments into
            let respData, respOptions = {};

            // end result response
            let resp;
            
            try {
                respData = JSON.stringify(data);
                respOptions.status = 200;
            } catch(err) {
                respData = "";
                respOptions.status = 307;
                console.error("Response TypeError: ", err);
            }

            respOptions.status = (options.status) ? options.status : respOptions.status;
            respOptions.ok = (respOptions.status == 200) ? "true" : "false";
            respOptions.headers = new Headers(options.headers ? options.headers : {"content-type": "application/json"});
            respOptions.statusText = (options.statusText) ? options.statusText : "";
            respOptions.type = (options.type) ? options.type : "default";
            respOptions.url = (options.url) ? options.url : "";
            respOptions.redirected = (options.redirected) ? options.redirected : false;
            respOptions.bodyUsed = (respData == "") ? false : true;

            resp = new Response(respData, respOptions);

            return resp;
        }
    }
})();

