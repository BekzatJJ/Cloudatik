window.onload = function () {
    window.alarmData= {};
    requestConfigAlarm();
    requestNodeInfo();
}

function requestConfigAlarm(){

     $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getAlarmPropV3/'+ device_id + '/' + username,
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    alarmData = data;
                    var spinner = document.getElementById('configSpinner');
                    spinner.classList.remove('lds-roller');
                    document.getElementById('configContainer').setAttribute('style', 'display:block;');
                    console.log(data);
                    renderConfigAlarm(data);
                }

            });
}

function renderConfigAlarm(data){
    var parent = document.getElementById('alarmProp');
    var titleParent = document.getElementById('chartTitle');
    titleParent.innerHTML=``;
    parent.innerHTML='';
    var alarmHtml=``;
    var titleHTML=``;

    if(data.alarm_permit){
        for(var i=0; i< data.alarm_prop.length; i++){

        if(data.alarm_prop[i].alarm_enabled){
            var alarmEnabled = `<input type="checkbox" class="custom-control-input enabler" id="${data.alarm_prop[i].parameter}_enable" checked>
                               <label class="custom-control-label" for="${data.alarm_prop[i].parameter}_enable">Enabled</label>`;
        }else{
            var alarmEnabled = `<input type="checkbox" class="custom-control-input enabler" id="${data.alarm_prop[i].parameter}_enable">
                               <label class="custom-control-label" for="${data.alarm_prop[i].parameter}_enable">Enabled</label>`;
        }
        if(data.alarm_prop[i].plot_limit){
            var plotEnabled = `<input type="checkbox" class="custom-control-input enabler" id="${data.alarm_prop[i].parameter}_plot" checked>
                               <label class="custom-control-label" for="${data.alarm_prop[i].parameter}_plot">Plot Limit</label>`;
        }else{
            var plotEnabled = `<input type="checkbox" class="custom-control-input enabler" id="${data.alarm_prop[i].parameter}_plot">
                               <label class="custom-control-label" for="${data.alarm_prop[i].parameter}_plot">Plot Limit</label>`;
        }

        if(data.alarm_prop[i].chart_title == null){
            var chartTitle = `<a href="#" id="${data.alarm_prop[i].parameter}_title" data-title="Enter Title">${data.alarm_prop[i].label}</a>`;
            var chartTitleAlarm = `<a href="#" data-title="Enter Title">${data.alarm_prop[i].label}</a>`;
        }else{
            var chartTitle = `<a href="#" id="${data.alarm_prop[i].parameter}_title" data-title="Enter Title">${data.alarm_prop[i].chart_title}</a>`;
            var chartTitleAlarm = `<a href="#" data-title="Enter Title">${data.alarm_prop[i].chart_title}</a>`;}
        if(data.alarm_prop[i].slider_category == "slider"){
            var controller = `<div id="${data.alarm_prop[i].parameter}_slider" class="slider" style="margin-bottom:50px;"></div>

                                <span id="${data.alarm_prop[i].parameter}_lowLabel" class="slider-labels" style="float:left;"><div style="width:50%;">Min <input type="text" class="form-control minMaxInputs" name="${data.alarm_prop[i].parameter}_min"></div></span>
                                <span id="${data.alarm_prop[i].parameter}_highLabel" class="slider-labels" style="float:right;"><div class="" style="width:50%; float:right;"><span style="float:right;">Max</span> <input type="text" class="minMaxInputs form-control" name="${data.alarm_prop[i].parameter}_max"></div></span>`;
        }else if(data.alarm_prop[i].slider_category == "switch"){
            var controller = `<div id="${data.alarm_prop[i].parameter}_switch" class="switch" style="margin-bottom:25px;"></div>`;
        }else if(data.alarm_prop[i].slider_category == "threshold"){
            var controller = `<div id="${data.alarm_prop[i].parameter}-threshold" class="threshold" style="margin-bottom:50px;"></div>
                                <span id="${data.alarm_prop[i].parameter}-lowLabel" class="slider-labels" style="float:left;"><div style="width:50%;">Min <input type="text" class="minMaxInputs form-control" name="${data.alarm_prop[i].parameter}-min"></div></span>
                                <span id="${data.alarm_prop[i].parameter}-highLabel" class="slider-labels" style="float:right;"><div class="" style="width:50%; float:right;"><span style="float:right;">Max</span> <input type="text" class="minMaxInputs form-control" name="${data.alarm_prop[i].parameter}-max"></div></span>`;
        }

        alarmHtml = `<div id="${data.alarm_prop[i].parameter}" class="card" style="display: flex; margin-bottom: 50px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                                                                                <div class="card-header">`+
                                                                                    chartTitleAlarm +
                                                                                `</div>
                                                                                <div class="card-body parameter" style="margin-top:5px;">
                                                                                    <!-- switch -->
                                                                                    <div class="custom-control custom-switch" style="float:right; margin-left:10px;">`+
                                                                                        plotEnabled+
                                                                                    `</div>
                                                                                    <div class="custom-control custom-switch" style="float:right;">`+
                                                                                      alarmEnabled +
                                                                                    `</div>
                                                                                    <div class="controller" style="margin-top:70px">`+
                                                                                        controller +
                                                                                    `</div>

                                                                                </div>
                                                                            </div>`;
        titleHTML= `<div class="card" style="margin-bottom: 10px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
                                                                                <div class="card-body parameter" style="margin-top:5px;">`+
                                                                                   chartTitle +

                                                                                `</div>
                                                                            </div>`;
        parent.innerHTML+= alarmHtml;

    }
    }

    for(var i=0; i< data.alarm_prop.length; i++){


        if(data.alarm_prop[i].chart_title == null){
            var chartTitle = `<a href="#" id="${data.alarm_prop[i].parameter}_title" data-title="Enter Title">${data.alarm_prop[i].label}</a>`;
        }else{
            var chartTitle = `<a href="#" id="${data.alarm_prop[i].parameter}_title" data-title="Enter Title">${data.alarm_prop[i].chart_title}</a>`;}

        titleHTML= `<div class="card" style="margin-bottom: 10px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));">
                                                                                <div class="card-body parameter" style="margin-top:5px;">`+
                                                                                   chartTitle +

                                                                                `</div>
                                                                            </div>`;
        titleParent.innerHTML += titleHTML;


    }

//Remove Node

var serialRemoveNode = data.serial;
document.getElementById('removeNodeHeader').innerHTML = serialRemoveNode;


    $.fn.editable.defaults.mode = 'inline';
    $.fn.editableform.buttons =
'<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
    '<i class="fa fa-fw fa-check"></i>' +
    '</button>' +
'<button type="button" class="btn btn-warning btn-sm editable-cancel">' +
    '<i class="fa fa-fw fa-times"></i>' +
    '</button>';

    for(var i=0; i<data.alarm_prop.length; i++){
        $('#'+ data.alarm_prop[i].parameter + '_title').editable({
            mode: 'inline',
            send:"always",
            validate: function(value) {
                    if ($.trim(value) === '') return 'This field is required';
                    },
            url: 'https://api.cl-ds.com/saveChartTitle/',
            ajaxOptions: {
                type: 'post',
                dataType: 'json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"}
            },
            params: function(params){
                var data = {};
                data["device_id"] = device_id;
                var parameter = params.name.split(/_/);
                data["parameter"] = parameter[0];
                data["chart_title"] = params.value

                return JSON.stringify(data);
            }
        });
    }


    //Init controller
    for(var i=0; i< data.alarm_prop.length; i++){
        if(data.alarm_prop[i].slider_category == "slider"){
            var slider = document.getElementById(data.alarm_prop[i].parameter + '_slider');
            if((parseFloat(data.alarm_prop[i].limit_high) - parseFloat(data.alarm_prop[i].limit_low)) <= 1 ){
                var step= 0.1;
            }else if((parseFloat(data.alarm_prop[i].limit_high) - parseFloat(data.alarm_prop[i].limit_low)) <= 100){
                var step= 1;
            }else if((parseFloat(data.alarm_prop[i].limit_high) - parseFloat(data.alarm_prop[i].limit_low)) <= 1000){
                var step= 10;
            }

            if(data.alarm_prop[i].alarm_max == null){
                var alarmMax = data.alarm_prop[i].slider_max;
            }else{
                var alarmMax = data.alarm_prop[i].alarm_max;
            }

            if(data.alarm_prop[i].alarm_min == null){
                var alarmMin = data.alarm_prop[i].slider_min;
            }else{
                var alarmMin = data.alarm_prop[i].alarm_min;
            }


            noUiSlider.create(slider, {
                start: [parseFloat(data.alarm_prop[i].limit_low) , parseFloat(data.alarm_prop[i].limit_high)],
                connect: true,
                tooltips: true,
                step: step,
                range: {
                    'min': parseFloat(alarmMin),
                    'max': parseFloat(alarmMax)
                },
                pips:{
                    mode: 'count',
                    values: 2,
                    density: 4,
                    stepped: true
                }
            });

            $('[name='+ data.alarm_prop[i].parameter + '_max]').val(alarmMax);
            $('[name='+ data.alarm_prop[i].parameter + '_min]').val(alarmMin);

            $('[name='+ data.alarm_prop[i].parameter + '_max]').keyup(function(){
                var id = $(this).parents().eq(1).attr('id');
                var par = id.split("_");
                par = par[0];
                console.log(par);
                console.log($('[name='+ par + '_max]').val());
                var slider = document.getElementById(par+'_slider');
                slider.noUiSlider.updateOptions({
                    range:{
                        'max':  parseInt($('[name='+ par + '_max]').val()),
                        'min':  parseInt($('[name='+ par + '_min]').val())
                    }
                });
            });
            $('[name='+ data.alarm_prop[i].parameter + '_min]').keyup(function(){
                var id = $(this).parents().eq(1).attr('id');
                var par = id.split("_");
                par = par[0];
                var slider = document.getElementById(par+'_slider');
                slider.noUiSlider.updateOptions({
                    range:{
                        'max':  parseInt($('[name='+ par + '_max]').val()),
                        'min':  parseInt($('[name='+ par + '_min]').val())
                    }
                });
            });
           //document.getElementById(data.alarm_prop[i].parameter + '_slider').noUiSlider.on('update', function(values, handle){

                //switch(handle){
                    //case 0: this.target.parentNode.childNodes[2].innerHTML = 'Low Limit: ' + values[handle];
                    //break;
                    //case 1: this.target.parentNode.childNodes[4].innerHTML = 'High Limit: ' + values[handle];
                    //break;
                //}
            //});
        }else if(data.alarm_prop[i].slider_category == "threshold"){

             var threshold = document.getElementById(data.alarm_prop[i].parameter + '-threshold');

                var start = parseInt(data.alarm_prop[i].limit_high);

            if(data.alarm_prop[i].alarm_max == null){
                if(data.alarm_prop[i].slider_max == null){
                    var max = data.alarm_prop[i].limit_high;
                }else{
                    var max = data.alarm_prop[i].slider_max;
                }
            }else{
                var max = data.alarm_prop[i].alarm_max;
            }

            if(data.alarm_prop[i].alarm_min == null){
                if(data.alarm_prop[i].slider_min == null){
                    var min = data.alarm_prop[i].limit_low;
                }else{
                    var min = data.alarm_prop[i].slider_min;
                }
            }else{
                var min = data.alarm_prop[i].alarm_min;
            }





                   noUiSlider.create(threshold, {
                        start: start,
                        orientation: 'horizontal',
                        step: 0.5,
                        behaviour: 'tap',
                        tooltips:true,
                        range: {
                            'min':  parseInt(min),
                            'max':  parseInt(max)
                        },
                        pips: {
                            mode: 'count',
                            values: 2,
                            density: 5
                        }
                    });
            $('[name='+ data.alarm_prop[i].parameter + '-max]').val(max);
            $('[name='+ data.alarm_prop[i].parameter + '-min]').val(min);

            $('[name='+ data.alarm_prop[i].parameter + '-max]').keyup(function(){
                var id = $(this).parents().eq(1).attr('id');
                var par = id.split("-");
                par = par[0];
                console.log(par);
                console.log($('[name='+ par + '-max]').val());
                var slider = document.getElementById(par+'-threshold');
                slider.noUiSlider.updateOptions({
                    range:{
                        'max':  parseInt($('[name='+ par + '-max]').val()),
                        'min':  parseInt($('[name='+ par + '-min]').val())
                    }
                });
            });
            $('[name='+ data.alarm_prop[i].parameter + '-min]').keyup(function(){
                var id = $(this).parents().eq(1).attr('id');
                var par = id.split("-");
                par = par[0];
                var slider = document.getElementById(par+'-threshold');
                slider.noUiSlider.updateOptions({
                    range:{
                        'max':  parseInt($('[name='+ par + '-max]').val()),
                        'min':  parseInt($('[name='+ par + '-min]').val())
                    }
                });
            });


        }else if(data.alarm_prop[i].slider_category == "switch"){

            var switchSlider = document.getElementById(data.alarm_prop[i].parameter + '_switch');
            console.log(switchSlider);
            if(data.alarm_prop[i].limit_high == null){
                var start = 0.5;
            }else{
                var start = parseInt(data.alarm_prop[i].limit_high);
            }
                   noUiSlider.create(switchSlider, {
                        start: start,
                        orientation: 'horizontal',
                        step: 0.5,
                        behaviour: 'tap',
                        tooltips:false,
                        range: {
                            'min': 0,
                            '50%': [0.5, 0.5],
                            'max': 1
                        },
                        pips: {
                            mode: 'count',
                            values: 2,
                            density: 50
                        }
                    });
        }
    }

    //Listeners
        //minmax

        var inputs = document.getElementsByClassName('minMaxInputs');
    for(var i=0; i<inputs.length; i++){
        $('[name="'+inputs[i].name+'"]').on('change',function(){
             $(this).parents().eq(4).addClass('changed');
             document.getElementById('save').disabled=false;
            document.getElementById('clear').disabled=false;
        });
    }

        //Slider
    var sliders = document.getElementsByClassName('slider');
    for(var i=0; i<sliders.length; i++){
        document.getElementById(sliders[i].id).noUiSlider.on('change', function(){

            $(this.target).parents().eq(2).addClass('changed');
            document.getElementById('save').disabled=false;
            document.getElementById('clear').disabled=false;

            });
    }

        //Threshold
    var thresholds = document.getElementsByClassName('threshold');
    for(var i=0; i< thresholds.length; i++){
        document.getElementById(thresholds[i].id).noUiSlider.on('change', function(){

            $(this.target).parents().eq(2).addClass('changed');
            document.getElementById('save').disabled=false;
            document.getElementById('clear').disabled=false;

            });
    }

    //Switch
    var switches = document.getElementsByClassName('switch');
    for(var i=0; i<switches.length; i++){
        document.getElementById(switches[i].id).noUiSlider.on('change', function(){

            $(this.target).parents().eq(2).addClass('changed');
            document.getElementById('save').disabled=false;
            document.getElementById('clear').disabled=false;

            });
    }

    //Enablers

    var enablers = document.getElementsByClassName('enabler');
    for(var i=0; i< enablers.length; i++){
        $('#'+enablers[i].id).on('change',function(){
             $(this).parents().eq(2).addClass('changed');
             document.getElementById('save').disabled=false;
            document.getElementById('clear').disabled=false;
        });
    }
}

function saveAlarm(){

    window.dataChanged = [];
    var changed = document.getElementsByClassName('changed');

    for(var i=0; i< changed.length; i++){
        var parameter = changed[i].id;
        console.log(changed[i].id);
        var enabled = document.getElementById(parameter + '_enable').checked;
        var plot = document.getElementById(parameter + '_plot').checked;
        var categoryId = $('#'+parameter+' .card-body .controller').children(1).attr('id').split(/_/);
        var category = categoryId[1];
        var alarmMax = $('[name='+ changed[i].id + '_max]').val();
        var alarmMin = $('[name='+ changed[i].id + '_min]').val();

        if(category.includes('threshold')){

            var sliderElement = document.getElementById(parameter+ '-threshold');
            var lowLimit= '0';
            var highLimit =  sliderElement.noUiSlider.get();
            var alarmMax = $('[name='+ changed[i].id + '-max]').val(); //BEcause of _ and -
            var alarmMin = $('[name='+ changed[i].id + '-min]').val();

        }else if(category == 'slider'){

            var sliderElement = document.getElementById(parameter + '_' + category);
            var values = sliderElement.noUiSlider.get();
            var lowLimit = values[0];
            var highLimit = values[1];

        }else if(category == 'switch'){

            var sliderElement = document.getElementById(parameter + '_' + category);
            var value = sliderElement.noUiSlider.get();
            var lowLimit = '0';
            if(value == '0.50'){
                var highLimit = null;
            }else{
                var highLimit = value;
            }


        }

        dataChanged[i] = {"device_id": device_id,
        "parameter": parameter,
         "enabled": +enabled,
         "plot_limit": +plot,
          "category":category,
           "limit_low": lowLimit,
            "limit_high": highLimit,
             "username": username,
                "alarm_max": alarmMax,
                "alarm_min": alarmMin};




    }

//Fill into modal

document.getElementById('bodySummaryTable').innerHTML=``;


var tr=[];
for (var i = 0; i < dataChanged.length; i++) {
    if(dataChanged[i].enabled == "1"){
        var enabled = 'True';
    }else if(dataChanged[i].enabled == "0"){
        var enabled = 'False';
    }
    if(dataChanged[i].plot == "1"){
        var plot = 'True';
    }else if(dataChanged[i].plot == "0"){
        var plot = 'False';
    }
        tr.push('<tr>');
        tr.push("<td>" + $('#'+dataChanged[i].parameter +' div a').html() + "</td>");
        tr.push("<td>" + enabled + "</td>");
        tr.push("<td>" + plot + "</td>");
        tr.push("<td>" + dataChanged[i].limit_low + "</td>");
        tr.push("<td>" + dataChanged[i].limit_high + "</td>");
        tr.push('</tr>');
    }
$('#bodySummaryTable').append($(tr.join('')));

$('#summary').modal('show');

}

function submitToSaveAlarm(){
    var data = {"data": dataChanged};
    document.getElementById('confirmAlarm').disabled = true;
    var spinner = document.getElementById('modalSpinner');
    spinner.classList.add('lds-roller');

      $.ajax({

        type: "POST",
        url: "https://api.cl-ds.com/saveAlarmSetting/",
        headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            document.getElementById('confirmAlarm').disabled = false;
            var spinner = document.getElementById('modalSpinner');
            spinner.classList.remove('lds-roller');

            document.getElementById('alertSuccesAlarm').innerHTML = data.message;
            $('#summary').modal('hide');
            $('#alertSuccesAlarm').fadeIn();

            var exChanged = document.getElementsByClassName('changed');
            for(var i=0; i<exChanged.length; i++){
                exChanged[i].classList.remove('changed');
            }
            document.getElementById('save').disabled = true;
            document.getElementById('clear').disabled = true;
        },
        error: function(request, status, error) {
            document.getElementById('confirmAlarm').disabled = false;
            var spinner = document.getElementById('modalSpinner');
            spinner.classList.remove('lds-roller');

            document.getElementById("alertFailAlarm").style.display = "block";
            document.getElementById('alertFailAlarm').innerHTML = request.responseJSON.message;
            $('#summary').modal('hide');
            $('#alertFailAlarm').fadeIn();


        }
    });
}

function clearAlarm(){


            document.getElementById('save').disabled = true;
            document.getElementById('clear').disabled = true;
            $('#alertSuccesAlarm').fadeOut();
            $('#alertFailAlarm').fadeOut();


     renderConfigAlarm(alarmData);

}
function requestNodeInfo(){
        $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getNodeInfo/' + device_id + '/?format=json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    $("#serial").val(data.serial);
                    $("#sensor").val(data.sensor);
                    $("#tagname").val(data.tag_name);
                    $("#locationname").val(data.location_name);
                    $("#longitude").val(data.longitude);
                    $("#latitude").val(data.latitude);
                    $("#address").val(data.address);
                    $("#premise").val(data.premise);
                    document.getElementById("tagname_header").innerHTML = data.tag_name; 
                }

            });
}

function removeNode(){
    document.getElementById('removeNodeButton').innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    var usernameRemoveNode = $('[name=username]').val();
    var password = $('[name=password]').val();


   var data = {"device_id": device_id, "username": usernameRemoveNode, "password":password};

    $.ajax({
                type: "DELETE",
                url: 'https://api.cl-ds.com/deleteNode',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(resp){
                    document.getElementById('removeNodeButton').innerHTML = `Remove Node`;
                    if(resp.success){
                        alert('Removed Successfully');
                        setTimeout(function() {
                              window.location.href = '/';
                            }, 800);
                    }else{
                         alert('Failed to remove');
                    }
                },
                error: function(request, status, error){
                    document.getElementById('removeNodeButton').innerHTML = `Remove Node`;
                    alert(request.responseJSON.message);
                }
            });

}


function saveNodeProfile(){
    $("#saveNodeProfile").html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    $("#saveNodeProfile").attr("disabled", true);

                    var serial = $("#serial").val();
                    var sensor = $("#sensor").val();
                    var tagname = $("#tagname").val();
                    var location = $("#locationname").val();
                    var longitude = $("#longitude").val();
                    var latitude = $("#latitude").val();
                    var address = $("#address").val();
                    var premise = $("#premise").val();

    var data = {
        "serial": serial,
        "sensor": sensor,
        "tag_name": tagname,
        "location_name": location,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "premise": premise
    }

    $.ajax({
                type: "PUT",
                url: 'https://api.cl-ds.com/saveNodeInfo/' + device_id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(resp){
                    $("#saveNodeProfile").html('Save changes');
                    $("#saveNodeProfile").attr("disabled", false);

                    alert('Success saved');
                }
            });
}
