function createNodeCards(data){
    var list = document.getElementById('nodesList');
    var secondLayer = document.getElementById('secondLayer');
    window.permission = {
      alarm: data.permission.alarm,
      map: data.permission.map,
      raw_data: data.permission.raw_data
    };
    //Remove previos children
        list.innerHTML='';
        secondLayer.innerHTML='';

    //Check permissions on alarm
    if(data.permission.alarm == true){
        var htmlAlarm = `<a href="#" class="float-right mr-3 alarmHistoryDashLink" data-toggle="popover" data-placement="bottom" data-content="Alarm History"><i data-feather="clock" class="feather-icon"></i></a>`;
        var htmlAlarmMobile = `<a href="#" class="float-right alarmHistoryDashLinkMobile dropdown-item">Alarm History</a>`;
    }else{
        var htmlAlarm = ``;
        var htmlAlarmMobile = ``;
    }


    //sorting
    data.node.sort(function (a,b){
      var serialA = a.serial.toLowerCase(), serialB = b.serial.toLowerCase();
      if(serialA < serialB)
        return -1
      if(serialA > serialB)
        return 1
      return 0
    });
    console.log(data);

    //Nodes List
    for(var i=0; i<data.node.length; i++){
        if(data.node[i].remote == true){
            var htmlRemoteCtrl = `<a href="#" class="float-right mr-3 remoteDashLink" data-toggle="popover" data-placement="bottom" data-content="Remote Control"><i data-feather="sliders" class="feather-icon"></i></a>`;
            var htmlRemoteCtrlMobile = `<a href="#" class="float-right dropdown-item remoteDashLinkMobile">Remote Control</a>`;

        }else{
            var htmlRemoteCtrl = ``;
            var htmlRemoteCtrlMobile = ``;
        }

        var htmlNode = `<div id="${data.node[i].device_id}" class="card border-success mb-3 node ${data.node[i].serial}_${data.node[i].sensor_set}"  style="" data-priority="${data.node[i].serial}${data.node[i].sensor_set}">
                  <div class="card-header bg-transparent border-success first" onclick="section_node(this)"> ${data.node[i].tag_name} <br> <p style="font-size:11px; color: black; margin-top:1px; margin-bottom:0;"> ${data.node[i].serial}-${data.node[i].sensor_set}</p></div>
                  <div class="card-body text-dark float-right" style="padding:12px !important; background-color: #e8e6e6 !important;">
                    <a href="#" id="canvasLedParent_${data.node[i].serial}_${data.node[i].sensor_set}" class="" data-toggle="popover" data-placement="bottom" data-content=""><canvas id="canvasLed_${data.node[i].serial}_${data.node[i].sensor_set}" class="leds" width="25" height="25"></canvas></a>

                    <div class="mainDashLinksDesktop">
                    <a href="#" class="float-right mr-1 nodeConfigDashLink" data-toggle="popover" data-placement="bottom" data-content="Node Configurations"><i data-feather="settings" class="feather-icon"></i></a>`+
                    htmlAlarm +
                    `<a href="#" class="float-right mr-3 chartDashLink" data-toggle="popover" data-placement="bottom" data-content="Charts"><i data-feather="bar-chart-2" class="feather-icon"></i></a>`+
                    htmlRemoteCtrl+
                    `</div>

                    <div class="mainDashLinksMobile">
                      <div class="dropdown-toggle threeDotsToggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="ti-more-alt"></i>
                      </div>
                      <div class="dropdown-menu">
                        <a href="#" class="float-right  nodeConfigDashLinkMobile dropdown-item">Configurations</a>`+
                        htmlAlarmMobile +
                        `<a href="#" class="float-right  chartDashLinkMobile dropdown-item">Charts</a>`+
                        htmlRemoteCtrlMobile+

                      `</div>
                    </div>



                  </div>
                </div>`;

                //Append
        list.innerHTML += htmlNode;
        feather.replace();

    }

    list.innerHTML += `<div id="addNode" class="card border-success mb-3" style="">
                  <div class="card-body text-dark float-right" onclick="permissions();" style="cursor:pointer; text-align:center; border:1px dashed #7c8798; padding-top:25px !important;">
                  <span style="vertical-align: middle;">Add New Node</span>
                  <i class="fas fa-plus fa-2x" style="display:block;"></i>
                  </div>
                </div>`;

                $('[data-toggle="popover"]').popover({trigger:'hover'});

//Map sections
        if(data.permission.map){
          var htmlMap = `<div class="page-breadcrumb">
                              <div class="row">
                                  <div class="col-7 align-self-center">
                                      <h3 id="salutation" class="page-title text-truncate text-dark font-weight-medium mb-1 salutation"></h3>
                                      <div class="d-flex align-items-center">
                                          <nav aria-label="breadcrumb">
                                              <ol class="breadcrumb m-0 p-0">
                                                  <li class="breadcrumb-item active" onClick="section_dashboard()" aria-current="page"><a href="#">Dashboard</a>
                                                  </li>
                                              </ol>
                                          </nav>
                                      </div>
                                  </div>
                                  <div class="col-5 align-self-center">
                                      <div class="customize-input float-right">
                                          <div id="currentDate" class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius dateBadge"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                <div class="container-fluid map-content">
                           <div class="row" style="margin-bottom: 10px; margin-top:10px;">
                              <div class="col-md-12 text-center">
                                <div class="btn-group" role="group" aria-label="DashLayout">
                                  <button  onclick="dashLayout();" type="button" class="btn btn-secondary">Grid</button>
                                  <button  onclick="mapClickEvent();" type="button" style="color:black;" class="btn btn-secondary">Map</button>
                                </div>
                              </div>
                            </div>

                            <div id="mapSpinner" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                             <div id="mapWrapper"  style="display:block;">

                             </div>
                </div>`;


        }else{
          var htmlMap = `<div class="page-breadcrumb">
                              <div class="row">
                                  <div class="col-7 align-self-center">
                                      <h3 id="salutation" class="page-title text-truncate text-dark font-weight-medium mb-1 salutation"></h3>
                                      <div class="d-flex align-items-center">
                                          <nav aria-label="breadcrumb">
                                              <ol class="breadcrumb m-0 p-0">
                                                  <li class="breadcrumb-item active" onClick="section_dashboard()" aria-current="page"><a href="#">Dashboard</a>
                                                  </li>
                                              </ol>
                                          </nav>
                                      </div>
                                  </div>
                                  <div class="col-5 align-self-center">
                                      <div class="customize-input float-right">
                                          <div id="currentDate" class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius dateBadge"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                <div class="container-fluid map-content">
                           <div class="row" style="margin-bottom: 10px; margin-top:10px;">
                              <div class="col-md-12 text-center">
                                <div class="btn-group" role="group" aria-label="DashLayout">
                                  <button  onclick="dashLayout();" type="button" class="btn btn-secondary">Grid</button>
                                  <button  onclick="mapClickEvent();" type="button" style="color:black;" class="btn btn-secondary">Map</button>
                                </div>
                              </div>
                            </div>

                            <span style="text-align: center; color: black;">This feature is not activated!</span>
                </div>`;
        }

        document.getElementById('map-content').innerHTML = htmlMap; //Map render

    console.log(data);



    //Nodes Section
    for(var i=0; i<data.node.length; i++){

        //Permissions for alarm, raw_data, remote_ctrl
        //alarm and raw data
        if((data.permission.alarm) && (data.permission.raw_data)){
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

                                        <th scope="col">Parameter</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
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
            var htmlRawDataButton = `<button type="button" id="btnRetrieveRawData_${data.node[i].device_id}" onclick="retrieveRawData('${data.node[i].device_id}')" class="btn btn-primary" style="margin-top:5px;">Raw Data</button>`;
        }else if(data.permission.alarm){
            var htmlAlarmHistoryLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'alarmHistory'); loadAlarmHistoryLink('${data.node[i].device_id}');" class="nav-item">
                                            <a class="nav-link" href="#">Alarm History</a>
                                        </li>`;
            var htmlRawDataLink = ``;

            var htmlNewAlarm = `<div id="alarm_${data.node[i].device_id}" class="container" style="width:100%; margin-top:70px; overflow-x:auto;">
                                  <h1>New Alarm</h1>
                                  <table id="alarmTable_${data.node[i].device_id}" class="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">Parameter</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
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
            var htmlRawDataButton = ``;
        }else if(data.permission.raw_data){
            var htmlAlarmHistoryLink = ``;
            var htmlRawDataLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'rawData')" class="nav-item">
                                        <a class="nav-link" href="#">Raw Data</a>
                                    </li>`

            var htmlNewAlarm = ``;
            var htmlAlarmHistorySection = ``;
            var htmlRawDataSection = `<section id="section_${data.node[i].device_id}_rawData" class="sectionNodeLinks" style="display:none;">
                                        <h1>rawData</h1>
                                    </section>`;
            var htmlRawDataButton = `<button type="button" id="btnRetrieveRawData_${data.node[i].device_id}" onclick="retrieveRawData('${data.node[i].device_id}')" class="btn btn-primary" style="margin-top:5px;">Raw Data</button>`;
        }else{
            var htmlAlarmHistoryLink = ``;
            var htmlRawDataLink = ``;

            var htmlNewAlarm = ``;
            var htmlAlarmHistorySection = ``;
            var htmlRawDataSection = ``;
            var htmlRawDataButton = ``;
        }



        //Remote ctrl permission
         if(data.node[i].remote){
            var htmlRemoteCtrlLink = `<li onClick="sectionNodeLinks('${data.node[i].device_id}', 'remote')" class="nav-item">
                                        <a class="nav-link" href="#">Remote Control</a>
                                    </li>`;
            var htmlRemoteSection = `<section id="section_${data.node[i].device_id}_remote" class="sectionNodeLinks" style="display:none;">
                                      <div id="connectionAlert_${data.node[i].device_id}" class="connectionAlert">

                                      </div>

                                      <div id="${data.node[i].device_id}_control" class="container-fluid">
                                        <div class="card" style="display:block; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                                          <div id="remoteHeader_${data.node[i].device_id}" class="card-header" style="text-align:center;"></div>
                                          <div id="remoteSwitch_${data.node[i].device_id}" class="d-flex" style="justify-content: space-around;">
                                            <canvas id="canvasLed_${data.node[i].device_id}" width="100" height="100"></canvas>
                                            <div style="display: flex; align-items: center; justify-content: center;"><button id="switch-refresh-${data.node[i].device_id}" onclick="switchToggle();" class="btn btn-success"></button></div>

                                          </div>
                                          <hr>

                                          <div id="remoteSettings_${data.node[i].device_id}" style="display:grid;">
                                            <span style="text-align:center;">Settings</span>
                                              <div class="form-group row" style=" margin-top:20px;">
                                                <label for="remoteInterval" class="col-md-2 col-form-label">Interval(sec)</label>
                                                <div class="col-md-6">
                                                  <input class="form-control" type="text"  name="remoteInterval" placeholder="seconds">
                                                </div>
                                              </div>

                                              <div class="form-group row" style=" margin-top:20px;">
                                                <label for="modeBtn" class="col-md-2 col-form-label">Mode</label>
                                                <div class="col-md-6">
                                                  <select class="form-control" id="modeSelect_${data.node[i].device_id}" onChange="modeSelect()">
                                                    <option value="1">Remote</option>
                                                    <option value="2">Temperature and Humidity Threshold</option>
                                                    <option value="3">Temperature Threshold</option>
                                                    <option value="4">Humidity Threshold</option>
                                                  </select>

                                                </div>
                                              </div>

                                                <div class="collapse" id="tth-content_${data.node[i].device_id}">
                                                    <div class="form-group row" style=" margin-top:20px;">
                                                      <label for="slider-tth-t" class="col-md-2 col-form-label">Temperature</label>
                                                      <div style="margin-top:20px;" class="col-md-6">

                                                        <div  style="margin:13px;" id="slider-tth-t_${data.node[i].device_id}"></div>

                                                      </div>
                                                    </div>
                                                    <div class="form-group row" style=" margin-top:40px;">
                                                      <label for="slider-tth-h" class="col-md-2 col-form-label">Humidity</label>
                                                      <div style="margin-top:20px;" class="col-md-6">
                                                        <div style="margin:13px;" id="slider-tth-h_${data.node[i].device_id}"></div>
                                                      </div>
                                                    </div>
                                                </div>
                                                <div class="collapse" id="tt-content_${data.node[i].device_id}">
                                                    <div class="form-group row" style=" margin-top:20px;">
                                                      <label for="slider-tt" class="col-md-2 col-form-label">Temperature</label>
                                                      <div style="margin-top:20px;" class="col-md-6">
                                                        <div style="margin:13px;" id="slider-tt_${data.node[i].device_id}"></div>
                                                      </div>
                                                    </div>

                                                </div>
                                                <div class="collapse" id="th-content_${data.node[i].device_id}">
                                                    <div class="form-group row" style=" margin-top:20px;">
                                                      <label for="slider-th" class="col-md-2 col-form-label">Humidity</label>
                                                      <div style="margin-top:20px;" class="col-md-6">
                                                        <div style="margin:13px;" id="slider-th_${data.node[i].device_id}"></div>
                                                      </div>
                                                    </div>

                                                </div>

                                              <div class="form-group row" style="margin:auto; margin-top:20px; margin-bottom:20px;">
                                                <button onclick="writeSettings();" class="btn btn-success">Save Settings</button>
                                              </div>
                                          </div>
                                        </div>

                                      </div>
                                    </section>`;
         }else{
             var htmlRemoteCtrlLink = ``;
             var htmlRemoteSection = ``;
         }


        var htmlSection = `<section id="section_${data.node[i].device_id}" class="sectionNode" style="display:none;">
            <div class="page-breadcrumb">
                <div class="row">
                    <div class="col-7 align-self-center">
                        <h3 class="page-title text-truncate text-dark font-weight-medium mb-1 salutation"></h3>
                        <div class="d-flex align-items-center">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb m-0 p-0">
                                    <li class="breadcrumb-item" onClick="section_dashboard()"><a href="#" class="zero">Dashboard</a>
                                    </li>
                                    <li class="breadcrumb-item active " onClick="section_node_extra('${data.node[i].device_id}');" aria-current="page"><a href="#" class="first">${data.node[i].serial}</a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div class="col-5 align-self-center">
                        <div class="customize-input float-right">
                            <div class="custom-select custom-select-set form-control bg-white border-0 custom-shadow custom-radius dateBadge"></div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="first-section" style="margin-top: 15px;">
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
                        <a class="nav-link"><canvas id="dashboardLed_${data.node[i].serial}_${data.node[i].sensor_set}" class="leds" width="25" height="25"></canvas></a>
                      </li>
                      <li class="nav-item">
                        <p class="nav-link" id="lastUpdate_${ data.node[i].serial }_${data.node[i].sensor_set}" style="color: black; font-size: 15px; font-weight: 100;">Last update: </p>
                      </li>
                    </ul>
                  </div>
                </nav>
                </div>

              </div>

              <div class="tagName_justify">
              <h2>${data.node[i].tag_name}</h2>
              </div>

            <section id="section_${data.node[i].device_id}_dashboard" class="nodeDash">




              <div id="spinner_${data.node[i].device_id}" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              <div id="chartControl_${data.node[i].device_id}" style="display:none; float: right; margin: 10px;">
                <div class="btn-group">
                  <button style="color: black;" type="button" onclick="set12hrs();" class="chart-control chart-12 btn btn-secondary">12 Hours</button>
                  <button type="button" onclick="set1day();" class="chart-control chart-1 btn btn-secondary">1 Day</button>
                  <button type="button" onclick="set2day();" class="chart-control chart-2 btn btn-secondary">2 Days</button>
                  <button type="button" onclick="set3day();" class="chart-control chart-3 btn btn-secondary">3 Days</button>
                </div>
              </div>
              <div id="${data.node[i].serial}_${data.node[i].sensor_set}-parameters" class="container parameters" style="">


              </div>
              <div id="am_${data.node[i].device_id}" class="container" style="margin-top:30px;">

              </div>
              `+

              htmlNewAlarm+



            `</section>`+

            htmlAlarmHistorySection+


            htmlRemoteSection+


            `<section id="section_${data.node[i].device_id}_charts" class="sectionNodeLinks" style="display:none;">



              <div class="wrapperForCharts" style="">
                <div id="chartController_${data.node[i].device_id}" class="chartController">
                  <form id="chartForm_${data.node[i].device_id}">
                    <h5>Chart title:</h5>
                    <div id="spinnerParCharts_${data.node[i].device_id}" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    <div id="firstParameter_${data.node[i].device_id}">
                      <select class="form-control" id="firstParameterSelect_${data.node[i].device_id}">

                      </select>


                    </div>
                    <div id="chartParameters_${data.node[i].device_id}" style="display:none; margin-bottom: 20px; margin-left: 30px;">

                    </div>

                    <div id="chartInputs" class="chartInputs">
                      <div class="container">
                            <div class="row">
                              <div class="col-sm-6">
                                <label for="startDate">Start Date</label>
                              </div>
                            </div>
                            <div class="row">
                                <div class='col-sm-6'>
                                    <div class="form-group">
                                        <div class='input-group date' id='startChartDate_${data.node[i].device_id}' data-target-input="nearest">

                                            <input  type='text' readonly name="startDateInput_${data.node[i].device_id}" class="form-control datetimepicker-input" data-target="#startChartDate_${data.node[i].device_id}" />
                                            <div class="input-group-append" data-target="#startChartDate_${data.node[i].device_id}" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                            </div>
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
                                        <div class='input-group date' id='endChartDate_${data.node[i].device_id}'  data-target-input="nearest">

                                            <input readonly type='text' name="endDateInput_${data.node[i].device_id}" class="form-control" datetimepicker-input" data-target="#endChartDate_${data.node[i].device_id}"/>
                                            <div class="input-group-append" data-target="#endChartDate_${data.node[i].device_id}" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>



                      <div class="form-check" style="display: flex;">
                      <div id="controlButtons_${data.node[i].device_id}" style="padding:25px;">
                        <button type="button" id="btnRetrieveChart_${data.node[i].device_id}" onclick="retrieveChart('${data.node[i].device_id}')" class="btn btn-primary" style="margin-top:5px; margin-right:10px;">Chart</button>`+
                        `</div>
                        <button type="button" id="btnAddNewChart_${data.node[i].device_id}" onclick="addNewChart('${data.node[i].device_id}')" class="btn btn-primary" style="margin-top:5px; display:none;">Add New</button>
                        <button type="button" id="btnResetCharts_${data.node[i].device_id}" onclick="resetCharts('${data.node[i].device_id}')" class="btn btn-primary" style="margin-top:5px; display:none;">Reset</button>
                        <p id="errorMessage_${data.node[i].device_id}"style="color:red; font-size:13px; margin:5px; "></p>
                      </div>
                    </div>



                  </form>
                </div>

                <div style="flex:1;" >

                  <div id="spinnerRetrieveCharts_${data.node[i].device_id}" class=""><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  <div id="canvasWrapper_${data.node[i].device_id}" >

                  </div>

                </div>
              </div>




            </section>



            </div>


</section>`;


        secondLayer.innerHTML += htmlSection;

    }
    //collapse


    //Salute and dateBadge
            var salutation = document.getElementsByClassName('salutation');
            for(var i=0; i< salutation.length; i++){
                salutation[i].innerHTML = `Good ` + getGreetingTime(moment()) + '!';
            }
            var dateBadge = document.getElementsByClassName('dateBadge');
            for(var i=0; i< dateBadge.length; i++){
                dateBadge[i].innerHTML = moment().format('MMM DD');
            }

    //Status and LED initialize
    for(var i=0; i< data.node.length; i++){
      if(data.node[i].last_update == null){
        nodeStatus[data.node[i].device_id] = false;
        $('#lastUpdate_'+data.node[i].serial+'_'+data.node[i].sensor_set).text('Last update: ' + moment('2000-01-01T00:00:00').calendar());
         setLED('canvasLed_'+ data.node[i].serial+'_'+data.node[i].sensor_set, false);
         setLED('dashboardLed_'+ data.node[i].serial+'_'+data.node[i].sensor_set, false);
         var popContent = 'Last update: '+ moment('2000-01-01T00:00:00').fromNow();
          $('a#canvasLedParent_'+data.node[i].serial+'_'+data.node[i].sensor_set).attr("data-content", popContent);
      }else{
            if(moment(data.node[i].last_update).add(8, 'hours').format() < moment().subtract(10,'minutes').format()){
              nodeStatus[data.node[i].device_id] = false;
            $('#lastUpdate_'+data.node[i].serial+'_'+data.node[i].sensor_set).text('Last update: ' + moment(data.node[i].last_update).add(8, 'hours').calendar());
             setLED('canvasLed_'+ data.node[i].serial+'_'+data.node[i].sensor_set, false);
             setLED('dashboardLed_'+ data.node[i].serial+'_'+data.node[i].sensor_set, false);
          }else{
            nodeStatus[data.node[i].device_id] = true;
            $('#lastUpdate_'+data.node[i].serial+'_'+data.node[i].sensor_set).text('Last update: ' + moment(data.node[i].last_update).add(8, 'hours').calendar());
             setLED('canvasLed_'+ data.node[i].serial+'_'+data.node[i].sensor_set, true);
             setLED('dashboardLed_'+ data.node[i].serial+'_'+data.node[i].sensor_set, true);
          }

          var popContent = 'Last update: '+ moment(data.node[i].last_update).add(8, 'hours').fromNow();
          $('a#canvasLedParent_'+data.node[i].serial+'_'+data.node[i].sensor_set).attr("data-content", popContent);
      }



  }

    //False for loaded nodes object //Status to not 'data not ready'
        for(var i=0; i< data.node.length; i++){
            ajaxNodeProcess[data.node[i].device_id] = false;
            ajaxAlarmHistoryProcess[data.node[i].device_id] = false;
        }



    //Dash link listeners

                //Config
            $('.nodeConfigDashLink').on('click' ,function(){

                var id = $(this).parents().eq(2).attr('id');
                window.location = "/configurations/" + id ;
            });

            //Charts
            $('.chartDashLink').on('click' ,function(){

                var elem = $(this).parents().eq(1).prev();
                loadChartsLink(elem[0].parentNode.id);
                sectionNodeLinks(elem[0].parentNode.id, "charts");
            });

            //Alarm
            $('.alarmHistoryDashLink ').on('click' ,function(){

                var elem = $(this).parents().eq(1).prev();

                 sectionNodeLinks(elem[0].parentNode.id, "alarmHistory");
                 loadAlarmHistoryLink(elem[0].parentNode.id);
            });

            //Remote
            $('.remoteDashLink ').on('click' ,function(){

                var elem = $(this).parents().eq(1).prev();

                 sectionNodeLinks(elem[0].parentNode.id, "remote");
            });

    //Dash link listener for mobile
            //Config
            $('.nodeConfigDashLinkMobile').on('click' ,function(){

                var id = $(this).parents().eq(3).attr('id');
                window.location = "/configurations/" + id ;
            });

            //Charts
            $('.chartDashLinkMobile').on('click' ,function(){

                var elem = $(this).parents().eq(2).prev();

                loadChartsLink(elem[0].parentNode.id);
                sectionNodeLinks(elem[0].parentNode.id, "charts");
            });

            //Alarm
            $('.alarmHistoryDashLinkMobile').on('click' ,function(){

                var elem = $(this).parents().eq(2).prev();

                sectionNodeLinks(elem[0].parentNode.id, "alarmHistory");
                loadAlarmHistoryLink(elem[0].parentNode.id);
            });

            //Remote
            $('.remoteDashLinkMobile ').on('click' ,function(){

                var elem = $(this).parents().eq(2).prev();

                 sectionNodeLinks(elem[0].parentNode.id, "remote");
            });



}

function alarmSummary(data){
    var parent = document.getElementById('alarmHistoryList');
    parent.innerHTML = '';

    console.log(data.data);

    data.data.sort(function(a,b){
      return new Date(b.datetime) - new Date(a.datetime)
    });

    console.log(data.data);
    for (var i=0; i< data.data.length; i++){
        var serial = data.data[i].serial;
        var label = data.data[i].label;
        var tagName = data.data[i].tag_name;
        var value = data.data[i].value;
        var dateTime = moment(data.data[i].datetime).format('hh:mm a DD/MM/YY');
        var childHTML = `<a href="javascript:void(0)"
                                                class="message-item d-flex align-items-center border-bottom px-3 py-2">
                                                <div class="btn-warning square-box" style="padding:5px;"><span>${serial}</span></div>
                                                <div class="w-75 d-inline-block v-middle pl-2">
                                                    <h6 class="message-title mb-0 mt-1">${tagName}</h6>
                                                    <span class="font-12 text-nowrap d-block text-muted">${label}</span>
                                                    <span class="font-12 text-nowrap d-block text-muted">${dateTime}</span>
                                                </div>
                                            </a>`;

        parent.innerHTML += childHTML;


    }
}

