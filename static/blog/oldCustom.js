function old(){
    //initLCD();
        var dataGot;

        var nodes = document.getElementsByClassName("node");
        var leds = document.getElementsByClassName("leds");
        window.ajaxRequests={};
        window.ajaxNodeProcess={};
        window.ajaxAlarmHistoryProcess={};
        window.nodeParameters={};

        //LCDs and charts
        window.lcd={};
        window.chartObject = {};

        //Status to not 'data not ready'
        for(var i=0; i< nodes.length; i++){
            ajaxNodeProcess[nodes[i].id] = false;
            ajaxAlarmHistoryProcess[nodes[i].id] = false;
        }

        for(var i=0; i < nodes.length; i++){

            //console.log('request for  '+ nodes[i].id);
            var ajaxCounts = Object.keys(ajaxRequests).length;
            ajaxRequests[ajaxCounts] = $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardDataSet/' + nodes[i].id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){

                    //console.log('success for  '+ data[0].serial);
                    var nodeProcessed = document.getElementsByClassName(data[0].serial);
                    ajaxNodeProcess[nodeProcessed[0].id] = true;
                    console.log(data[0].serial + ':' + ajaxNodeProcess[nodeProcessed[0].id]);

                    //Remove spinner
                    var spinnerNode = document.getElementById('spinner_'+nodeProcessed[0].id);
                    spinnerNode.classList.remove('lds-roller');

                    //store node parameters
                    nodeParameters[nodeProcessed[0].id] = data;
                    console.log(nodeParameters);
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
                                }else {
                                    if(data[i].chart_prop[0].unit == null){var unit = '';}else{var unit = data[i].chart_prop[0].unit;}
                                    var label= data[i].chart_prop[0].label;
                                    var category= data[i].chart_prop[0].category;
                                }
                          var lcdId = 'lcd_'+data[i].id;
                          //width of the lcd
                          if(label.length > 13){var width = 120 + ((label.length - 13)*9); }else{ var width =120;}

                          lcd[lcdId] = new steelseries.DisplaySingle(lcdId, {
                            width: width,
                            height: 50,
                            unitString: unit,
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: label,
                            autoScroll: true
                            });

                          setLastValue(lcd[lcdId], parseFloat(data[i].data[19][data[i].parameter]));

                          var dataInsertArray = [data[i].data[1][data[i].parameter], data[i].data[3][data[i].parameter],
                                        data[i].data[5][data[i].parameter], data[i].data[7][data[i].parameter],
                                        data[i].data[9][data[i].parameter], data[i].data[11][data[i].parameter],
                                        data[i].data[13][data[i].parameter], data[i].data[15][data[i].parameter],
                                        data[i].data[17][data[i].parameter], data[i].data[19][data[i].parameter]]

                            var max = Math.max.apply(this, dataInsertArray);
                            var min = Math.min.apply(this, dataInsertArray);

                            if(max < 0){
                                max = max-(max*0.10);
                            }else{max = max+(max*0.10);}

                            if(min < 0){
                                min = min+(min*0.10);
                            }else{
                                min = min-(min*0.10);
                            }


                            //max=Number(max).toFixed();
                            //min=Number(min).toFixed();
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
                                                        },
                                                scaleLabel: {
                                                    display:true,
                                                    labelString: label + '(' + unit + ')'
                                                        }
                                                }]

                                            }
                            };

                           chartDataSet[i]= {
                                    labels: [moment(data[i].data[1].datetime).format('h:mm a'),
                                     moment(data[i].data[3].datetime).format('h:mm a'),
                                      moment(data[i].data[5].datetime).format('h:mm a'),
                                      moment(data[i].data[7].datetime).format('h:mm a'),
                                      moment(data[i].data[9].datetime).format('h:mm a'),
                                      moment(data[i].data[11].datetime).format('h:mm a'),
                                      moment(data[i].data[13].datetime).format('h:mm a'),
                                      moment(data[i].data[15].datetime).format('h:mm a'),
                                      moment(data[i].data[17].datetime).format('h:mm a'),
                                      moment(data[i].data[19].datetime).format('h:mm a')],
                                    datasets:[{
                                        label: data[i].parameter,
                                        data: [data[i].data[1][data[i].parameter], data[i].data[3][data[i].parameter],
                                        data[i].data[5][data[i].parameter], data[i].data[7][data[i].parameter],
                                        data[i].data[9][data[i].parameter], data[i].data[11][data[i].parameter],
                                        data[i].data[13][data[i].parameter], data[i].data[15][data[i].parameter],
                                        data[i].data[17][data[i].parameter], data[i].data[19][data[i].parameter]],
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

                                //Last update text:
                                $('#lastUpdate_'+data[i].serial).text('Last update: ' + moment(data[i].data[19].datetime).calendar());

                        }






                }

            });

            //Request Alarm
            var alarmSection = document.getElementById('alarm_'+nodes[i].id);

            //Check permission
            if (typeof(alarmSection) != 'undefined' && alarmSection != null){
                var ajaxCounts = Object.keys(ajaxRequests).length;
                    ajaxRequests[ajaxCounts] = $.ajax({
                    type: "GET",
                    url: 'https://api.cl-ds.com/getAlarm/' + nodes[i].id + '/?format=json',
                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                    //data: "check",
                    success: function(data_alarm){

                        if(data_alarm.length == 0){


                        }else{
                            //To get ID
                        var nodeProcessed = document.getElementsByClassName(data_alarm[0].serial);
                        var alarmTable = document.getElementById('alarmTable_' + nodeProcessed[0].id).getElementsByTagName('tbody')[0];
                        //Delete rows if exists
                        for(var i = alarmTable.rows.length - 1; i >= 0; i--)
                        {
                            alarmTable.deleteRow(i);
                        }
                        for(var a=0; a<data_alarm.length; a++){
                            var newRow   = alarmTable.insertRow(a);

                            // Insert a cell in the row at index 0
                            var serial  = newRow.insertCell(0);
                            var parameter  = newRow.insertCell(1);
                            var date  = newRow.insertCell(2);
                            var value  = newRow.insertCell(3);
                            var lower_lim  = newRow.insertCell(4);
                            var upper_lim  = newRow.insertCell(5);
                            var remove  = newRow.insertCell(6);
                            console.log('inserted Alarm');
                            serial.innerHTML=data_alarm[a].serial;
                            parameter.innerHTML=data_alarm[a].parameter;
                            date.innerHTML=data_alarm[a].datetime;
                            value.innerHTML=data_alarm[a].value;
                            lower_lim.innerHTML=data_alarm[a].limitLower;
                            upper_lim.innerHTML=data_alarm[a].limitUpper;

                            var rmvBtn= document.createElement('button');
                            rmvBtn.id = data_alarm[a].id;
                            rmvBtn.className = 'btn btn-primary';
                            rmvBtn.innerHTML = 'Remove';
                            remove.appendChild(rmvBtn);




                        }

                        }
                    }
                });
            }



        }



}
