var viewModel = function (params) {

    var self = this;

    self.temp = {  
        curent: ko.observable(0),
        min: ko.observable(0),
        max: ko.observable(0),
    };

    //set time --------------------------------------------
    //var date = new Date('2018-08-14 19:11:20');
    var date = new Date();
    var currentTime = `${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;

    self.time = {
        countDown: {
            minute: ko.observable(0),
            second: ko.observable(30),
            remain: ko.observable(0),
        },
        onTime: ko.observable(currentTime),
        offTime: ko.observable(currentTime),
        currentTime: ko.observable(),
        deviceControl: ko.observable(1)
    };

    self.log = ko.observable([]);
    
    //set device list --------------------------------------------
    self.deviceOption = ko.observable([1,2,3,4,5]);

    var devide = function (id, name, state) {
        this.id = id;
        this.name = ko.observable(name);
        this.state = ko.observable(state);
        return this;
    }

    var list = [];
    for (let index = 0; index < 5; index++) {
        list.push(new devide(index + 1, 'Device ' + (index + 1), false))
    }
    self.listDevice = ko.observableArray(list);

    //self.time.countDown.subscribe(function (params) {
    self.setTimer = function(type) {
        var time = self.time;
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                // self.time.countDown(data.time.countDown)
            }
        };
        
        var url;
        if (type.includes('setCountDown')) {
            var countDownTime = parseInt(time.countDown.minute()) * 60 + parseInt(time.countDown.second());
            url = "setCountDown?" + countDownTime + '?' + time.deviceControl();
            xhttp.open("GET", url, true);

            //remain time
           self.time.countDown.remain(countDownTime);
            
        }
        else if (type.includes('setOnTime') || type.includes('setOffTime')) {

            var state = type.includes('setOnTime') ? 'On' : 'Off';
            var state1 = type.includes('setOnTime') ? 'on' : 'off';

            // var currentTime = new Date().getHours() + ':' + new Date().getMinutes();
            url = "set" + state + "Time?" + time[ state1 + 'Time']() + '?' + time.deviceControl() + '?' + currentTime;
            xhttp.open("GET", url, true);
        }

        
        xhttp.send();
    };      

    var updateData = function(list) {
        var count = 0;

        //ledState
        for (const key in list.ledState) {
            const element = list.ledState[key];
            // console.log(count + '' + key);
            self.listDevice()[count].state(element);
            
            count++;
        }
        
        //temp
        for (const key in list.temp) {
            self.temp[key](list.temp[key]);           
        }

        //time
        // for (const key in list.time) {
        //     self.time[key](list.time[key]);
        // }

        //log
        for (const key in list.log) {
            self.log(list.log);
        }
        
    }

    self.change = function(params) {

        console.log(params);
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                var list = JSON.parse(data.currentTarget.responseText);
                // console.log(list); 
                updateData(list);
            }
        };
        xhttp.open("GET", "ledON" + params + params, true);
        xhttp.send();
    }

    self.init = function (params) {
        // console.log('init.............'); 

        var countDown = self.time.countDown;
        if (countDown.remain() <= 0 ) {
            countDown.remain(0);
        }
        else{
            var remainTime = countDown.remain()-3;
            countDown.remain(remainTime);
        }
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function (data) {
            if (this.readyState == 4 && this.status == 200) {
                var list = JSON.parse(data.currentTarget.responseText);
                // console.log(list);
                updateData(list);
            }
        };
        xhttp.open("GET", "getState", true);
        xhttp.send();
    }
}

var getTimeformat = function(params) {
    var second = params % 60;
    var minute = params % 60;
    var hour = parseInt(params / 3600);


    return {
        second, minute, hour
    }
}

function fancyTimeFormat(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

var viewmodel = new viewModel();
ko.applyBindings(viewmodel);

setInterval(() => {
    viewmodel.init();
}, 3000);
