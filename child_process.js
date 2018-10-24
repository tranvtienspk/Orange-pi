const exec = require("child_process").exec
var http = require('http');
var fs = require('fs');

const port = 8083;
const cmd = 'cat /sys/class/thermal/thermal_zone0/temp';

const cmdLed={
    cmd_led1off : '/root/root/Gpio/led1off',
    cmd_led1on : '/root/root/Gpio/led1on',
    cmd_led2off : '/root/root/Gpio/led2off',
    cmd_led2on : '/root/root/Gpio/led2on',
    cmd_led3off : '/root/root/Gpio/led3off',
    cmd_led3on : '/root/root/Gpio/led3on',
    cmd_led4off : '/root/root/Gpio/led4off',
    cmd_led4on : '/root/root/Gpio/led4on',
    cmd_led5off : '/root/root/Gpio/led5off',
    cmd_led5on : '/root/root/Gpio/led5on',
};

var jsonData = {
    ledState : {
        isLedOn1 : false,
        isLedOn2 : false,
        isLedOn3 : false,
        isLedOn4 : false,
        isLedOn5 : false
    },
    temp : {
        min:50,
        curent:0,
        max:0       
    },
    time :{
        countDown : 30,
        onTime : "08:12",
        offTime : "08:12",
        currentTime : "00:00"
    },
    log :[
        // {
        //     time : 0,
        //     content : '',
        // }
    ]
    
};

var realTemp = 0;

//------------------------Gpio-------------------------------------
var getTemp = function () {
    exec(cmd, (error, stdout, stderr) => {
        console.log('>> ' + stdout);
        realTemp = stdout;
    }
        , function () {
            console.log('Exec error!');
        });
};

function controlDevice(cmd) {
    exec(cmd, (error, stdout, stderr) => {
    })
}

//Get temp after 3s-------------------------------------------------------------
setInterval(() => {
    getTemp();
    var temp = jsonData.temp;
    temp.curent = realTemp;

    var first =1;
    if (first === 1) {
        temp.min = temp.curent;        
        var first =0;
    }
    
    temp.min = temp.curent < temp.min ? temp.curent : temp.min;
    temp.max = temp.curent > temp.max ? temp.curent : temp.max;
    console.log('.............');    

    displayLedState();

    //Update log time
    if (jsonData.log.length > 0) {

        jsonData.log.forEach(element => {
            if (element.time <= 0) {
                element.time = 0;
            }
            else{
                element.time -= 3;
            }
            
        });
    }
}, 3000);

//------------------------Server response-------------------------------------
var server = http.createServer(function (request, response) {

    console.log(request);    
    
    if (request.url.includes("ledON") || request.url.includes("getState")) {        
        controlLed(request, response);        
    }
    else if (request.url.includes("setCountDown")
          || request.url.includes("setOnTime")
          || request.url.includes("setOffTime")){
        setTimer(request, response);        
    }
    else{
        responseFile(request, response);
    }    
    
});

var responseFile = function (request, response) {

    // http://localhost:8080/
    if (request.url === "/") {
        request.url = "./index.html";
    }

    // return file
    fs.readFile("./" + request.url, function (err, data) {
        if (!err) {
            var dotoffset = request.url.lastIndexOf('.');
            var mimetype = dotoffset == -1 ?
                'text/plain' :
                {
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
//-----------------------------------------------

var setTimer = function (request, response) {
    //var timeout = request.url.replace(/^\D+/g, '');
    var param = request.url.split('?');
    //console.log(timeout);

    if (param[0].includes("setCountDown")){
        jsonData.time.countDown = param[1];

        setTimeout(() => {
            // console.log('set  : ' + timeout);
            var ledState = jsonData.ledState;
            var state = ledState['isLedOn' + param[2]];
            ledState['isLedOn' + param[2]] = state ? false : true;
            controlDevice(state ? cmdLed['cmd_led' + param[2] + 'on'] : cmdLed['cmd_led' + param[2] + 'off']);
        }, parseInt(param[1]) * 1000);


        //Write log---------------------------------------
        var content = `Device ${param[2]} countdown after ${param[1]} second`;
        
        var para = {
            time : param[1],
            content : content,
        };        
        outputLog(para);
        
    }
    else if (param[0].includes("setOnTime") || param[0].includes("setOffTime")) {

        //save time
        jsonData.time.onTime = param[1];
        jsonData.time.currentTime = param[3];

        // var time = param[1].split(':');
        // var hour = parseInt(time[0])>12? parseInt(time[0]) -12 : parseInt(time[0]);
        // var setTime = (hour * 60 + parseInt(time[1])) * 60 * 1000;

        // time = param[3].split(':');
        // var hour = parseInt(time[0])>12? parseInt(time[0]) -12 : parseInt(time[0]);
        // var currentTime = (hour * 60 + parseInt(time[1])) * 60 * 1000;

        var time1 = param[1].replace('_', ' ');
        time1 = new Date(`2018-08-${time1}:20`);

        var time2 = param[3].replace('_', ' ');
        time2 = new Date(`2018-08-${time2}:20`);

        var delaytime= time1- time2;        
        console.log(delaytime);        

        setTimeout(() => {
            // console.log('set  : ' + timeout);
            var ledState = jsonData.ledState;
            // var state = ledState['isLedOn' + param[2]];

            if (param[0].includes("setOnTime")){
                ledState['isLedOn' + param[2]] = true;
            }
            else{
                ledState['isLedOn' + param[2]] = false;
            }
            displayLedState();

        }, parseInt(delaytime));

        //Write log---------------------------------------
         if (param[0].includes("setOnTime")) {
             var content = `Device ${param[2]} On time at ${param[1]}`;
            }
        else{
            var content = `Device ${param[2]} Off time at ${param[1]}`;
         }

        var para = {
            time: delaytime / 1000,
            content: content,
        };
        outputLog(para);
    }

    response.setHeader('Content-type', "application/json");
    response.end(JSON.stringify('set ok'));
}


var outputLog = function(param) {
    var log = jsonData.log;
    //var arrContent = log.content;

    //delete if large than 10
    if (log.length > 10) {
        log.splice(0, 1);
    }

    log.push(param);
}

var displayLedState = function() {
    var ledState = jsonData.ledState;
    
    controlDevice(ledState.isLedOn1 ? cmdLed['cmd_led1on'] : cmdLed['cmd_led1off']);
    controlDevice(ledState.isLedOn2 ? cmdLed['cmd_led2on'] : cmdLed['cmd_led2off']);
    controlDevice(ledState.isLedOn3 ? cmdLed['cmd_led3on'] : cmdLed['cmd_led3off']);
    controlDevice(ledState.isLedOn4 ? cmdLed['cmd_led4on'] : cmdLed['cmd_led4off']);
    controlDevice(ledState.isLedOn5 ? cmdLed['cmd_led5on'] : cmdLed['cmd_led5off']);
}

var controlLed = function (request, response) {
    if (!request.url.includes("getState")) {
        var ledState = jsonData.ledState;
        if (request.url.includes("ledON")) {
            if (request.url.includes("1")) {
                ledState.isLedOn1 = ledState.isLedOn1? false: true;                
            }

            if (request.url.includes("2")) {
                ledState.isLedOn2 = ledState.isLedOn2 ? false : true;                

            }

            if (request.url.includes("3")) {
                ledState.isLedOn3 = ledState.isLedOn3 ? false : true;                

            }

            if (request.url.includes("4")) {
                ledState.isLedOn4 = ledState.isLedOn4 ? false : true;                

            }

            if (request.url.includes("5")) {
                ledState.isLedOn5 = ledState.isLedOn5 ? false : true;                
                
            }

            displayLedState();

        }
        console.log('led change');        
    }

    response.setHeader('Content-type', "application/json");
    response.end(JSON.stringify(jsonData));
}

server.listen(port);
console.log(`server.listen(${port})`);
