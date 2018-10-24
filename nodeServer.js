var http = require('http');
var fs = require('fs');

var is1LedOn = false;
var is1LedOn = false;
var is1LedOn = false;
var is1LedOn = false;
var is1LedOn = false;

var server = http.createServer(function (request, response) {
    // console.log(request.url);
    // var path =  request.url;
    // console.log(path); 
    // var path = "C:/Users/HOME/Desktop/Orangepi/test";
    console.log(request);    
    
    if (request.url === "/ledON" || request.url === "/getState") {        
        controlLed(request, response);
        
    }
    else{
        responseFile(request, response);
    }    
    
});

var controlLed = function (request, response) {
    if (request.url === "/getState") {
        
    }
    else{
        if (isLedOn) {
            isLedOn = false;
        }
        else{
            isLedOn = true;        
        }
        console.log('led change');
        
    }

    var jsonResponse = {"state" : isLedOn};

    response.setHeader('Content-type', "application/json");
    // response.end(isLedOn.toString());
    response.end(JSON.stringify(jsonResponse));
}


var responseFile = function (request, response) {
    
    // http://localhost:8080/
    if (request.url === "/") {
        request.url = "./index.html";
    }

    // return file
    fs.readFile("./" + request.url, function (err, data) {
        if (!err) {
            var dotoffset = request.url.lastIndexOf('.');
            var mimetype = dotoffset == -1
                ? 'text/plain'
                : {
                    '.html': 'text/html',
                    '.ico': 'image/x-icon',
                    '.jpg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.css': 'text/css',
                    '.js': 'text/javascript'
                }[request.url.substr(dotoffset)];

            console.log(mimetype);

            response.setHeader('Content-type', mimetype);
            response.end(data);
            console.log(request.url, mimetype);
        } else {
            console.log('file not found: ' + request.url);
            response.writeHead(404, "Not Found");
            response.end();
        }
    });
}

server.listen(8080);

console.log('server.listen(8080);');
