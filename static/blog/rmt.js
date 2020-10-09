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
    //client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect, useSSL: true});

    // called when the client connects
    function onConnect() {
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
    }
}

    function onMessageArrived(message) {

          if(message.destinationName.split("/")[1] == "mpwa"){
            writeSettings(message.payloadString);
          }
          if(message.destinationName.split("/")[1] == "aswa"){
            remoteSwitch(message.payloadString);
          }
          if(message.destinationName.split("/")[1] == "mprp"){
            readSettings(message.payloadString);
          }

}

function readSettings(msg){
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
            document.getElementById('mode_1').classList.add('active'); break;
    case 2: var mode = "T-TH Mode";
            document.getElementById('mode_2').classList.add('active'); break;
    case 3: var mode = "T-T Mode";
            document.getElementById('mode_3').classList.add('active'); break;
    case 4: var mode = "T-H Mode";
            document.getElementById('mode_4').classList.add('active'); break;
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
  noUiSlider.create(slider_tth_t, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});
  noUiSlider.create(slider_tth_h, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});

  noUiSlider.create(slider_tt, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});
  noUiSlider.create(slider_th, {
    start: [20, 80],
    connect: true,
    range: {
        'min': 0,
        'max': 100
    }
});


}
function writeSettings(msg){
  var msg = JSON.parse(msg);
  console.log(msg);
}
function remoteSwitch(msg){
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
  if($('#canvasLed').hasClass('active')){
        message = new Paho.MQTT.Message('{"do0":"0"}');
        message.destinationName = "env/aswr/HT0098";
        client.send(message);
  }else{
        message = new Paho.MQTT.Message('{"do0":"1"}');
        message.destinationName = "env/aswr/HT0098";
        client.send(message);
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

