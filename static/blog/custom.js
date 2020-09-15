

window.onload = function () {
    //Global variables
        window.ajaxRequests={};
        window.ajaxNodeProcess={};
        window.ajaxAlarmHistoryProcess={};
        window.nodeParameters={};

        //LCDs and charts
        window.lcd={};
        window.chartObject = {};

        //Node status
        window.nodeStatus = {};



    //console.log('requested');
    $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getUserNode/' + username + '/',
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

                    }
                }
            });

    //Alarm badge

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


}

//Update dashboard all nodes including their status
setInterval(function(){

    if(document.getElementById('section_Dashboard').style.display === 'block'){
        //Request Ajax
         $.ajax({
                type: "GET",
                url:'https://api.cl-ds.com/getUserNode/' + username + '/',
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

function requestAjax(id){
    var ajaxCounts = Object.keys(ajaxRequests).length;
    ajaxRequests[ajaxCounts] = $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardDataSetInterval/' + id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){

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
                                    var category= data[i].chart_prop[0].category;
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
                    url: 'https://api.cl-ds.com/getAlarmHistory/' + id + '/?format=json',
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
                            var nodeID = document.getElementsByClassName(data[0].serial);
                            var spinnerNode = document.getElementById('spinnerAlarmHistory_'+ nodeID[0].id);
                            spinnerNode.classList.remove('lds-roller');

                            //Store loaded in object
                            ajaxAlarmHistoryProcess[nodeID[0].id] = true;


                            //Append Table Rows
                            var alarmHistoryTable = document.getElementById('alarmHistoryTable_' + nodeID[0].id).getElementsByTagName('tbody')[0];
                            for(var a=0; a<data.length; a++){
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

                                alarmTime.innerHTML=moment(data[a].alarm_datetime).format('h:mm a, DD-MMM-YYYY');
                                serial.innerHTML=data[a].serial;
                                parameter.innerHTML=data[a].parameter;
                                value.innerHTML=data[a].value;
                                lower_lim.innerHTML=data[a].limitLower;
                                upper_lim.innerHTML=data[a].limitUpper;
                                ackBy.innerHTML=data[a].user_removal;
                                ackTime.innerHTML=moment(data[a].remove_datetime).format('h:mm a, DD-MMM-YYYY');

                            }
                        }



                    }
                });
    }


}

function loadChartsLink(id){
    var spinnerNode = document.getElementById('spinnerRetrieveCharts_'+id);
        spinnerNode.classList.remove('lds-roller');
    var data = nodeParameters[id];
    var parentForm = document.getElementById('chartParameters_'+id);

    //Delete first all parameters
     while (parentForm.firstChild) {
            parentForm.removeChild(parentForm.lastChild);
          }
    //Create new ones
    for(var i=0; i< data.length;i++){
        var child1 = document.createElement('div');
        var child2 = document.createElement('label');
        var child3 = document.createElement('input');

        child1.className ='form-check-inline';
        child2.className ='form-check-label';
        if(i==0){
                if(data[i].chart_title == null){
                if(data[i].chart_prop.length == 0){
                    child2.innerHTML = "<input type='radio' class='form-check-input' checked name='chartParameter' value='" + data[i].parameter +"'>" + data[i].parameter;
                }else{
                    child2.innerHTML = "<input type='radio' class='form-check-input' checked name='chartParameter' value='" + data[i].parameter +"'>" + data[i].chart_prop[0].label;
                }

            }else{
                child2.innerHTML = "<input type='radio' class='form-check-input' checked name='chartParameter' value='" + data[i].parameter +"'>" + data[i].chart_title;
            }
        }else{
                if(data[i].chart_title == null){
                if(data[i].chart_prop.length == 0){
                    child2.innerHTML = "<input type='radio' class='form-check-input' name='chartParameter' value='" + data[i].parameter +"'>" + data[i].parameter;
                }else{
                    child2.innerHTML = "<input type='radio' class='form-check-input' name='chartParameter' value='" + data[i].parameter +"'>" + data[i].chart_prop[0].label;
                }

            }else{
                child2.innerHTML = "<input type='radio' class='form-check-input' name='chartParameter' value='" + data[i].parameter +"'>" + data[i].chart_title;
            }
        }


        //child3.type='radio';
        //child3.class='form-check-input';
        //child3.name=data[i].parameter;
        //child3.innerHTML=data[i].parameter;

        //child2.appendChild(child3);
        child1.appendChild(child2);

        parentForm.appendChild(child1);
    }

    //init input fields
    $(function () {
                //$('#startDateChart_'+id).datetimepicker();
                //$('#endDateChart_'+id).datetimepicker();
                 $('#startChartDate_'+id).datetimepicker({

                    sideBySide: true,
                    ignoreReadonly: true
                 });
                 $('#endChartDate_'+id).datetimepicker({
                    sideBySide: true,
                    ignoreReadonly: true
                 });
            });


}

function retrieveChart(id){
    document.getElementById('errorMessage_'+id).innerHTML = '';


    var idForm = '#chartForm_'+id + ' [name=chartParameter]';
    var radio = $(idForm);

    for(var i=0; i< radio.length; i++){
        if(radio[i].checked){
            var chartParameter = radio[i].value;

        }
    }
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

                    console.log('radio: '+chartParameter);
                    console.log('start: '+startDate+ ',   Epoch: '+startEpoch);
                    console.log('end: '+endDate+ ',  Epoch: '+ endEpoch);

                    ajaxRetrieveChart(id, chartParameter, startEpoch, endEpoch);
                }
    }




}

function ajaxRetrieveChart(id, parameter, startEpoch, endEpoch){

    //Clear old canvas
    var canvas = document.getElementById('canvasWrapper_'+id);
    canvas.innerHTML = '&nbsp;';
    $('#canvasWrapper_'+id).append('<canvas id="retrievedChart_' + id +'" ><canvas>');

    var ajaxCounts = Object.keys(ajaxRequests).length;
        ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/retrieveChart/'+ id + '/' + parameter + '/' + startEpoch + '/' + endEpoch + '/',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    async: true,
                    //data: "check",
                    success: function(dataGot){
                        var spinnerNode = document.getElementById('spinnerRetrieveCharts_'+id);
                        spinnerNode.classList.remove('lds-roller');
                        console.log(dataGot);

                        //Chart append
                        var labels = dataGot.map(function(e) {
                               return moment(e.datetime).format('MM/DD/YYYY h:mm:ss a');
                            });
                            var data = dataGot.map(function(e) {
                               return e.data;
                            });;

                        var ctx = 'retrievedChart_'+id;
                        var config = {
                           type: 'line',
                           data: {
                              labels: labels,
                              datasets: [{
                                 label: dataGot[1].serial,
                                 data: data,
                                 fill: false,
                                 lineTension: 0.5,
                                 pointRadius: 0,
                                 borderColor: "#5f76e8",
                                 backgroundColor: 'rgba(0, 119, 204, 0.3)'
                              }]
                           },
                           options:{
                                scales:{
                                    xAxes: [{
                                        type:'time',
                                        distribution: 'linear',
                                        offset: false,
                                        ticks: {
                                            major:{
                                                enabled: true,
                                                fontStyle: 'bold'
                                            },
                                            source: 'auto',
                                            autoSkip: true,
                                            autoSkipPadding: 50,
                                            maxRotation: 0,
                                            sampleSize: 100
                                        }
                                    }],
                                    yAxes: [{
                                        gridLines: {
                                            drawBorder: false
                                        },
                                        scaleLabel:{
                                            display:true,
                                            labelString: 'Data Retrieved'
                                        }
                                    }]
                                }
                           }
                        };

                        var chart = new Chart(ctx, config);
                    }
                });
}
