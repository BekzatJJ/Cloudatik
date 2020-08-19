function createNodeCards(data){
    var list = document.getElementById('nodesList');
    var secondLayer = document.getElementById('secondLayer');

    //Remove previos children
        list.innerHTML='';
        secondLayer.innerHTML='';

    //Check permissions on alarm
    if(data.alarm == true){
        var htmlAlarm = `<a href="#" class="float-right mr-3" data-toggle="popover" data-placement="bottom" data-content="Alarm History"><i data-feather="clock" class="feather-icon"></i></a>`;
    }else{
        var htmlAlarm = ``;
    }

    //Nodes List
    for(var i=0; i<data.node.length; i++){
        if(data.node[i].remote == true){
            var htmlRemoteCtrl = `<a href="#" class="float-right mr-3" data-toggle="popover" data-placement="bottom" data-content="Remote Control"><i data-feather="sliders" class="feather-icon"></i></a>`;
        }else{
            var htmlRemoteCtrl = ``;
        }

        var htmlNode = `<div id="${data.node[i].device_id}" class="card border-success mb-3 node ${data.node[i].serial}" style="">
                  <div class="card-header bg-transparent border-success first" onclick="section_node(this)"> ${data.node[i].tag} <br> <p style="font-size:11px; color: black; margin-top:1px; margin-bottom:0;"> ${data.node[i].serial}</p></div>
                  <div class="card-body text-dark float-right">
                    <canvas id="canvasLed_${data.node[i].serial}" class="leds" width="25" height="25"></canvas>
                    <a href="" class="float-right mr-1" data-toggle="popover" data-placement="bottom" data-content="Node Configurations"><i data-feather="settings" class="feather-icon"></i></a>`+
                    htmlAlarm +
                    `<a href="#" class="float-right mr-3" data-toggle="popover" data-placement="bottom" data-content="Charts"><i data-feather="bar-chart-2" class="feather-icon"></i></a>`+
                    htmlRemoteCtrl+
                  `</div>
                </div>`;

                //Append
        list.innerHTML += htmlNode;
        feather.replace();
    }



    //Nodes Section
    for(var i=0; i<data.node.length; i++){

        //Permissions for alarm, raw_data, remote_ctrl
        //alarm and raw data
        if((data.alarm) && (data.raw_data)){
            var htmlAlarmHistoryLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'alarmHistory'); loadAlarmHistoryLink('${data.node[i].device_id}');" class="nav-item">
                                            <a class="nav-link" href="#">Alarm History</a>
                                        </li>`;
            var htmlRawDataLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'rawData')" class="nav-item">
                                        <a class="nav-link" href="#">Raw Data</a>
                                    </li>`;

            var htmlNewAlarm = `<div id="alarm_${data.node[i].device_id}" class="container" style="width:100%; margin-top:70px; overflow-x:auto; ">
                                  <h1>New Alarm</h1>
                                  <table id="alarmTable_${data.node[i].device_id}" class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">Serial</th>
                                        <th scope="col">Parameter</th>
                                        <th scope="col">Date & Time</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">Lower Limit</th>
                                        <th scope="col">Upper Limit</th>
                                        <th scope="col">Remove</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                  </table>
                              </div>`;
            var htmlAlarmHistorySection = `<section id="section_${data.node[i].device_id}_alarmHistory" class="sectionNodeLinks" style="display:none;">
                                                <div id="alarmHistory_${data.node[i].device_id}" class="container" style="width:100%; margin-top:10px; overflow-x:auto;">
                                                      <h1>Alarm History</h1>
                                                      <table id="alarmHistoryTable_${data.node[i].device_id}" class="table">
                                                        <thead>
                                                          <tr>
                                                            <th scope="col">Alarm Time</th>
                                                            <th scope="col">Serial</th>
                                                            <th scope="col">Parameter</th>
                                                            <th scope="col">Value</th>
                                                            <th scope="col">Lower Limit</th>
                                                            <th scope="col">Upper Limit</th>
                                                            <th scope="col">Acknowledged By</th>
                                                            <th scope="col">Acknowledged Time</th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                      </table>
                                                      <div id="spinnerAlarmHistory_${data.node[i].device_id}" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                                  </div>
                                            </section>`;
            var htmlRawDataSection = `<section id="section_${data.node[i].device_id}_rawData" class="sectionNodeLinks" style="display:none;">
                                        <h1>rawData</h1>
                                    </section>`;
        }else if(data.alarm){
            var htmlAlarmHistoryLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'alarmHistory'); loadAlarmHistoryLink('${data.node[i].device_id}');" class="nav-item">
                                            <a class="nav-link" href="#">Alarm History</a>
                                        </li>`;
            var htmlRawDataLink = ``;

            var htmlNewAlarm = `<div id="alarm_${data.node[i].device_id}" class="container" style="width:100%; margin-top:70px; overflow-x:auto;">
                                  <h1>New Alarm</h1>
                                  <table id="alarmTable_${data.node[i].device_id}" class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">Serial</th>
                                        <th scope="col">Parameter</th>
                                        <th scope="col">Date & Time</th>
                                        <th scope="col">Value</th>
                                        <th scope="col">Lower Limit</th>
                                        <th scope="col">Upper Limit</th>
                                        <th scope="col">Remove</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                  </table>
                              </div>`;

            var htmlAlarmHistorySection = `<section id="section_${data.node[i].device_id}_alarmHistory" class="sectionNodeLinks" style="display:none;">
                                                <div id="alarmHistory_${data.node[i].device_id}" class="container" style="width:100%; margin-top:10px; overflow-x:auto;">
                                                      <h1>Alarm History</h1>
                                                      <table id="alarmHistoryTable_${data.node[i].device_id}" class="table">
                                                        <thead>
                                                          <tr>
                                                            <th scope="col">Alarm Time</th>
                                                            <th scope="col">Serial</th>
                                                            <th scope="col">Parameter</th>
                                                            <th scope="col">Value</th>
                                                            <th scope="col">Lower Limit</th>
                                                            <th scope="col">Upper Limit</th>
                                                            <th scope="col">Acknowledged By</th>
                                                            <th scope="col">Acknowledged Time</th>
                                                          </tr>
                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                      </table>
                                                      <div id="spinnerAlarmHistory_${data.node[i].device_id}" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                                  </div>
                                            </section>`;;
            var htmlRawDataSection = ``;
        }else if(data.raw_data){
            var htmlAlarmHistoryLink = ``;
            var htmlRawDataLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'rawData')" class="nav-item">
                                        <a class="nav-link" href="#">Raw Data</a>
                                    </li>`

            var htmlNewAlarm = ``;
            var htmlAlarmHistorySection = ``;
            var htmlRawDataSection = `<section id="section_${data.node[i].device_id}_rawData" class="sectionNodeLinks" style="display:none;">
                                        <h1>rawData</h1>
                                    </section>`;
        }else{
            var htmlAlarmHistoryLink = ``;
            var htmlRawDataLink = ``;

            var htmlNewAlarm = ``;
            var htmlAlarmHistorySection = ``;
            var htmlRawDataSection = ``;
        }

        //Remote ctrl permission
         if(data.node[i].remote){
            var htmlRemoteCtrlLink = `<li class="nav-item ">
                                        <a class="nav-link" href="#">Remote Control</a>
                                    </li>`;
         }else{
             var htmlRemoteCtrlLink = ``;
         }


        var htmlSection = `<section id="section_${data.node[i].device_id}" class="sectionNode" style="display:none;">
            <div class="page-breadcrumb">
                <div class="row">
                    <div class="col-7 align-self-center">
                        <h3 class="page-title text-truncate text-dark font-weight-medium mb-1">Good Morning!</h3>
                        <div class="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb m-0 p-0">
                                    <li class="breadcrumb-item" onClick="section_dashboard()"><a href="#" class="zero">Dashboard</a>
                                    </li>
                                    <li class="breadcrumb-item active " aria-current="page"><a href="#" class="first">${data.node[i].serial}</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div class="col-5 align-self-center">
                        <div class="customize-input float-right">
                            <div class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius">Jul 07</div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="container-fluid first-section" style="margin-top: 15px;">
              <div class="d-flex flex-row justify-content-between">


                <div class="">
                  <nav class="navbar navbar-expand-lg navbar-light float-right" style="margin-bottom:25px;">

                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav" id="nodeLinks_${data.node[i].device_id}">`+
                         htmlRemoteCtrlLink +
                        `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'charts'); loadChartsLink('${data.node[i].device_id}');" class="nav-item">
                            <a class="nav-link" href="#">Retrieve Charts</a>
                        </li>`+
                        htmlRawDataLink+
                        htmlAlarmHistoryLink +

                      `<li class="nav-item">
                        <a class="nav-link" href="/configurations/${data.node[i].device_id}">Configurations</a>
                      </li>
                    </ul>
                  </div>
                </nav>
                </div>

                <div class="blabla ">
                  <nav class="navbar navbar-expand-lg navbar-light float-right" style="margin-bottom:25px;">
                  <div class="" id="navbarStatus">
                    <ul class="navbar-nav">
                      <li class="nav-item ">
                        <a class="nav-link"><canvas id="dashboardLed_${data.node[i].serial}" class="leds" width="25" height="25"></canvas></a>
                      </li>
                      <li class="nav-item">
                        <p class="nav-link" id="lastUpdate_${ data.node[i].serial }" style="color: black; font-size: 15px; font-weight: 100;">Last update: </p>
                      </li>
                    </ul>
                  </div>
                </nav>
                </div>

              </div>

            <section id="section_${data.node[i].device_id}_dashboard" class="nodeDash">
              <div id="spinner_${data.node[i].device_id}" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <div id="${data.node[i].serial}-parameters" class="container parameters" style="">


              </div>`+

              htmlNewAlarm+



            `</section>`+

            htmlAlarmHistorySection+

            htmlRawDataSection+



            `<section id="section_${data.node[i].device_id}_charts" class="sectionNodeLinks" style="display:none;">
              <div class="wrapperForCharts" style="">
                <div id="chartController_${data.node[i].device_id}" style="margin: 0 auto; width:80%;">
                  <form id="chartForm_${data.node[i].device_id}">
                    <h5>Chart title:</h5>
                    <div id="chartParameters_${data.node[i].device_id}" style="margin-bottom: 20px; margin-left: 30px;">

                    </div>

                    <div id="chartInputs" style="display: flex">
                      <div class="container">
                            <div class="row">
                              <div class="col-sm-6">
                                <label for="startDate">Start Date</label>
                              </div>
                            </div>
                            <div class="row">
                                <div class='col-sm-6'>
                                    <div class="form-group">
                                        <div class='input-group date' id='startChartDate_${data.node[i].device_id}'>

                                            <input type='text' name="startDateInput_${data.node[i].device_id}" class="form-control" />
                                            <span class="input-group-addon">
                                                <span class="glyphicon glyphicon-calendar"></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                      </div>

                      <div class="container">
                            <div class="row">
                              <div class="col-sm-6">
                                <label for="endDate">End Date</label>
                              </div>
                            </div>
                            <div class="row">
                                <div class='col-sm-6'>
                                    <div class="form-group">
                                        <div class='input-group date' id='endChartDate_${data.node[i].device_id}'>

                                            <input type='text' name="endDateInput_${data.node[i].device_id}" class="form-control" />
                                            <span class="input-group-addon">
                                                <span class="glyphicon glyphicon-calendar"></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>



                      <div class="form-check" style="display: flex;">
                        <button type="button" id="btnRetrieveChart_${data.node[i].device_id}" onclick="retrieveChart('${data.node[i].device_id}')" class="btn btn-primary" style="margin-top:5px;">Retrieve</button>
                        <p id="errorMessage_${data.node[i].device_id}"style="color:red; font-size:13px; margin:5px; "></p>
                      </div>
                    </div>



                  </form>
                </div>

                <div style="flex:1;" >
                  <div id="spinnerRetrieveCharts_${data.node[i].device_id}" class=""><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  <div id="canvasWrapper_${data.node[i].device_id}">
                    <canvas id="retrievedChart_${data.node[i].device_id}"></canvas>
                  </div>

                </div>
              </div>




            </section>



            </div>


</section>`;


        secondLayer.innerHTML += htmlSection;

    }

    //Status and LED initialize
    for(var i=0; i< data.node.length; i++){

    if(moment(data.node[i].last_update).format() < moment().subtract(10,'minutes').format()){
       setLED('canvasLed_'+ data.node[i].serial, false);
       setLED('dashboardLed_'+ data.node[i].serial, false);
    }else{
       setLED('canvasLed_'+ data.node[i].serial, true);
       setLED('dashboardLed_'+ data.node[i].serial, true);
    }
  }

    //False for loaded nodes object //Status to not 'data not ready'
        for(var i=0; i< data.node.length; i++){
            ajaxNodeProcess[data.node[i].device_id] = false;
            ajaxAlarmHistoryProcess[data.node[i].device_id] = false;
        }



}
