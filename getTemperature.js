const exec = require("child_process").exec
var http = require('http');

const cmd = 'cat /sys/class/thermal/thermal_zone0/temp';
const port = 8008;

var realTemp = {
    value: 0,
    type: 'C'
};

var getTemp = function() {
    exec(cmd, (error, stdout, stderr) => {
        // console.log(cmd);
        // !error && console.log(error);
        console.log('>> ' + stdout);
        realTemp.value = stdout;        
    }
    , function () {
        console.log('Exec error!');
        
    });
};

http.createServer(function (request, response) {
    
    //console.log(request);
    // gettemp();
    // console.log(cmd);
    // console.log(realTemp); 
    
    
    getTemp(realTemp);
    console.log(realTemp.value + ' ' +realTemp.type );    

    response.setHeader('Content-type', 'text/html');
    response.end(realTemp.value + ' ' + realTemp.type);

}).listen(port);

console.log(`Listening on Port ${port}`);
