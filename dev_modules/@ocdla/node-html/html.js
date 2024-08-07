

String.prototype.wrap = function(arg) {
    console.log(this);
    return arg + this + arg;
};

String.prototype.html = function(arg) {
    console.log(this);
    let start = "<"+arg+">";
    let end = "</"+arg+">";

    return start + this + end;
};