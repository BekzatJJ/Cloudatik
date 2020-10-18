function connectMqtt(id){
  $('#5WXeh7_control').css("display", "none");
  document.getElementById('connectionAlert_'+id).innerHTML = `<div id="spinner_${id}_remote" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <div id="alert_${id}_remote" style="dispay:none;" class="alert alert-success alert-dismissible fade hide" role="alert">
                                          <span>Connected successfully!</span>
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`;


    // Create a client instance
    client = new Paho.MQTT.Client("mqtt.hphttech.com", Number(9001), "bekzat");

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect, useSSL: true});


}
        // called when the client connects
    function onConnect() {
      document.getElementById('connectionAlert_5WXeh7').innerHTML = `<div id="spinner_5WXeh7_remote" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <div id="alert_5WXeh7_remote" style="dispay:none;" class="alert alert-success alert-dismissible fade hide" role="alert">
                                          <span>Connected successfully!</span>
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`;

      document.getElementById('spinner_5WXeh7_remote').classList.remove('lds-roller');
      document.getElementById('alert_5WXeh7_remote').classList.remove('hide');
      document.getElementById('alert_5WXeh7_remote').classList.add('show');
      $('#5WXeh7_control').css("display", "block");
                   remoteLed = new steelseries.Led('canvasLed', {
                            width: 100,
                            height: 100
                            });
                    remoteLed.setLedColor(steelseries.LedColor.RED_LED);
                    document.getElementById('canvasLed').classList.remove('active');

    // Once a connection has been made, make a subscription and send a message.

      console.log("connected");
      client.subscribe("env/aswa/HT0098");
      client.subscribe("env/mprp/HT0098");
      client.subscribe("env/mpwa/HT0098");

      message = new Paho.MQTT.Message("");
      message.destinationName = "env/mprd/HT0098"; //read current settings
      client.send(message);
      saveActivity("Send", "mprd", "");
    }
    function reConnect(){
      client.connect({onSuccess:onConnect, useSSL: true});
    }
    function onConnectionLost(responseObject){
      $('#5WXeh7_control').css("display", "none");
      document.getElementById('connectionAlert_5WXeh7').innerHTML = `<div id="spinner_5WXeh7_remote" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                                        <div id="alert_5WXeh7_remote" style="dispay:none;" class="alert alert-danger alert-dismissible fade hide" role="alert">
                                          <span>Connection lost, try to reconnect!t</span>
                                          <button class="btn" onclick="reConnect();"> Reconnect </button>
                                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                          </button>
                                        </div>`;
      //

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
  var msg = JSON.parse(msg);
  console.log(msg);
  //IO
  if(msg.do0 == 1){
     remoteLed.setLedColor(steelseries.LedColor.GREEN_LED);
     remoteLed.setLedOnOff(true);
     document.getElementById('canvasLed').classList.add('active');
  }else{
     remoteLed.setLedColor(steelseries.LedColor.RED_LED);
     remoteLed.setLedOnOff(false);
     document.getElementById('canvasLed').classList.remove('active');

  }

  //Mode
  var modeBtns = document.getElementsByClassName('remoteModeBtn');
  for(var i=0; i< modeBtns.length; i++){
    modeBtns[i].classList.remove('active');
  }
  switch(msg.md){
    case 1: var mode = "Remote Mode";
            document.getElementById('mode_1').classList.add('active');
            document.getElementById('switch-refresh').innerHTML= "Switch";
            document.getElementById('switch-refresh').classList.add('switch');
            document.getElementById('switch-refresh').classList.remove('refresh'); break;
    case 2: var mode = "T-TH Mode";
            document.getElementById('mode_2').classList.add('active');
            document.getElementById('switch-refresh').innerHTML= "Refresh";
            document.getElementById('switch-refresh').classList.add('refresh');
            document.getElementById('switch-refresh').classList.remove('active');
            $('#tth-content').collapse('show'); break;
    case 3: var mode = "T-T Mode";
            document.getElementById('mode_3').classList.add('active');
            document.getElementById('switch-refresh').innerHTML= "Refresh";
            document.getElementById('switch-refresh').classList.add('refresh');
            document.getElementById('switch-refresh').classList.remove('active');
            $('#tt-content').collapse('show'); break;
    case 4: var mode = "T-H Mode";
            document.getElementById('mode_4').classList.add('active');
            document.getElementById('switch-refresh').innerHTML= "Refresh";
            document.getElementById('switch-refresh').classList.add('refresh');
            document.getElementById('switch-refresh').classList.remove('active');
            $('#th-content').collapse('show'); break;
    default: var mode = ""; break;
  }
  document.getElementById('remoteHeader').innerHTML = mode;


  //Interval
  $('[name=remoteInterval]').val(msg.itv);

  //tresholds
  var slider_tth_t = document.getElementById('slider-tth-t');
  var slider_tth_h = document.getElementById('slider-tth-h');
  var slider_tt = document.getElementById('slider-tt');
  var slider_th = document.getElementById('slider-th');

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
      message = new Paho.MQTT.Message("");
      message.destinationName = "env/mprd/HT0098"; //read current settings
      client.send(message);
      saveActivity("Send", "mprd", "");
  }
}


function remoteSwitchReply(msg){
  var msg = JSON.parse(msg);
  console.log(msg);
    if(msg.do0 == 1){
     remoteLed.setLedColor(steelseries.LedColor.GREEN_LED);
     remoteLed.setLedOnOff(true);
     document.getElementById('canvasLed').classList.add('active');
  }else{
     remoteLed.setLedColor(steelseries.LedColor.RED_LED);
     remoteLed.setLedOnOff(false);
     document.getElementById('canvasLed').classList.remove('active');

  }
}


function switchToggle(){

  if(document.getElementById('switch-refresh').classList.contains('switch')){
      if($('#canvasLed').hasClass('active')){
          message = new Paho.MQTT.Message('{"do0":"0"}');
          message.destinationName = "env/aswr/HT0098";
          client.send(message);
          saveActivity("Send", "aswr", {"do0":"0"});
    }else{
          message = new Paho.MQTT.Message('{"do0":"1"}');
          message.destinationName = "env/aswr/HT0098";
          client.send(message);
          saveActivity("Send", "aswr", {"do0":"1"});
    }
  }else if(document.getElementById('switch-refresh').classList.contains('refresh')){
      message = new Paho.MQTT.Message("");
      message.destinationName = "env/mprd/HT0098"; //read current settings
      client.send(message);
      saveActivity("Send", "mprd", "");
  }

}


function clickModeBtn(elem){
  $('.collapse').collapse('hide');

  var activeMode = document.getElementsByClassName('remoteModeBtn');
  for(var i=0; i<activeMode.length; i++){
    activeMode[i].classList.remove('active');
  }
  document.getElementById(elem.id).classList.add('active');
}

function writeSettings(){
  var modes = document.getElementsByClassName('remoteModeBtn');

  var itv = $('[name=remoteInterval]').val();

  for(var i=0; i<modes.length; i++){
    if(modes[i].classList.contains('active')){
      var mode = modes[i].id.split("_")[1];
    }
  }


  if(mode == "1"){
    var data = {"itv": itv, "md": "1"};
  }else if(mode == "2"){
    var tempSlider = document.getElementById('slider-tth-t');
    var humidSlider = document.getElementById('slider-tth-h');
    var ttl = parseInt(tempSlider.noUiSlider.get()[0])*100;
    var tth = parseInt(tempSlider.noUiSlider.get()[1])*100;
    var htl = parseInt(humidSlider.noUiSlider.get()[0])*100;
    var hth = parseInt(humidSlider.noUiSlider.get()[1])*100;

    var data = {"itv": itv, "md":"2", "ttl": ttl, "tth": tth, "htl": htl, "hth":hth};
  }else if(mode == "3"){
    var tempSlider = document.getElementById('slider-tt');
    var ttl = parseInt(tempSlider.noUiSlider.get()[0])*100;
    var tth = parseInt(tempSlider.noUiSlider.get()[1])*100;

    var data = {"itv": itv, "md":"3", "ttl": ttl, "tth": tth};
  }else if(mode == "4"){
    var tempSlider = document.getElementById('slider-th');
    var htl = parseInt(tempSlider.noUiSlider.get()[0])*100;
    var hth = parseInt(tempSlider.noUiSlider.get()[1])*100;

    var data = {"itv": itv, "md":"4", "htl": htl, "hth":hth};
  }
        console.log(data);
        var dataNew = JSON.stringify(data);
        console.log(dataNew);
        message = new Paho.MQTT.Message(dataNew);
        message.destinationName = "env/mpwr/HT0098";
        client.send(message);
        saveActivity("Send", "mpwr", dataNew);


}

function saveActivity(activity, category, data){
  var static = {"serial":"HT0098", "user": username, "category": category};
  var combined = jQuery.extend(static, data);
  $.ajax({
                type: "POST",
                url: 'https://api.cl-ds.com/saveRemoteMqtt'+activity+'/HT0098/',
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
