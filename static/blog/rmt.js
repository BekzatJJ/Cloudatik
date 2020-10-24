function connectMqtt(id){

  onlineRemote = {"id": id, "online":false};
  $('#'+id+'_control').css("display", "none");
  document.getElementById('connectionAlert_'+id).innerHTML = `<div id="spinner_${id}_remote" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <div id="alert_${id}_remote" style="dispay:none;" class="alert alert-success alert-dismissible fade hide" role="alert">
                                          <span>Connected successfully!</span>
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`;

             $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getRemoteNodeTopic/' + id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    remoteNode = data;
                    // Create a client instance
                    client = new Paho.MQTT.Client("mqtt.hphttech.com", Number(9001), username);

                    // set callback handlers
                    client.onConnectionLost = onConnectionLost;
                    client.onMessageArrived = onMessageArrived;

                    // connect the client
                    client.connect({onSuccess:onConnect, useSSL: true});
                  }
            });



}
        // called when the client connects
    function onConnect() {
    // Once a connection has been made, make a subscription and send a message.

      console.log("connected");
      client.subscribe(remoteNode.mqtt_channel+"/aswa/"+remoteNode.serial);
      client.subscribe(remoteNode.mqtt_channel+"/mprp/"+remoteNode.serial);
      client.subscribe(remoteNode.mqtt_channel+"/mpwa/"+remoteNode.serial);

      message = new Paho.MQTT.Message("");
      message.destinationName = remoteNode.mqtt_channel+"/mprd/"+remoteNode.serial; //read current settings
      client.send(message);
      saveActivity("Send", "mprd", "");
      setTimeout(checkOnline, 9000)
    }

    function checkOnline(){
      if(onlineRemote.online){

      }else{
        $('#'+remoteNode.device_id+'_control').css("display", "none");

        document.getElementById('connectionAlert_'+remoteNode.device_id).innerHTML = `<div id="spinner_${remoteNode.device_id}_remote" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <div id="alert_${remoteNode.device_id}_remote" style="dispay:none;" class="alert alert-danger alert-dismissible fade hide" role="alert">
                                          <span>Could not establish connection, try to reconnect!</span>
                                          <button class="btn" onclick="reConnect();"> Reconnect </button>
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`;
      document.getElementById('spinner_'+remoteNode.device_id+'_remote').classList.remove('lds-roller');
      document.getElementById('alert_'+remoteNode.device_id+'_remote').classList.remove('hide');
      document.getElementById('alert_'+remoteNode.device_id+'_remote').classList.add('show');

      }
    }
    function reConnect(){
      document.getElementById('alert_'+remoteNode.device_id+'_remote').classList.remove('show');
      document.getElementById('alert_'+remoteNode.device_id+'_remote').classList.add('hide');
      document.getElementById('spinner_'+remoteNode.device_id+'_remote').classList.add('lds-roller');

      message = new Paho.MQTT.Message("");
      message.destinationName = remoteNode.mqtt_channel+"/mprd/"+remoteNode.serial; //read current settings
      client.send(message);
      saveActivity("Send", "mprd", "");
      setTimeout(checkOnline, 9000)
    }

    function onConnectionLost(responseObject){


      if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
      client.connect({onSuccess:onConnect, useSSL: true});
    }

    function onMessageArrived(message) {

          if(message.destinationName.split("/")[1] == "mpwa"){
            writeSettingsReply(message.payloadString);
            saveActivity("Reply", "mpwa", JSON.parse(message.payloadString));
          }
          if(message.destinationName.split("/")[1] == "aswa"){
            remoteSwitchReply(message.payloadString);
            saveActivity("Reply", "aswa", JSON.parse(message.payloadString));
          }
          if(message.destinationName.split("/")[1] == "mprp"){
            readSettingsReply(message.payloadString);
            saveActivity("Reply", "mprp", JSON.parse(message.payloadString));
          }

}

function readSettingsReply(msg){
  //Init, display success
  onlineRemote = {"id": remoteNode.device_id, "online":true};
      document.getElementById('connectionAlert_'+remoteNode.device_id).innerHTML = `<div id="spinner_${remoteNode.device_id}_remote" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <div id="alert_${remoteNode.device_id}_remote" style="dispay:none;" class="alert alert-success alert-dismissible fade hide" role="alert">
                                          <span>Connected successfully!</span>
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`;

      document.getElementById('spinner_'+remoteNode.device_id+'_remote').classList.remove('lds-roller');
      document.getElementById('alert_'+remoteNode.device_id+'_remote').classList.remove('hide');
      document.getElementById('alert_'+remoteNode.device_id+'_remote').classList.add('show');
      $('#'+remoteNode.device_id+'_control').css("display", "block");
                   remoteLed = new steelseries.Led('canvasLed_'+remoteNode.device_id, {
                            width: 100,
                            height: 100
                            });
                    remoteLed.setLedColor(steelseries.LedColor.RED_LED);
                    document.getElementById('canvasLed_'+remoteNode.device_id).classList.remove('active');


  var msg = JSON.parse(msg);
  console.log(msg);
  //IO
  if(msg.do0 == 1){
     remoteLed.setLedColor(steelseries.LedColor.GREEN_LED);
     remoteLed.setLedOnOff(true);
     document.getElementById('canvasLed_'+remoteNode.device_id).classList.add('active');
  }else{
     remoteLed.setLedColor(steelseries.LedColor.RED_LED);
     remoteLed.setLedOnOff(false);
     document.getElementById('canvasLed_'+remoteNode.device_id).classList.remove('active');

  }

  //Mode
  var modeBtns = document.getElementsByClassName('remoteModeBtn_'+remoteNode.device_id);
  for(var i=0; i< modeBtns.length; i++){
    modeBtns[i].classList.remove('active');
  }
  switch(msg.md){
    case 1: var mode = "Remote Mode";
            document.getElementById('modeSelect_'+remoteNode.device_id).value = "1";
            document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Switch";
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('switch');
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('refresh'); break;
    case 2: var mode = "T-TH Mode";
            document.getElementById('modeSelect_'+remoteNode.device_id).value = "2";
            document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Refresh";
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('refresh');
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('active');
            $('#tth-content_'+remoteNode.device_id).collapse('show'); break;
    case 3: var mode = "T-T Mode";
            document.getElementById('modeSelect_'+remoteNode.device_id).value = "3";
            document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Refresh";
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('refresh');
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('active');
            $('#tt-content_'+remoteNode.device_id).collapse('show'); break;
    case 4: var mode = "T-H Mode";
            document.getElementById('modeSelect_'+remoteNode.device_id).value = "4";
            document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Refresh";
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('refresh');
            document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('active');
            $('#th-content_'+remoteNode.device_id).collapse('show'); break;
    default: var mode = ""; break;
  }
  document.getElementById('remoteHeader_'+remoteNode.device_id).innerHTML = mode;


  //Interval
  $('[name=remoteInterval]').val(msg.itv);

  //tresholds
  var slider_tth_t = document.getElementById('slider-tth-t_'+remoteNode.device_id);
  var slider_tth_h = document.getElementById('slider-tth-h_'+remoteNode.device_id);
  var slider_tt = document.getElementById('slider-tt_'+remoteNode.device_id);
  var slider_th = document.getElementById('slider-th_'+remoteNode.device_id);

  if(slider_tth_t.classList.contains('noUi-target')){
    slider_tth_t.noUiSlider.destroy();
  }
  if(slider_tth_h.classList.contains('noUi-target')){
    slider_tth_h.noUiSlider.destroy();
  }
  if(slider_tt.classList.contains('noUi-target')){
    slider_tt.noUiSlider.destroy();
  }
  if(slider_th.classList.contains('noUi-target')){
    slider_th.noUiSlider.destroy();
  }

  var hth = msg.hth/100;
  var htl = msg.htl/100;
  var tth = msg.tth/100;
  var ttl = msg.ttl/100;

  noUiSlider.create(slider_tth_t, {
    start: [ttl, tth],
    tooltips: true,
    connect: true,
    range: {
        'min': parseInt(ttl- (ttl*0.30)),
        'max': parseInt(tth+ (tth*0.30))
    }
});


  noUiSlider.create(slider_tth_h, {
    start: [htl, hth],
    tooltips: true,
    connect: true,
    range: {
        'min': parseInt(htl- (htl*0.30)),
        'max': parseInt(hth+ (hth*0.30))
    }
});

  noUiSlider.create(slider_tt, {
    start: [ttl, tth],
    tooltips: true,
    connect: true,
    range: {
        'min': parseInt(ttl- (ttl*0.30)),
        'max': parseInt(tth+ (tth*0.30))
    }
});
  noUiSlider.create(slider_th, {
    start: [htl, hth],
    tooltips: true,
    connect: true,
    range: {
        'min': parseInt(htl- (htl*0.30)),
        'max': parseInt(hth+ (hth*0.30))
    }
});


}

function writeSettingsReply(msg){
  var msg = JSON.parse(msg);
  if(msg.success){
     var modeBtns = document.getElementsByClassName('remoteModeBtn_'+remoteNode.device_id);
      for(var i=0; i< modeBtns.length; i++){
        modeBtns[i].classList.remove('active');
      }
      switch(msg.md){
        case 1: var mode = "Remote Mode";
                document.getElementById('modeSelect_'+remoteNode.device_id).value = "1";
                document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Switch";
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('switch');
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('refresh'); break;
        case 2: var mode = "T-TH Mode";
                document.getElementById('modeSelect_'+remoteNode.device_id).value = "2";
                document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Refresh";
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('refresh');
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('active');
                $('#tth-content_'+remoteNode.device_id).collapse('show'); break;
        case 3: var mode = "T-T Mode";
                document.getElementById('modeSelect_'+remoteNode.device_id).value = "3";
                document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Refresh";
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('refresh');
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('active');
                $('#tt-content_'+remoteNode.device_id).collapse('show'); break;
        case 4: var mode = "T-H Mode";
                document.getElementById('modeSelect_'+remoteNode.device_id).value = "4";
                document.getElementById('switch-refresh-'+remoteNode.device_id).innerHTML= "Refresh";
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.add('refresh');
                document.getElementById('switch-refresh-'+remoteNode.device_id).classList.remove('active');
                $('#th-content_'+remoteNode.device_id).collapse('show'); break;
        default: var mode = ""; break;
      }
      document.getElementById('remoteHeader_'+remoteNode.device_id).innerHTML = mode;


      //Interval
      $('[name=remoteInterval]').val(msg.itv);

      //tresholds
      var slider_tth_t = document.getElementById('slider-tth-t_'+remoteNode.device_id);
      var slider_tth_h = document.getElementById('slider-tth-h_'+remoteNode.device_id);
      var slider_tt = document.getElementById('slider-tt_'+remoteNode.device_id);
      var slider_th = document.getElementById('slider-th_'+remoteNode.device_id);

      if(slider_tth_t.classList.contains('noUi-target')){
        slider_tth_t.noUiSlider.destroy();
      }
      if(slider_tth_h.classList.contains('noUi-target')){
        slider_tth_h.noUiSlider.destroy();
      }
      if(slider_tt.classList.contains('noUi-target')){
        slider_tt.noUiSlider.destroy();
      }
      if(slider_th.classList.contains('noUi-target')){
        slider_th.noUiSlider.destroy();
      }

      var hth = msg.hth/100;
      var htl = msg.htl/100;
      var tth = msg.tth/100;
      var ttl = msg.ttl/100;

      noUiSlider.create(slider_tth_t, {
        start: [ttl, tth],
        tooltips: true,
        connect: true,
        range: {
            'min': parseInt(ttl- (ttl*0.30)),
            'max': parseInt(tth+ (tth*0.30))
        }
    });


      noUiSlider.create(slider_tth_h, {
        start: [htl, hth],
        tooltips: true,
        connect: true,
        range: {
            'min': parseInt(htl- (htl*0.30)),
            'max': parseInt(hth+ (hth*0.30))
        }
    });

      noUiSlider.create(slider_tt, {
        start: [ttl, tth],
        tooltips: true,
        connect: true,
        range: {
            'min': parseInt(ttl- (ttl*0.30)),
            'max': parseInt(tth+ (tth*0.30))
        }
    });
      noUiSlider.create(slider_th, {
        start: [htl, hth],
        tooltips: true,
        connect: true,
        range: {
            'min': parseInt(htl- (htl*0.30)),
            'max': parseInt(hth+ (hth*0.30))
        }
    });
  }
}


function remoteSwitchReply(msg){
  var msg = JSON.parse(msg);
  console.log(msg);
    if(msg.do0 == 1){
     remoteLed.setLedColor(steelseries.LedColor.GREEN_LED);
     remoteLed.setLedOnOff(true);
     document.getElementById('canvasLed_'+remoteNode.device_id).classList.add('active');
  }else{
     remoteLed.setLedColor(steelseries.LedColor.RED_LED);
     remoteLed.setLedOnOff(false);
     document.getElementById('canvasLed_'+remoteNode.device_id).classList.remove('active');

  }
}


function switchToggle(){

  if(document.getElementById('switch-refresh-'+remoteNode.device_id).classList.contains('switch')){
      if($('#canvasLed_'+remoteNode.device_id).hasClass('active')){
          message = new Paho.MQTT.Message('{"do0":"0"}');
          message.destinationName = remoteNode.mqtt_channel+"/aswr/"+remoteNode.serial;
          client.send(message);
          saveActivity("Send", "aswr", {"do0":"0"});
    }else{
          message = new Paho.MQTT.Message('{"do0":"1"}');
          message.destinationName = remoteNode.mqtt_channel+"/aswr/"+remoteNode.serial;
          client.send(message);
          saveActivity("Send", "aswr", {"do0":"1"});
    }
  }else if(document.getElementById('switch-refresh-'+remoteNode.device_id).classList.contains('refresh')){
      message = new Paho.MQTT.Message("");
      message.destinationName = remoteNode.mqtt_channel+"/mprd/"+remoteNode.serial;//read current settings
      client.send(message);
      saveActivity("Send", "mprd", "");
  }

}


function clickModeBtn(elem){
  $('.collapse').collapse('hide');

  var activeMode = document.getElementsByClassName('remoteModeBtn_'+remoteNode.device_id);
  for(var i=0; i<activeMode.length; i++){
    activeMode[i].classList.remove('active');
  }
  document.getElementById(elem.id).classList.add('active');
}

function modeSelect(){
  $('.collapse').collapse('hide');
  var modeNum = document.getElementById('modeSelect_'+remoteNode.device_id).value;

  switch(modeNum){
    case "1": $('.collapse').collapse('hide'); break;
    case "2": $('#tth-content_'+remoteNode.device_id).collapse('show');break;
    case "3": $('#tt-content_'+remoteNode.device_id).collapse('show');break;
    case "4": $('#th-content_'+remoteNode.device_id).collapse('show');break;
    default: break;
  }
}

function writeSettings(){
  var modes = document.getElementsByClassName('remoteModeBtn_'+remoteNode.device_id);

  var itv = $('[name=remoteInterval]').val();

var mode = document.getElementById('modeSelect_'+remoteNode.device_id).value;


  if(mode == "1"){
    var data = {"itv": itv, "md": "1"};
  }else if(mode == "2"){
    var tempSlider = document.getElementById('slider-tth-t_'+remoteNode.device_id);
    var humidSlider = document.getElementById('slider-tth-h_'+remoteNode.device_id);
    var ttl = parseFloat(tempSlider.noUiSlider.get()[0])*100;
    var tth = parseFloat(tempSlider.noUiSlider.get()[1])*100;
    var htl = parseFloat(humidSlider.noUiSlider.get()[0])*100;
    var hth = parseFloat(humidSlider.noUiSlider.get()[1])*100;

    var data = {"itv": itv, "md":"2", "ttl": ttl, "tth": tth, "htl": htl, "hth":hth};
  }else if(mode == "3"){
    var tempSlider = document.getElementById('slider-tt_'+remoteNode.device_id);
    var ttl = parseFloat(tempSlider.noUiSlider.get()[0])*100;
    var tth = parseFloat(tempSlider.noUiSlider.get()[1])*100;

    var data = {"itv": itv, "md":"3", "ttl": ttl, "tth": tth};
  }else if(mode == "4"){
    var tempSlider = document.getElementById('slider-th_'+remoteNode.device_id);
    var htl = parseFloat(tempSlider.noUiSlider.get()[0])*100;
    var hth = parseFloat(tempSlider.noUiSlider.get()[1])*100;

    var data = {"itv": itv, "md":"4", "htl": htl, "hth":hth};
  }
        console.log(data);
        var dataNew = JSON.stringify(data);
        console.log(dataNew);
        message = new Paho.MQTT.Message(dataNew);
        message.destinationName = remoteNode.mqtt_channel+"/mpwr/"+remoteNode.serial;;
        client.send(message);
        saveActivity("Send", "mpwr", dataNew);


}

function saveActivity(activity, category, data){
  var static = {"serial": remoteNode.serial, "user": username, "category": category};
  var combined = jQuery.extend(static, data);
  $.ajax({
                type: "POST",
                url: 'https://api.cl-ds.com/saveRemoteMqtt'+activity+'/'+remoteNode.serial+'/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                data: JSON.stringify(combined),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(dataRcvd){
                    console.log(dataRcvd);

                },
                error: function(request, status, error){
                    console.log(request.responseJSON.message);
                }
            });
}
