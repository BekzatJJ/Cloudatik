

window.onload = function () {
    //Global variables
        window.ajaxRequests={};
        window.ajaxNodeProcess={};
        window.ajaxAlarmHistoryProcess={};
        window.nodeParameters={};
        window.cashedCharts = {};
        //LCDs and charts
        window.lcd={};
        window.chartObject = {};
        window.retrievedChartsObject = {};

        //Node status
        window.nodeStatus = {};



    //console.log('requested');
    $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getUserNodeV4/' + username + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    var spinnerNode = document.getElementById('spinnerMain');
                    spinnerNode.classList.remove('lds-roller');
                    var parent = document.getElementById('nodesList');
                    if(data.node.length == 0){
                        parent.innerHTML = ``;
                        parent.innerHTML = `<div id="addNode" class="card border-success mb-3 node" style="">
                                                  <div class="card-header bg-transparent border-success first" onclick="permissions();">Add node</div>
                                                  <div class="card-body text-dark float-right">
                                                  </div>
                                                </div>`;
                    }else{
                        //console.log('here we go');
                        createNodeCards(data);
                        document.getElementById('mapButton').disabled=false;

                    }
                }
            });

    //Alarm badge

         $.ajax({
                type: "GET",
                url:'https://api.cl-ds.com/getAlarmSummaryV2/'+ username + '/?format=json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    var data = reJSONAlarmSummary(data);
                    console.log('updated alarm badge');

                    var parent = document.getElementById('badgeAlarm');
                    parent.innerHTML = data.data.length;
                    alarmSummary(data);
                }
            });


}
function reJSONAlarmSummary(data){
    var newData = [{}];

    for(var i=0; i<data.alarm.length; i++){
        var datetime = data.alarm[i].datetime;
        for(var a=0; a<data.alarm_prop.length; a++){
            if(data.alarm[i].parameter == data.alarm_prop[a].parameter){
                var label = data.alarm_prop[a].label;
            }
        }
        var serial = data.alarm[i].serial;
        var value = data.alarm[i].value;

        for(var a=0; a<data.tag_name.length; a++){
            if(data.alarm[i].serial == data.tag_name[a].serial){
                var tag_name = data.tag_name[a].tag_name;
            }
        }

        newData[i] = {
            "datetime": datetime,
            "label": label,
            "serial": serial,
            "tag_name": tag_name,
            "value": value
        }
    }
    newData = {"data": newData};
    console.log(newData);
    return newData
}

function reJsonDataAlarm(data){
    var newData = [{}];

    for(var i=0; i<data.alarm.length; i++){
        var datetime = data.alarm[i].datetime;
        var id = data.alarm[i].id;
        var lim_low = data.alarm[i].limit_lower;
        var lim_up = data.alarm[i].limit_upper;
        var parameter = data.alarm[i].parameter;
        var serial = data.alarm[i].serial;
        var value = data.alarm[i].value;
        for(var a=0; a<data.alarm_prop.length; a++){
            if(parameter == data.alarm_prop[a].parameter){
                var chart_title = data.alarm_prop[a].chart_title;
                var label = data.alarm_prop[a].label;
                break;
            }
        }
        newData[i] = {
            "datetime": datetime,
            "id": id,
            "limitLower": lim_low,
            "limitUpper": lim_up,
            "parameter": parameter,
            "serial": serial,
            "value": value,
            "chart_title": chart_title,
            "label": label
        }
    }
    console.log(newData);
    return newData
}
//Update dashboard all nodes including their status
setInterval(function(){

    if(document.getElementById('section_Dashboard').style.display === 'block'){
        //Request Ajax
         $.ajax({
                type: "GET",
                url:'https://api.cl-ds.com/getUserNodeV4/' + username + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    console.log('updated main dashboard');
                   var spinnerNode = document.getElementById('spinnerMain');
                    spinnerNode.classList.remove('lds-roller');
                    var parent = document.getElementById('nodesList');
                    if(data.node.length == 0){
                        parent.innerHTML = ``;
                        parent.innerHTML = `<div id="addNode" class="card border-success mb-3 node" style="">
                                                  <div class="card-header bg-transparent border-success first" onclick="permissions();">Add node</div>
                                                  <div class="card-body text-dark float-right">
                                                  </div>
                                                </div>`;
                    }else{
                        if(document.getElementById('section_Dashboard').style.display === 'block'){
                            console.log('here we go');
                            createNodeCards(data);
                        }


                    }

                }
            });
    }else{
        console.log('not active dashboard');
    }




}, 60000);

//Alarm badge
setInterval(function(){

    if(document.getElementById('section_Dashboard').style.display === 'block'){
        //Request Ajax
         $.ajax({
                type: "GET",
                url:'https://api.cl-ds.com/getAlarmSummary/'+ username + '/?format=json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    console.log('updated alarm badge');
                    var parent = document.getElementById('badgeAlarm');
                    parent.innerHTML = data.data.length;
                    alarmSummary(data);
                }
            });
    }else{
        console.log('not active dashboard');
    }




}, 60000);
//abort all and current RequestAjax  after interrupt , resume all aborted requests

/*
        "chart_prop":[{}],
        "chart_title": "",
        "data":[{}],
        "id":"",
        "parameter":"",
        "section":"",
        "serial":""
*/
function reConstructJSON(data){
    var newData = [{}];

    for(var i=0; i<data.chart_prop.length; i++){
        var chartProp = [];
        chartProp[0] = data.chart_prop[i];
        var chart_title = data.chart_prop[i].chart_title;
        var id = data.chart_prop[i].serial + "_" + data.chart_prop[i].parameter;
        var parameter = data.chart_prop[i].parameter;
        var section = "";
        var serial = data.chart_prop[i].serial;
        var nodeData = [{}];
        for(var x=0; x < data.data.length; x++){
            nodeData[x] = {
                "datetime": data.data[x].datetime,
                [parameter]: data.data[x][parameter]
            }
        }

        newData[i] = {
            "chart_prop": chartProp,
            "chart_title": chart_title,
            "data": nodeData,
            "id": id,
            "parameter": parameter,
            "section": section,
            "serial": serial,

        }
    }

    console.log(newData);
    return newData
}

function reConstructSingleJSON(data){
    var newData = [{}];

    for(var i=0; i<data.chart_prop.length; i++){
        var chartProp = [];
        chartProp[0] = data.chart_prop[i];
        var chart_title = data.chart_prop[i].chart_title;
        var id = data.chart_prop[i].serial + "_" + data.chart_prop[i].parameter;
        var parameter = data.chart_prop[i].parameter;
        var section = "";
        var serial = data.chart_prop[i].serial;
        var nodeData = {};
            nodeData = {
                "datetime": data.data.datetime,
                [parameter]: data.data[parameter]
            }


        newData[i] = {
            "chart_prop": chartProp,
            "chart_title": chart_title,
            "data": nodeData,
            "id": id,
            "parameter": parameter,
            "section": section,
            "serial": serial
        }
    }

    console.log(newData);
    return newData
}

function requestAjax(id){
    callDailyChart(id);
    var ajaxCounts = Object.keys(ajaxRequests).length;
    ajaxRequests[ajaxCounts] = $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardDataSetIntervalV3/' + id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    for(var i=0; i< data.chart_prop.length; i++){
                        console.log(data.chart_prop[i].priority);
                    }
                    data = reConstructJSON(data);
                    console.log(data);
                    var nodeProcessed = document.getElementsByClassName(data[0].serial);
                    ajaxNodeProcess[nodeProcessed[0].id] = true;
                    console.log('processes' + data[0].serial + ':' + ajaxNodeProcess[nodeProcessed[0].id]);

                    //Spinner disable and Links enable
                    var spinnerNode = document.getElementById('spinner_'+nodeProcessed[0].id);
                    spinnerNode.classList.remove('lds-roller');

                    var navLinks = document.getElementById('nodeLinks_'+nodeProcessed[0].id);
                    for(var i=0; i< navLinks.children.length; i++){
                        navLinks.children[i].setAttribute('style', 'pointer-events:all');
                    }
                    //store node parameters
                    nodeParameters[nodeProcessed[0].id] = data;
                    //console.log(nodeParameters);

                    //Append DOM
                        for(var i=0; i< data.length;i++){
                            var parent = document.getElementById(data[0].serial + '-parameters');
                            let child = document.createElement('div');
                            let canvasLcd = document.createElement('canvas');
                            let title = document.createElement('h3');
                            let canvasChart = document.createElement('canvas');
                            child.id = data[i].id;
                            if(data[i].chart_prop[0].priority == null){
                                child.dataset.priority = "0";
                            }else{
                                child.dataset.priority = data[i].chart_prop[0].priority;
                            }

                            child.className = 'd-inline float-left parameters-module '+data[0].serial+'-parameter';
                            canvasLcd.id = 'lcd_' + data[i].id;
                            canvasLcd.className = 'lcd-parameters';
                            title.id = 'chartTitle_' + data[i].id;
                                if(data[i].chart_title == null){
                                    if(Object.keys(data[i].chart_prop).length === 0){title.innerHTML = '';}else{
                                       title.innerHTML = data[i].chart_prop[0].label;
                                    }
                                }else{
                                    title.innerHTML = data[i].chart_title;
                                }

                            title.className = 'chartTitle';
                            canvasChart.id = 'chart_' + data[i].id;

                            child.appendChild(canvasLcd);
                            child.appendChild(title);
                            child.appendChild(canvasChart);

                            parent.appendChild(child);

                        }

                        //Re-order sorting
                        for(var i=0; i< data.length;i++){
                            var divList = $("."+data[0].serial+"-parameter");
                            divList.sort(function(a, b){
                                return $(b).data("priority")-$(a).data("priority")
                            });
                            $("#"+data[0].serial+"-parameters").html(divList);
                        }

                        //initialize lcd charts

                        var options=[];
                        var chartDataSet=[];

                        for(var i=0; i< data.length; i++){
                            if(Object.keys(data[i].chart_prop).length === 0){
                                    var unit = '';
                                    var label = '';
                                    var category = 'line';
                                }else{
                                    if(data[i].chart_prop[0].unit == null){var unit = '';}else{var unit = data[i].chart_prop[0].unit;}
                                    var label= data[i].chart_prop[0].label;
                                    var category= data[i].chart_prop[0].chart_category;
                                }
                          var lcdId = 'lcd_'+data[i].id;

                        if(label.length > 13){
                            var width = 120 + ((label.length - 13)*9);
                        }else{
                            var width =120;
                            if(unit.length > 1){
                                width +=  (unit.length - 1)*9;
                            }
                        }

                          lcd[lcdId] = new steelseries.DisplaySingle(lcdId, {
                            width: width,
                            height: 50,
                            unitString: unit,
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: label
                            });

                          if(typeof data[i].data[0][data[i].parameter] === 'boolean' ){
                            setLastValue(lcd[lcdId], data[i].data[0][data[i].parameter]);
                          }else{
                            setLastValue(lcd[lcdId], parseFloat(data[i].data[0][data[i].parameter]));
                          }


                          //var dataInsertArray = [data[i].data[1][data[i].parameter], data[i].data[3][data[i].parameter],
                                        //data[i].data[5][data[i].parameter], data[i].data[7][data[i].parameter],
                                        //data[i].data[9][data[i].parameter], data[i].data[11][data[i].parameter],
                                        //data[i].data[13][data[i].parameter], data[i].data[15][data[i].parameter],
                                        //data[i].data[17][data[i].parameter], data[i].data[19][data[i].parameter]]
                            var reverseData = data[i].data;
                                var reverseData = reverseData.reverse();

                            var labels = reverseData.map(function(e) {
                               return moment(e.datetime).format('MM/DD/YYYY h:mm:ss a');
                            });



                            var dataChart = reverseData.map(function(e) {
                               return e[data[i].parameter];
                            });;



                            if(typeof data[i].data[0][data[i].parameter]=== 'boolean'){
                                var max = 1;
                                var min = 0;

                                //Plot limits
                                if(data[i].chart_prop[0].plot_limit){
                                     var plot =  [{"y": data[i].chart_prop[0].limit_high},
                                                                   {"y": data[i].chart_prop[0].limit_low}];
                                }else if(data[i].chart_prop[0].plot_control){
                                    var plot =  [{"y": data[i].chart_prop[0].control_max,
                                                    "style": "rgba(0,0,255,0.6)"},
                                                                   {"y": data[i].chart_prop[0].control_min,
                                                                    "style": "rgba(0,0,255,0.6)"}];
                                }else{
                                    var plot =  [];
                                }

                                //INIT Charts
                                    options[i] ={ "horizontalLine":plot,
                                                legend: {
                                                    display: false,
                                                    position: 'top',
                                                    labels:{
                                                        boxWidth: 80,
                                                        fontColor: 'black'
                                                        }
                                                    },
                                                scales:{

                                                    yAxes: [{
                                                        ticks: {
                                                            min: min,
                                                            max: max,
                                                            stepSize: 1
                                                                },
                                                        scaleLabel: {
                                                            display:true,
                                                            labelString: label + '(' + unit + ')'
                                                                }
                                                        }],
                                                        xAxes: [{
                                                                type:'time',
                                                                distribution: 'linear',
                                                                offset: false,
                                                                bounds: 'data',
                                                                time:{
                                                                    stepSize: 0.5
                                                                },
                                                                ticks: {
                                                                    major:{
                                                                        enabled: true,
                                                                        fontStyle: 'bold'
                                                                    },
                                                                    minor:{
                                                                        enabled:true
                                                                    },
                                                                    source: 'auto',
                                                                    autoSkip: true,
                                                                    autoSkipPadding: 0,
                                                                    maxRotation: 0,
                                                                    sampleSize: 100,

                                                                }
                                                            }],

                                                    }
                                    };
                            }else{

                                var max = Math.max.apply(this, dataChart);
                                var min = Math.min.apply(this, dataChart);

                                if(max < 0){
                                    max = max-(max*0.10);
                                }else{max = max+(max*0.10);}

                                if(min < 0){
                                    min = min+(min*0.10);
                                }else{
                                    min = min-(min*0.10);
                                }

                                //Plot limits and chart max with min
                                if(data[i].chart_prop[0].plot_limit){
                                    if(data[i].chart_prop[0].control_category == "threshold"){
                                        var plot =  [{"y": data[i].chart_prop[0].limit_high}];
                                        var temp_max = parseFloat(data[i].chart_prop[0].limit_high);
                                        if(temp_max > max){
                                            max = temp_max+(temp_max*0.20);
                                        }
                                    }else{
                                        var plot =  [{"y": data[i].chart_prop[0].limit_high},
                                                                   {"y": data[i].chart_prop[0].limit_low}];
                                         var temp_max = parseFloat(data[i].chart_prop[0].limit_high);
                                         var temp_min = parseFloat(data[i].chart_prop[0].limit_low);
                                        if(temp_max > max){
                                            max = temp_max+(temp_max*0.20);
                                        }
                                        if(temp_min < min){
                                            min = temp_min-(temp_min*0.20);
                                        }
                                    }

                                }else if(data[i].chart_prop[0].plot_control){
                                    if(data[i].chart_prop[0].control_category == "threshold"){
                                        var plot =  [{"y": data[i].chart_prop[0].control_max,
                                                        "style": "rgba(0,0,255,0.6)"}];
                                        var temp_max = parseFloat(data[i].chart_prop[0].control_max);
                                    if(temp_max > max){
                                            max = temp_max+(temp_max*0.20);
                                        }
                                    }else{
                                        var plot =  [{"y": data[i].chart_prop[0].control_max,
                                                        "style": "rgba(0,0,255,0.6)"},
                                                                   {"y": data[i].chart_prop[0].control_min,
                                                        "style": "rgba(0,0,255,0.6)"}];
                                        var temp_max = parseFloat(data[i].chart_prop[0].control_max);
                                         var temp_min = parseFloat(data[i].chart_prop[0].control_min);
                                        if(temp_max > max){
                                            max = temp_max+(temp_max*0.20);
                                        }
                                         if(temp_min < min){
                                            min = temp_min-(temp_min*0.20);
                                        }
                                    }

                                }else{
                                    var plot =  [];
                                }


                                //INIT Charts
                                    options[i] ={   "horizontalLine": plot,
                                                legend: {
                                                    display: false,
                                                    position: 'top',
                                                    labels:{
                                                        boxWidth: 80,
                                                        fontColor: 'black'
                                                        }
                                                    },
                                                scales:{

                                                    yAxes: [{
                                                        ticks: {
                                                            min: min,
                                                            max: max
                                                                },
                                                        offset:true,
                                                        scaleLabel: {
                                                            display:true,
                                                            labelString: label + '(' + unit + ')'
                                                                }
                                                        }],
                                                         xAxes: [{
                                                                type:'time',
                                                                distribution: 'linear',
                                                                offset: false,
                                                                bounds: 'data',
                                                                time:{
                                                                    stepSize: 0.5
                                                                },
                                                                ticks: {
                                                                    major:{
                                                                        enabled: true,
                                                                        fontStyle: 'bold'
                                                                    },
                                                                    minor:{
                                                                        enabled:true
                                                                    },
                                                                    source: 'auto',
                                                                    autoSkip: true,
                                                                    autoSkipPadding: 0,
                                                                    maxRotation: 0,
                                                                    sampleSize: 100,

                                                                }
                                                            }],

                                                    }
                                    };
                            }


                            //plugin
var horizonalLinePlugin = {
  afterDraw: function(chartInstance) {
    var yValue;
    var yScale = chartInstance.scales["y-axis-0"];
    var canvas = chartInstance.chart;
    var ctx = canvas.ctx;
    var index;
    var line;
    var style;

    if (chartInstance.options.horizontalLine) {
      for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
        line = chartInstance.options.horizontalLine[index];

        if (!line.style) {
          style = "rgba(255,0,0, .6)";
        } else {
          style = line.style;
        }

        if (line.y) {
          yValue = yScale.getPixelForValue(line.y);
        } else {
          yValue = 0;
        }

        ctx.lineWidth = 1;

        if (yValue) {
          ctx.setLineDash([5, 3]);
          ctx.beginPath();
          ctx.moveTo(canvas.chartArea.left, yValue);
          ctx.lineTo(canvas.width, yValue);
          ctx.strokeStyle = style;
          ctx.stroke();
        }

        if (line.text) {
          ctx.fillStyle = style;
          ctx.fillText(line.text, 0, yValue + ctx.lineWidth);
        }
      }
      return;
    }
  }
};
Chart.pluginService.register(horizonalLinePlugin);

                           chartDataSet[i]= {
                                    labels: labels,
                                    datasets:[{
                                        label: data[i].parameter,
                                        data: dataChart,
                                        fill: false,
                                        lineTension: 0.5,
                                        borderColor: 'rgba(151, 190, 252,0.8)',
                                        backgroundColor: 'rgba(151, 190, 252,1)'
                                    }]
                                };

                                //Run chart
                                var chartTemp = 'chart_' + data[i].id;
                                chartObject[chartTemp] = new Chart(chartTemp, {
                                        type: category,
                                        data: chartDataSet[i],
                                        options: options[i]
                                    });

                                // based on my answer here: https://stackoverflow.com/questions/47146427




                                //Last update text:
                                //$('#lastUpdate_'+data[i].serial).text('Last update: ' + moment(data[i].data[19].datetime).calendar());

                        }






                }

            });

                       //Request Alarm
            var alarmSection = document.getElementById('alarm_'+id);

            //Check permission
            if (typeof(alarmSection) != 'undefined' && alarmSection != null){
            var ajaxCounts = Object.keys(ajaxRequests).length;
            ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/getAlarmV2/' + id + '/?format=json',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    //data: "check",
                    success: function(data_alarm){
                        var data_alarm = reJsonDataAlarm(data_alarm);
                        console.log(data_alarm);
                        if(data_alarm.length == 0){
                             var text = document.createElement('h3');
                             text.innerHTML = 'No new alarms available';
                             document.getElementById('alarm_'+ id).appendChild(text);

                        }else{
                            //To get ID
                        var nodeProcessed = document.getElementsByClassName(data_alarm[0].serial);
                        var alarmTable = document.getElementById('alarmTable_' + nodeProcessed[0].id).getElementsByTagName('tbody')[0];

                        for(var i = alarmTable.rows.length - 1; i >= 0; i--)
                        {
                            alarmTable.deleteRow(i);
                        }

                        for(var a=0; a<data_alarm.length; a++){
                            var newRow   = alarmTable.insertRow(a);

                            // Insert a cell in the row at index 0
                            var parameter  = newRow.insertCell(0);
                            var date  = newRow.insertCell(1);
                            var time = newRow.insertCell(2)
                            var value  = newRow.insertCell(3);
                            var lower_lim  = newRow.insertCell(4);
                            var upper_lim  = newRow.insertCell(5);
                            var remove  = newRow.insertCell(6);
                            console.log('inserted Alarm');

                            //Split datetime
                            var datetime = data_alarm[a].datetime;
                            var dateString = moment(datetime).format('YYYY/MM/DD');
                            var timeString = moment(datetime).format('hh:mm a');

                            parameter.innerHTML=data_alarm[a].label;
                            date.innerHTML=dateString;
                            time.innerHTML= timeString;
                            value.innerHTML=data_alarm[a].value;
                            lower_lim.innerHTML=data_alarm[a].limitLower;
                            upper_lim.innerHTML=data_alarm[a].limitUpper;

                            var rmvBtn= document.createElement('button');
                            rmvBtn.id = data_alarm[a].id;
                            rmvBtn.className = 'btn btn-primary dashboardRemoveAlarm';
                            rmvBtn.innerHTML = 'Remove';
                            remove.appendChild(rmvBtn);




                        }
                        }

                    }
                });
            }
}

//Offline ajax id request
function requestAjaxOffline(id){
    callDailyChart(id);
    var ajaxCounts = Object.keys(ajaxRequests).length;
    ajaxRequests[ajaxCounts] = $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardDataV3/' + id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){

                    data = reConstructSingleJSON(data);
                    //console.log('success for  '+ data[0].serial);
                    var nodeProcessed = document.getElementsByClassName(data[0].serial);
                    ajaxNodeProcess[nodeProcessed[0].id] = true;
                    console.log('processes' + data[0].serial + ':' + ajaxNodeProcess[nodeProcessed[0].id]);

                    //Spinner disable and Links enable
                    var spinnerNode = document.getElementById('spinner_'+nodeProcessed[0].id);
                    spinnerNode.classList.remove('lds-roller');

                    var navLinks = document.getElementById('nodeLinks_'+nodeProcessed[0].id);
                    for(var i=0; i< navLinks.children.length; i++){
                        navLinks.children[i].setAttribute('style', 'pointer-events:all');
                    }
                    //store node parameters
                    nodeParameters[nodeProcessed[0].id] = data;
                    //console.log(nodeParameters);

                    //Append DOM
                        for(var i=0; i< data.length;i++){
                            var parent = document.getElementById(data[0].serial + '-parameters');
                            let child = document.createElement('div');
                            let canvasLcd = document.createElement('canvas');
                            let title = document.createElement('h3');
                            let canvasChart = document.createElement('canvas');
                            child.id = data[i].id;
                            child.className = 'd-inline float-left parameters-module';
                            canvasLcd.id = 'lcd_' + data[i].id;
                            canvasLcd.className = 'lcd-parameters';
                            title.id = 'chartTitle_' + data[i].id;
                                if(data[i].chart_title == null){
                                    if(Object.keys(data[i].chart_prop).length === 0){title.innerHTML = '';}else{
                                       title.innerHTML = data[i].chart_prop[0].label;
                                    }
                                }else{
                                    title.innerHTML = data[i].chart_title;
                                }

                            title.className = 'chartTitle';
                            canvasChart.id = 'chart_' + data[i].id;

                            child.appendChild(canvasLcd);
                            child.appendChild(title);
                            child.appendChild(canvasChart);

                            parent.appendChild(child);

                        }

                        //initialize lcd charts

                        var options=[];
                        var chartDataSet=[];

                        for(var i=0; i< data.length; i++){
                            if(Object.keys(data[i].chart_prop).length === 0){
                                    var unit = '';
                                    var label = '';
                                    var category = 'line';
                                }else{
                                    if(data[i].chart_prop[0].unit == null){var unit = '';}else{var unit = data[i].chart_prop[0].unit;}
                                    var label= data[i].chart_prop[0].label;
                                    var category= data[i].chart_prop[0].chart_category;
                                }
                          var lcdId = 'lcd_'+data[i].id;

                        if(label.length > 13){
                            var width = 120 + ((label.length - 13)*9);
                        }else{
                            var width =120;
                            if(unit.length > 1){
                                width +=  (unit.length - 1)*9;
                            }
                        }

                          lcd[lcdId] = new steelseries.DisplaySingle(lcdId, {
                            width: width,
                            height: 50,
                            unitString: unit,
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: label
                            });
                          console.log(data);
                          if(typeof data[i].data[data[i].parameter] === 'boolean' ){
                            setLastValue(lcd[lcdId], data[i].data[data[i].parameter]);
                          }else{
                            setLastValue(lcd[lcdId], parseFloat(data[i].data[data[i].parameter]));
                          }



                            var labels = [];



                            var dataChart = [];

                            if(typeof data[i].data[data[i].parameter]=== 'boolean'){
                                var max = 1;
                                var min = 0;

                                //INIT Charts
                                    options[i] ={
                                                legend: {
                                                    display: false,
                                                    position: 'top',
                                                    labels:{
                                                        boxWidth: 80,
                                                        fontColor: 'black'
                                                        }
                                                    },
                                                scales:{

                                                    yAxes: [{
                                                        ticks: {
                                                            min: min,
                                                            max: max,
                                                            stepSize: 1
                                                                },
                                                        scaleLabel: {
                                                            display:true,
                                                            labelString: label + '(' + unit + ')'
                                                                }
                                                        }],
                                                        xAxes: [{
                                                                type:'time',
                                                                distribution: 'linear',
                                                                offset: false,
                                                                bounds: 'data',
                                                                time:{
                                                                    stepSize: 0.5
                                                                },
                                                                ticks: {
                                                                    major:{
                                                                        enabled: true,
                                                                        fontStyle: 'bold'
                                                                    },
                                                                    minor:{
                                                                        enabled:true
                                                                    },
                                                                    source: 'auto',
                                                                    autoSkip: true,
                                                                    autoSkipPadding: 0,
                                                                    maxRotation: 0,
                                                                    sampleSize: 100,

                                                                }
                                                            }],

                                                    }
                                    };
                            }else{
                                var max = Math.max.apply(this, dataChart);
                                var min = Math.min.apply(this, dataChart);

                                if(max < 0){
                                    max = max-(max*0.10);
                                }else{max = max+(max*0.10);}

                                if(min < 0){
                                    min = min+(min*0.10);
                                }else{
                                    min = min-(min*0.10);
                                }

                                //INIT Charts
                                    options[i] ={
                                                legend: {
                                                    display: false,
                                                    position: 'top',
                                                    labels:{
                                                        boxWidth: 80,
                                                        fontColor: 'black'
                                                        }
                                                    },
                                                scales:{

                                                    yAxes: [{
                                                        ticks: {
                                                            min: min,
                                                            max: max
                                                                },
                                                        offset:true,
                                                        scaleLabel: {
                                                            display:true,
                                                            labelString: label + '(' + unit + ')'
                                                                }
                                                        }],
                                                         xAxes: [{
                                                                type:'time',
                                                                distribution: 'linear',
                                                                offset: false,
                                                                bounds: 'data',
                                                                time:{
                                                                    stepSize: 0.5
                                                                },
                                                                ticks: {
                                                                    major:{
                                                                        enabled: true,
                                                                        fontStyle: 'bold'
                                                                    },
                                                                    minor:{
                                                                        enabled:true
                                                                    },
                                                                    source: 'auto',
                                                                    autoSkip: true,
                                                                    autoSkipPadding: 0,
                                                                    maxRotation: 0,
                                                                    sampleSize: 100,

                                                                }
                                                            }],

                                                    }
                                    };
                            }


                            Chart.plugins.register({
                                afterDraw: function(chart) {
                                if (chart.data.datasets[0].data.length === 0) {
                                    // No data is present
                                  var ctx = chart.chart.ctx;
                                  var width = chart.chart.width;
                                  var height = chart.chart.height;
                                  console.log(chart.chart.canvas.id);
                                  var serial = chart.chart.canvas.id.split(/_/)[1];

                                  chart.clear();

                                  ctx.save();
                                  ctx.textAlign = 'center';
                                  ctx.textBaseline = 'middle';
                                  ctx.font = "16px normal 'Helvetica Nueue'";
                                  ctx.fillText('Node is offline', width / 2, height / 2.3);
                                  ctx.fillText(document.getElementById('lastUpdate_'+serial).innerHTML, width/2, height/2);
                                  ctx.restore();
                                }
                              }
                            });

                           chartDataSet[i]= {
                                    labels: labels,
                                    datasets:[{
                                        label: data[i].parameter,
                                        data: dataChart,
                                        fill: false,
                                        lineTension: 0.5,
                                        borderColor: 'rgba(151, 190, 252,0.8)'
                                    }]
                                };

                                //Run chart
                                var chartTemp = 'chart_' + data[i].id;
                                chartObject[chartTemp] = new Chart(chartTemp, {
                                        type: category,
                                        data: chartDataSet[i],
                                        options: options[i]
                                    });

                                // based on my answer here: https://stackoverflow.com/questions/47146427




                                //Last update text:
                                //$('#lastUpdate_'+data[i].serial).text('Last update: ' + moment(data[i].data[19].datetime).calendar());

                        }






                }

            });

                       //Request Alarm
            var alarmSection = document.getElementById('alarm_'+id);

            //Check permission
            if (typeof(alarmSection) != 'undefined' && alarmSection != null){
            var ajaxCounts = Object.keys(ajaxRequests).length;
            ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/getAlarm/' + id + '/?format=json',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    //data: "check",
                    success: function(data_alarm){

                        if(data_alarm.length == 0){
                             var text = document.createElement('h3');
                             text.innerHTML = 'No new alarms available';
                             document.getElementById('alarm_'+ id).appendChild(text);

                        }else{
                            //To get ID
                        var nodeProcessed = document.getElementsByClassName(data_alarm[0].serial);
                        var alarmTable = document.getElementById('alarmTable_' + nodeProcessed[0].id).getElementsByTagName('tbody')[0];

                        for(var i = alarmTable.rows.length - 1; i >= 0; i--)
                        {
                            alarmTable.deleteRow(i);
                        }

                        for(var a=0; a<data_alarm.length; a++){
                            var newRow   = alarmTable.insertRow(a);

                            // Insert a cell in the row at index 0
                            var parameter  = newRow.insertCell(0);
                            var date  = newRow.insertCell(1);
                            var time = newRow.insertCell(2)
                            var value  = newRow.insertCell(3);
                            var lower_lim  = newRow.insertCell(4);
                            var upper_lim  = newRow.insertCell(5);
                            var remove  = newRow.insertCell(6);
                            console.log('inserted Alarm');

                            //Split datetime
                            var datetime = data_alarm[a].datetime.split(/,/);
                            var timeString = datetime[0];
                            var dateString = datetime[1];

                            parameter.innerHTML=data_alarm[a].parameter;
                            date.innerHTML=dateString;
                            time.innerHTML= timeString;
                            value.innerHTML=data_alarm[a].value;
                            lower_lim.innerHTML=data_alarm[a].limitLower;
                            upper_lim.innerHTML=data_alarm[a].limitUpper;

                            var rmvBtn= document.createElement('button');
                            rmvBtn.id = data_alarm[a].id;
                            rmvBtn.className = 'btn btn-primary dashboardRemoveAlarm';
                            rmvBtn.innerHTML = 'Remove';
                            remove.appendChild(rmvBtn);




                        }
                        }

                    }
                });
            }
}

function loadAlarmHistoryLink(id){

    //Check if it was loaded
    if( ajaxAlarmHistoryProcess[id] == false){

        //Delete rows if exists
        var alarmHistoryTable = document.getElementById('alarmHistoryTable_' + id).getElementsByTagName('tbody')[0];
        for(var i = alarmHistoryTable.rows.length - 1; i >= 0; i--)
                        {
                            alarmHistoryTable.deleteRow(i);
                        }

        //Start request
        var spinnerNode = document.getElementById('spinnerAlarmHistory_'+id);
        spinnerNode.classList.add('lds-roller');
        var ajaxCounts = Object.keys(ajaxRequests).length;
        ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/getAlarmHistoryV2/' + id + '/?format=json',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    async: true,
                    //data: "check",
                    success: function(data){
                        if(data.length == 0){
                             var spinnerNode = document.getElementById('spinnerAlarmHistory_'+ id);
                             spinnerNode.classList.remove('lds-roller');

                             var text = document.createElement('h3');
                             text.innerHTML = 'No history available';
                             document.getElementById('alarmHistory_'+ id).appendChild(text);
                             ajaxAlarmHistoryProcess[id] = true;
                        }else{

                            var nodeID = document.getElementsByClassName(data.alarm_prop[0].serial);
                            var spinnerNode = document.getElementById('spinnerAlarmHistory_'+ nodeID[0].id);
                            spinnerNode.classList.remove('lds-roller');

                            //Store loaded in object
                            ajaxAlarmHistoryProcess[nodeID[0].id] = true;


                            //Append Table Rows
                            var alarmHistoryTable = document.getElementById('alarmHistoryTable_' + nodeID[0].id).getElementsByTagName('tbody')[0];
                            for(var a=0; a<data.history.length; a++){
                                var newRow   = alarmHistoryTable.insertRow(a);
                                console.log('History all inserted');
                                // Insert a cell in the row at index 0
                                var alarmTime  = newRow.insertCell(0);
                                var serial  = newRow.insertCell(1);
                                var parameter  = newRow.insertCell(2);
                                var value  = newRow.insertCell(3);
                                var lower_lim  = newRow.insertCell(4);
                                var upper_lim  = newRow.insertCell(5);
                                var ackBy  = newRow.insertCell(6);
                                var ackTime  = newRow.insertCell(7);

                                alarmTime.innerHTML=moment(data.history[a].alarm_datetime).format('h:mm a, DD-MMM-YYYY');
                                serial.innerHTML=data.history[a].serial;
                                for(var x=0; x<data.alarm_prop.length; x++){
                                    if(data.history[a].parameter == data.alarm_prop[x].parameter){
                                        parameter.innerHTML=data.alarm_prop[x].label;
                                    }
                                }

                                value.innerHTML=data.history[a].value;
                                lower_lim.innerHTML=data.history[a].limitLower;
                                upper_lim.innerHTML=data.history[a].limitUpper;
                                ackBy.innerHTML=data.history[a].user_removal;
                                ackTime.innerHTML=moment(data.history[a].remove_datetime).format('h:mm a, DD-MMM-YYYY');

                            }
                        }



                    }
                });
    }


}

function loadChartsLink(id){
                for(var i=0; i< Object.keys(ajaxRequests).length; i++){
                        ajaxRequests[i].abort();
                        console.log('aborted from charts rtrv');
                    }
                        document.getElementById("firstParameterSelect_"+id).disabled = false;
                        document.getElementById("chartParameters_"+id).style.display = "none";
                        var spinnerNode = document.getElementById('spinnerParCharts_'+id);
                        spinnerNode.classList.add('lds-roller');
                        var spinnerNode = document.getElementById('spinnerRetrieveCharts_'+id);
                        spinnerNode.classList.remove('lds-roller');
                        //document.getElementById("btnRetrieveChart_"+id).style.display = "block";
                        //document.getElementById("btnRetrieveRawData_"+id).style.display = "block";
                        $('#controlButtons_'+id).hide();
                        document.getElementById("btnAddNewChart_"+id).style.display = "none";
                        document.getElementById("btnResetCharts_"+id).style.display = "none";
                        document.getElementById('canvasWrapper_'+id).innerHTML = "";
                         cashedCharts = {}; //clear cache
                         chartsRequestedCount = 0;
                         chartsRetrievedCount = 0;
                        //init input fields
$(function () {
                                 $('#startChartDate_'+id).datetimepicker({
                                    defaultDate: moment().subtract(1, "days").format('YYYY-MM-DD h:mm a'),
                                    sideBySide: true,
                                    ignoreReadonly: true
                                 });
                                 $('#endChartDate_'+id).datetimepicker({
                                    defaultDate: moment().format('YYYY-MM-DD h:mm a'),
                                    sideBySide: true,
                                    ignoreReadonly: true
                                 });
            });





    $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getChartParameter/' + id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    chartParameters = data;
                    var spinnerNode = document.getElementById('spinnerParCharts_'+id);
                        spinnerNode.classList.remove('lds-roller');
                    //$('#btnRetrieveChart_'+id).removeAttr('disabled');
                    //$('#btnRetrieveRawData_'+id).removeAttr('disabled');
                    $('#controlButtons_'+id).show();
                    var parentForm = document.getElementById('chartParameters_'+id);
                    //create first parameter
                    var parentFirstParam = document.getElementById('firstParameterSelect_'+id);
                    parentFirstParam.innerHTML = "";
                    var htmlFirstParam="";
                    for (var i=0; i< data.chart_prop.length;i++){
                        if(data.chart_prop[i].chart_title == null){
                             htmlFirstParam += "<option value='"+data.chart_prop[i].parameter+"'>"+ data.chart_prop[i].label +"</option>"
                        }else{
                            htmlFirstParam += "<option value='"+data.chart_prop[i].parameter+"'>"+ data.chart_prop[i].chart_title +"</option>"
                        }

                    }
                    parentFirstParam.innerHTML = htmlFirstParam;
                    //Delete first all parameters
                     while (parentForm.firstChild) {
                            parentForm.removeChild(parentForm.lastChild);
                          }
                    //Create new ones
                    for(var i=0; i< data.chart_prop.length;i++){
                        var child1 = document.createElement('div');
                        var child2 = document.createElement('label');
                        var child3 = document.createElement('input');

                        child1.className ='form-check-inline';
                        child2.className ='form-check-label';

                            if(data.chart_prop[i].chart_title == null){

                                    child2.innerHTML = "<input type='checkbox' class='form-check-input' name='chartParameter' value='" + data.chart_prop[i].parameter +"'>" + data.chart_prop[i].label;


                            }else{
                                child2.innerHTML = "<input type='checkbox' class='form-check-input' name='chartParameter' value='" + data.chart_prop[i].parameter +"'>" + data.chart_prop[i].chart_title;
                            }



                        //child3.type='radio';
                        //child3.class='form-check-input';
                        //child3.name=data[i].parameter;
                        //child3.innerHTML=data[i].parameter;

                        //child2.appendChild(child3);
                        child1.appendChild(child2);

                        parentForm.appendChild(child1);
                    }


                }
            });



}

function retrieveChart(id){
    document.getElementById('errorMessage_'+id).innerHTML = '';


   // var idForm = '#chartForm_'+id + ' [name=chartParameter]';
    //var radio = $(idForm);

    /*for(var i=0; i< radio.length; i++){
        if(radio[i].checked){
            var chartParameter = radio[i].value;

        }
    }*/
    var chartParameter = $('#firstParameterSelect_'+id).val();
    var startDate = $('[name= startDateInput_' + id + ']').val();
    var endDate = $('[name= endDateInput_' + id + ']').val();

    if(startDate=='' || endDate==''){
        document.getElementById('errorMessage_'+id).innerHTML = '*Fill all the fields';
    }else{
            if(moment(endDate).diff(moment(startDate), 'months', true) > 1){
                    document.getElementById('errorMessage_'+id).innerHTML = '*Date range must be 1 month maximum';
                }else{
                    //All accepted
                    //Spinner
                    var spinnerNode = document.getElementById('spinnerRetrieveCharts_'+id);
                        spinnerNode.classList.add('lds-roller');
                    var startEpoch = moment(startDate, 'M/D/YYYY h:mm a').unix();
                    var endEpoch = moment(endDate, 'M/D/YYYY h:mm a').unix();
                    reservedStartEpoch = startEpoch;
                    reservedEndEpoch = endEpoch;
                    console.log('radio: '+chartParameter);
                    console.log('start: '+startDate+ ',   Epoch: '+startEpoch);
                    console.log('end: '+endDate+ ',  Epoch: '+ endEpoch);

                    ajaxRetrieveChart(id, chartParameter, startEpoch, endEpoch);
                }
    }




}

function ajaxRetrieveChart(id, parameter, startEpoch, endEpoch){
                         chartsRequestedCount += 1;

    var ajaxCounts = Object.keys(ajaxRequests).length;
        ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/retrieveChartV2/'+ id + '/' + parameter + '/' + startEpoch + '/' + endEpoch + '/',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    async: true,
                    //data: "check",
                    success: function(dataGot){

                        cashedCharts[parameter] = dataGot;
                        chartsRetrievedCount += 1;
                        if(chartsRequestedCount == chartsRetrievedCount){
                            var spinnerNode = document.getElementById('spinnerRetrieveCharts_'+id);
                            spinnerNode.classList.remove('lds-roller');
                        }
                        document.getElementById("firstParameterSelect_"+id).disabled = true;
                        document.getElementById("chartParameters_"+id).style.display = "block";
                        $('#saveRetrievedChart_'+id).removeAttr('disabled');
                        //document.getElementById("btnRetrieveChart_"+id).style.display = "none";
                        //document.getElementById("btnRetrieveRawData_"+id).style.display = "none";
                        $('#controlButtons_'+id).hide();
                        document.getElementById("btnAddNewChart_"+id).style.display = "block";
                        document.getElementById("btnResetCharts_"+id).style.display = "block";

//<button id="saveRetrievedChart_${data.node[i].device_id}" class="btn downloadChart" style="float:right;" disabled>Download</button>
                        var parentCharts =  document.getElementById('canvasWrapper_'+id);
                                var child = document.createElement('div');
                                child.id = 'retrievedChart_'+id+'-'+parameter;
                                child.style.width = '100%';
                                child.style.height = '500px';

                                parentCharts.appendChild(child);


                                var chart_category = cashedCharts[parameter].chart_prop[0].chart_category;
                                //Chart create
                                for(var x=0; x<chartParameters.chart_prop.length; x++){
                                        if(chartParameters.chart_prop[x].parameter == parameter){
                                            if(chartParameters.chart_prop[x].chart_title == null){
                                                var chartTitle = chartParameters.chart_prop[x].label;
                                            }else{
                                                var chartTitle = chartParameters.chart_prop[x].chart_title;
                                            }

                                        }
                                    }
                                //Chart append
                                    var labels = cashedCharts[parameter].data.map(function(e) {
                                           return moment(e.datetime).format('MM/DD/YYYY h:mm:ss a');
                                        });
                                    var data = cashedCharts[parameter].data.map(function(e) {
                                           return e[parameter];
                                        });;
                                    var chartData = [];
                                for(var i=0; i< labels.length; i++){
                                    var tempObj ={};
                                    tempObj.date = labels[i];
                                    tempObj.value = data[i];
                                    chartData.push(tempObj);
                                }

                                console.log(chartData);
                                //Chart starts
                                am4core.useTheme(am4themes_animated);
                                // Themes end

                                // Create chart instance
                                var chart = am4core.create('retrievedChart_'+id+'-'+parameter, am4charts.XYChart);

                                chart.data = chartData;
                                chart.exporting.menu = new am4core.ExportMenu();
                                chart.exporting.filePrefix = "ChartView";
                                if(permission.raw_data){
                                    var raw_data = {
                                            "label": "Data",
                                            "menu": [
                                              { "type": "json", "label": "JSON" },
                                              { "type": "csv", "label": "CSV" },
                                              { "type": "xlsx", "label": "XLSX" },
                                              { "type": "html", "label": "HTML" },
                                              { "type": "pdfdata", "label": "PDF" }
                                            ]
                                          };
                                }
                                chart.exporting.menu.items = [
                                      {
                                        "label": "...",
                                        "menu": [
                                          {
                                            "label": "Image",
                                            "menu": [
                                              { "type": "png", "label": "PNG" },
                                              { "type": "jpg", "label": "JPG" },
                                              { "type": "svg", "label": "SVG" },
                                              { "type": "pdf", "label": "PDF" }
                                            ]
                                          }, raw_data, {
                                            "label": "Print", "type": "print"
                                          }
                                        ]
                                      }
                                    ];
                                chart.logo.disabled =true;
                                chart.dateFormatter.inputDateFormat = "MM/dd/yyyy hh:mm:ss a";
                                chart.export = true;
                                //title
                                var topContainer = chart.chartContainer.createChild(am4core.Container);
                                topContainer.layout = "absolute";
                                topContainer.toBack();
                                topContainer.paddingBottom = 15;
                                topContainer.width = am4core.percent(100);

                                var title = topContainer.createChild(am4core.Label);
                                title.text = chartTitle;
                                title.fontWeight = 600;
                                title.align = "center";
// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.groupData = true;
dateAxis.baseInterval = {
  "timeUnit": "minute",
  "count": 1
};

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "date";
series.tooltipText = "{value}"
series.strokeWidth = 2;
series.minBulletDistance = 15;

// Drop-shaped tooltips
series.tooltip.background.cornerRadius = 20;
series.tooltip.background.strokeOpacity = 0;
series.tooltip.pointerOrientation = "vertical";
series.tooltip.label.minWidth = 40;
series.tooltip.label.minHeight = 40;
series.connect = false;
series.tooltip.label.textAlign = "middle";
series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.strokeWidth = 2;
bullet.circle.radius = 4;
bullet.circle.fill = am4core.color("#fff");

var bullethover = bullet.states.create("hover");
bullethover.properties.scale = 1.3;

// Make a panning cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "panXY";
chart.cursor.xAxis = dateAxis;
chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarY.parent = chart.leftAxesContainer;
chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.series.push(series);
chart.scrollbarX.parent = chart.bottomAxesContainer;

dateAxis.start = 0.00;
dateAxis.keepSelection = true;

                          //Plot limits and chart max with min
                                if(cashedCharts[parameter].chart_prop[0].plot_limit){
                                    if(cashedCharts[parameter].chart_prop[0].control_category == "threshold"){
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[parameter].chart_prop[0].limit_high;
                                        range.grid.stroke = am4core.color("#FF0000");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        valueAxis.max = (parseFloat(cashedCharts[parameter].chart_prop[0].limit_high)+(parseFloat(cashedCharts[parameter].chart_prop[0].limit_high)*0.2));
                                        valueAxis.extraMax = 0.2;
                                    }else{
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[parameter].chart_prop[0].limit_high;
                                        range.grid.stroke = am4core.color("#FF0000");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        var range2 = valueAxis.axisRanges.create();
                                        range2.value = cashedCharts[parameter].chart_prop[0].limit_low;
                                        range2.grid.stroke = am4core.color("#FF0000");
                                        range2.grid.strokeWidth = 1;
                                        range2.grid.strokeOpacity = 0.6;
                                        range2.grid.strokeDasharray = "3,3";
                                        valueAxis.max = (parseFloat(cashedCharts[parameter].chart_prop[0].limit_high)+(parseFloat(cashedCharts[parameter].chart_prop[0].limit_high)*0.2));
                                        valueAxis.min = (parseFloat(cashedCharts[parameter].chart_prop[0].limit_low)-(parseFloat(cashedCharts[parameter].chart_prop[0].limit_low)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }

                                }else if(cashedCharts[parameter].chart_prop[0].plot_control){
                                    if(cashedCharts[parameter].chart_prop[0].control_category == "threshold"){
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[parameter].chart_prop[0].control_max;
                                        range.grid.stroke = am4core.color("#0000FF");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        valueAxis.max =(parseFloat(cashedCharts[parameter].chart_prop[0].control_max)+(parseFloat(cashedCharts[parameter].chart_prop[0].control_max)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }else{
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[parameter].chart_prop[0].control_max;
                                        range.grid.stroke = am4core.color("#0000FF");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        var range2 = valueAxis.axisRanges.create();
                                        range2.value = cashedCharts[parameter].chart_prop[0].control_min;
                                        range2.grid.stroke = am4core.color("#0000FF");
                                        range2.grid.strokeWidth = 1;
                                        range2.grid.strokeOpacity = 0.6;
                                        range2.grid.strokeDasharray = "3,3";
                                        valueAxis.max = (parseFloat(cashedCharts[parameter].chart_prop[0].control_max)+(parseFloat(cashedCharts[parameter].chart_prop[0].control_max)*0.2));
                                        valueAxis.min = (parseFloat(cashedCharts[parameter].chart_prop[0].control_min)-(parseFloat(cashedCharts[parameter].chart_prop[0].control_min)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }

                                }




                                    //tick checkboxes
                                         var idForm = '#chartForm_'+id + ' [name=chartParameter]';
                                         var radio = $(idForm);
                                         for(var i=0; i< radio.length; i++){
                                            if(radio[i].value == parameter){
                                                radio[i].checked = true;
                                            }
                                         }
                                     }
                });
}

function addNewChart(id){
     var idForm = '#chartForm_'+id + ' [name=chartParameter]';
    var radio = $(idForm);

    for(var i=0; i< radio.length; i++){
        if(radio[i].checked){//checked, add view
            if($('#retrievedChart_'+id+'-'+radio[i].value).length == 0){ //check in DOM
                if(cashedCharts.hasOwnProperty(radio[i].value)){
                    drawAvailableDataCharts(id, radio[i].value);
                }else{
                     ajaxRetrieveChart(id, radio[i].value, reservedStartEpoch, reservedEndEpoch);
                     var spinnerNode = document.getElementById('spinnerRetrieveCharts_'+id);
                     spinnerNode.classList.add('lds-roller');
                }
            }

        }else{// unchecked remove view
           if($('#retrievedChart_'+id+'-'+radio[i].value).length == 1){
                $('#retrievedChart_'+id+'-'+radio[i].value).remove();
           }
        }
    }
}

function drawAvailableDataCharts(id, key){
    console.log('draw available dataChart');
style="position: relative;margin: auto;height: 40vh;width: 100vw;"


                                 var parentCharts =  document.getElementById('canvasWrapper_'+id);
                                var child = document.createElement('div');
                                child.id = 'retrievedChart_'+id+'-'+key;
                                child.style.width = '100%';
                                child.style.height = '500px';

                                parentCharts.appendChild(child);


                                var chart_category = cashedCharts[key].chart_prop[0].chart_category;
                                //Chart create
                                for(var x=0; x<chartParameters.chart_prop.length; x++){
                                        if(chartParameters.chart_prop[x].parameter == key){
                                            if(chartParameters.chart_prop[x].chart_title == null){
                                                var chartTitle = chartParameters.chart_prop[x].label;
                                            }else{
                                                var chartTitle = chartParameters.chart_prop[x].chart_title;
                                            }

                                        }
                                    }
                                //Chart append
                                    var labels = cashedCharts[key].data.map(function(e) {
                                           return moment(e.datetime).format('MM/DD/YYYY h:mm:ss a');
                                        });
                                    var data = cashedCharts[key].data.map(function(e) {
                                           return e[key];
                                        });;
                                    var chartData = [];
                                for(var i=0; i< labels.length; i++){
                                    var tempObj ={};
                                    tempObj.date = labels[i];
                                    tempObj.value = data[i];
                                    chartData.push(tempObj);
                                }


                                //Chart starts
                                am4core.useTheme(am4themes_animated);
                                // Themes end

                                // Create chart instance
                                var chart = am4core.create('retrievedChart_'+id+'-'+key, am4charts.XYChart);

                                chart.data = chartData;
                                chart.exporting.menu = new am4core.ExportMenu();
                                chart.exporting.filePrefix = "ChartView";
                                if(permission.raw_data){
                                    var raw_data = {
                                            "label": "Data",
                                            "menu": [
                                              { "type": "json", "label": "JSON" },
                                              { "type": "csv", "label": "CSV" },
                                              { "type": "xlsx", "label": "XLSX" },
                                              { "type": "html", "label": "HTML" },
                                              { "type": "pdfdata", "label": "PDF" }
                                            ]
                                          };
                                }
                                chart.exporting.menu.items = [
                                      {
                                        "label": "...",
                                        "menu": [
                                          {
                                            "label": "Image",
                                            "menu": [
                                              { "type": "png", "label": "PNG" },
                                              { "type": "jpg", "label": "JPG" },
                                              { "type": "svg", "label": "SVG" },
                                              { "type": "pdf", "label": "PDF" }
                                            ]
                                          }, raw_data, {
                                            "label": "Print", "type": "print"
                                          }
                                        ]
                                      }
                                    ];
                                chart.logo.disabled =true;
                                chart.dateFormatter.inputDateFormat = "MM/dd/yyyy hh:mm:ss a";
                                chart.export = true;
                                var topContainer = chart.chartContainer.createChild(am4core.Container);
                                topContainer.layout = "absolute";
                                topContainer.toBack();
                                topContainer.paddingBottom = 15;
                                topContainer.width = am4core.percent(100);

                                var title = topContainer.createChild(am4core.Label);
                                title.text = chartTitle;
                                title.fontWeight = 600;
                                title.align = "center";
// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.groupData = true;
dateAxis.baseInterval = {
  "timeUnit": "minute",
  "count": 1
};
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "value";
series.dataFields.dateX = "date";
series.tooltipText = "{value}"
series.strokeWidth = 2;
series.minBulletDistance = 15;

// Drop-shaped tooltips
series.tooltip.background.cornerRadius = 20;
series.tooltip.background.strokeOpacity = 0;
series.tooltip.pointerOrientation = "vertical";
series.tooltip.label.minWidth = 40;
series.tooltip.label.minHeight = 40;
series.tooltip.label.textAlign = "middle";
series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.strokeWidth = 2;
bullet.circle.radius = 4;
bullet.circle.fill = am4core.color("#fff");

var bullethover = bullet.states.create("hover");
bullethover.properties.scale = 1.3;

// Make a panning cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.behavior = "panXY";
chart.cursor.xAxis = dateAxis;
chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
chart.scrollbarY = new am4core.Scrollbar();
chart.scrollbarY.parent = chart.leftAxesContainer;
chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
chart.scrollbarX = new am4charts.XYChartScrollbar();
chart.scrollbarX.series.push(series);
chart.scrollbarX.parent = chart.bottomAxesContainer;

dateAxis.start = 0.79;
dateAxis.keepSelection = true;


 //Plot limits and chart max with min
                                if(cashedCharts[key].chart_prop[0].plot_limit){
                                    if(cashedCharts[key].chart_prop[0].control_category == "threshold"){
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[key].chart_prop[0].limit_high;
                                        range.grid.stroke = am4core.color("#FF0000");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        valueAxis.max = (parseFloat(cashedCharts[key].chart_prop[0].limit_high)+(parseFloat(cashedCharts[key].chart_prop[0].limit_high)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }else{
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[key].chart_prop[0].limit_high;
                                        range.grid.stroke = am4core.color("#FF0000");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        var range2 = valueAxis.axisRanges.create();
                                        range2.value = cashedCharts[key].chart_prop[0].limit_low;
                                        range2.grid.stroke = am4core.color("#FF0000");
                                        range2.grid.strokeWidth = 1;
                                        range2.grid.strokeOpacity = 0.6;
                                        range2.grid.strokeDasharray = "3,3";
                                        valueAxis.max = (parseFloat(cashedCharts[parameter].chart_prop[0].limit_high)+(parseFloat(cashedCharts[parameter].chart_prop[0].limit_high)*0.2));
                                        valueAxis.min = (parseFloat(cashedCharts[parameter].chart_prop[0].limit_low)-(parseFloat(cashedCharts[parameter].chart_prop[0].limit_low)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }

                                }else if(cashedCharts[key].chart_prop[0].plot_control){
                                    if(cashedCharts[key].chart_prop[0].control_category == "threshold"){
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[key].chart_prop[0].control_max;
                                        range.grid.stroke = am4core.color("#0000FF");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        valueAxis.max =(parseFloat(cashedCharts[key].chart_prop[0].control_max)+(parseFloat(cashedCharts[key].chart_prop[0].control_max)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }else{
                                        var range = valueAxis.axisRanges.create();
                                        range.value = cashedCharts[key].chart_prop[0].control_max;
                                        range.grid.stroke = am4core.color("#0000FF");
                                        range.grid.strokeWidth = 1;
                                        range.grid.strokeOpacity = 0.6;
                                        range.grid.strokeDasharray = "3,3";
                                        var range2 = valueAxis.axisRanges.create();
                                        range2.value = cashedCharts[key].chart_prop[0].control_min;
                                        range2.grid.stroke = am4core.color("#0000FF");
                                        range2.grid.strokeWidth = 1;
                                        range2.grid.strokeOpacity = 0.6;
                                        range2.grid.strokeDasharray = "3,3";
                                        valueAxis.max = (parseFloat(cashedCharts[key].chart_prop[0].control_max)+(parseFloat(cashedCharts[key].chart_prop[0].control_max)*0.2));
                                        valueAxis.min = (parseFloat(cashedCharts[key].chart_prop[0].control_min)-(parseFloat(cashedCharts[key].chart_prop[0].control_min)*0.2));
                                        valueAxis.extraMax = 0.2;
                                        valueAxis.extraMin = 0.2;
                                    }

                                }


}

function resetCharts(id){
                        document.getElementById("firstParameterSelect_"+id).disabled = false;
                        document.getElementById("chartParameters_"+id).style.display = "none";
                        //document.getElementById("btnRetrieveChart_"+id).style.display = "block";
                        //document.getElementById("btnRetrieveRawData_"+id).style.display = "block";
                        $('#controlButtons_'+id).show();
                        document.getElementById("btnAddNewChart_"+id).style.display = "none";
                        document.getElementById("btnResetCharts_"+id).style.display = "none";
                        document.getElementById('canvasWrapper_'+id).innerHTML = "";
                        cashedCharts = {}; //clear cache
                        chartsRequestedCount = 0;
                        chartsRetrievedCount = 0;

    var idForm = '#chartForm_'+id + ' [name=chartParameter]';
    var radio = $(idForm);

    for(var i=0; i< radio.length; i++){
        if(radio[i].checked){
            radio[i].checked = false;
        }
    }
}

var downloadChart = function(){
                      var elem = this.id;
                      var strings = elem.split('-');
                      var id = strings[1];
                      var parameter = strings[2];
                      console.log(id);
                      console.log(this);
                      $("#retrievedChart_"+id+"-"+parameter).get(0).toBlob(function(blob) {
                        saveAs(blob, "chart.png");
                      });
}

function retrieveRawData(id){
    var chartParameter = $('#firstParameterSelect_'+id).val();
    var startDate = $('[name= startDateInput_' + id + ']').val();
    var endDate = $('[name= endDateInput_' + id + ']').val();

    if(startDate=='' || endDate==''){
        document.getElementById('errorMessage_'+id).innerHTML = '*Fill all the fields';
    }else{
            if(moment(endDate).diff(moment(startDate), 'months', true) > 1){
                    document.getElementById('errorMessage_'+id).innerHTML = '*Date range must be 1 month maximum';
                }else{
                    //All accepted
                    document.getElementById('btnRetrieveRawData_'+id).innerHTML = `<div class="spinner-border" role="status">
                                                                                      <span class="sr-only">Loading...</span>
                                                                                    </div>`;
                    var startEpoch = moment(startDate, 'M/D/YYYY h:mm a').unix();
                    var endEpoch = moment(endDate, 'M/D/YYYY h:mm a').unix();
                    reservedStartEpoch = startEpoch;
                    reservedEndEpoch = endEpoch;
                    console.log('radio: '+chartParameter);
                    console.log('start: '+startDate+ ',   Epoch: '+startEpoch);
                    console.log('end: '+endDate+ ',  Epoch: '+ endEpoch);

                    ajaxRetrieveRawData(id, chartParameter, startEpoch, endEpoch);
                }
    }
}

function ajaxRetrieveRawData(id, parameter, startEpoch, endEpoch){
    var ajaxCounts = Object.keys(ajaxRequests).length;
        ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/retrieveChart/'+ id + '/' + parameter + '/' + startEpoch + '/' + endEpoch + '/',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    async: true,
                    //data: "check",
                    success: function(dataGot){
                         document.getElementById('btnRetrieveRawData_'+id).innerHTML = "Raw Data";
                        var jsonObject = JSON.stringify(dataGot);
                        var csv = ConvertToCSV(jsonObject);
                        var blob = new Blob([csv], {type:"text/csv"});
                        saveAs(blob, 'rawdata.csv');
                    }

                });
}

function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
}
