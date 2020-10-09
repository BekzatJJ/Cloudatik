        window.mapData= {};
        window.mapMarkers = {};

function mapClickEvent(){
            var dash = document.getElementById('section_Dashboard');
            var map = document.getElementById('map-content');

            dash.setAttribute('style', 'display:none');
            map.setAttribute('style', 'display:block');

    if(Object.keys(mapData).length == 0 && $('#mapWrapper').length){
        callMap();
    }

}


function callMap(){
     $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getUserMap/'+username +'/?format=json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    console.log('map updated');
                    mapData = data;
                    var spinner = document.getElementById('mapSpinner');
                    spinner.classList.remove('lds-roller');
                    document.getElementById('mapWrapper').setAttribute('style', 'display:block;');
                    mapSet(data);
                }

            });
}

function mapSet(data){
    document.getElementById('mapWrapper').innerHTML = `<div id="map" style="height: calc(100vh - 100px);"></div>`;
    var map = L.map('map').setView([5.3249, 100.2807], 50);
             L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);

    L.easyButton('fa fa-crosshairs', function(btn, map){
            map.setView(markers.getBounds().getCenter());
             map.fitBounds(markers.getBounds());
        }).addTo(map);

    var markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        spiderfyDistanceMultiplier: 2,
        iconCreateFunction: function (cluster) {
            var markers = cluster.getAllChildMarkers();
            var statusAll = true; //all markers are online
            var alarm = "";
            //Status
            for(var i=0; i< markers.length; i++){
                var className = markers[i].options.icon.options.className;
                if(markers[i].options.icon.options.className == 'my-div-icon-off ' || markers[i].options.icon.options.className == 'my-div-icon-off alarm'){
                    statusAll = false;
                }

                if(className.match(new RegExp("\\balarm\\b")) != null){
                    alarm = " blink-alarm";
                }
            }

            if(statusAll){
                var html = '<div><span style="">' + markers.length + '</span></div>';
                return L.divIcon({ html: html, className: 'marker-cluster marker-cluster-small' + alarm, iconSize: L.point(40, 40) });
            }else{
                var html = '<div><span style="">' + markers.length + '</span></div>';
                return L.divIcon({ html: html, className: 'marker-cluster marker-cluster-large' + alarm, iconSize: L.point(40, 40) });
            }

        }
    });

    for(var i=0; i< data.node.length; i++){
        var alarm = "";

        for(var x=0; x< data.alarm.length; x++){
            if(data.node[i].serial == data.alarm[x].serial){
                alarm = "alarm"
            }
        }

        var lat = data.node[i].location_lat;
        var long = data.node[i].location_long;

        if(lat == null || long == null){
            lat = "6.075008";
            long = "102.669476";
        }
        if(data.node[i].last_update == null){
            mapMarkers["marker_"+data.node[i].serial] = L.marker(new L.LatLng(lat, long),{
                icon: new L.DivIcon({
                    className: 'my-div-icon-off '+ alarm,
                    html: '<span class="'+data.node[i].serial+'_'+data.node[i].device_id+'">'+ data.node[i].serial +'</span>'
                })
            });
        }else if(moment(data.node[i].last_update).add(8, 'hours').format() < moment().subtract(10,'minutes').format()){
           mapMarkers["marker_"+data.node[i].serial] = L.marker(new L.LatLng(lat, long),{
                icon: new L.DivIcon({
                    className: 'my-div-icon-off '+ alarm,
                    html: '<span class="'+data.node[i].serial+'_'+data.node[i].device_id+'">'+ data.node[i].serial +'</span>'
                })
            });
        }else{
           mapMarkers["marker_"+data.node[i].serial] = L.marker(new L.LatLng(lat, long),{
                icon: new L.DivIcon({
                    className: 'my-div-icon-on '+alarm,
                    html: '<span class="'+data.node[i].serial+'_'+data.node[i].device_id+'">'+ data.node[i].serial +'</span>'
                })
            });
        }

        mapMarkers["marker_"+data.node[i].serial].on('click', function(e){
            var str = e.target._popup._content;
            var str2 = e.target.options.icon.options.html;
            str2 = str2.split(/"/);
            var credentials = str2[1];
            credentials = credentials.split(/_/);
            var serial = credentials[0];
            var id = credentials[1];
            console.log(serial);
            console.log(id);
            mapMarkers["marker_"+serial]._popup.setContent('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
            callMapData(id);

        });
        markers.addLayer(mapMarkers["marker_"+data.node[i].serial]);
        mapMarkers["marker_"+data.node[i].serial].bindPopup("<div class='" + data.node[i].device_id + "'></div>").openPopup();
    }

             map.addLayer(markers);
             map.setView(markers.getBounds().getCenter());
             map.fitBounds(markers.getBounds());
}

//Data
function callMapData(id){
    //Data
            $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getAlarm/' + id + '/?format=json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(alarm){
                    dataAlarm = alarm;
                                             $.ajax({
                                                    type: "GET",
                                                    url: 'https://api.cl-ds.com/getDashboardDataV3/' + id + '/',
                                                    headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                                                    //data: "check",
                                                    success: function(data){
                                                        var html = `<span>`+data.chart_prop[0].serial+`</span> <br>
                                                        <span>Last update: `+moment(data.data.datetime).calendar() +`</span><br><br>`;

                                                        for(var i=0; i<data.chart_prop.length; i++){
                                                            if(data.chart_prop[i].chart_title == null){
                                                                var label = data.chart_prop[i].label;
                                                            }else{
                                                                var label = data.chart_prop[i].chart_title;
                                                            }
                                                            var val = parseFloat(data.data[data.chart_prop[i].parameter]);

                                                            //Alarm lookfor

                                                            html += `<tr><td style="padding: 0px; padding-right: 2px; vertical-align: middle;">`+label+`</td>
                                                                    <td style="padding: 0px; padding-right: 2px; vertical-align: middle;">  `+ val.toFixed(2) +`</td>
                                                                    <td style="padding: 0px; padding-right: 2px; vertical-align: middle;"><button class="btn" data-toggle="popoverClick" title="Alarm Details" data-content="No alarm details">Details</button></td>
                                                                    <td style="padding: 0px; padding-right: 2px; vertical-align: middle;><button class="btn">ack</button></td></tr>`
                                                        }
                                                        var table = `
                                                            <table class="table">
                                                               <tbody>`+
                                                                    html +
                                                               `</tbody>
                                                            </table>
                                                        `;
                                                        mapMarkers["marker_" + data.chart_prop[0].serial]._popup.setContent(table);
                                                        $('[data-toggle="popoverClick"]').popover();
                                                    }

                                                });
                }
            });



    //Alarm

}


//Update one min
/*setInterval(function(){

    if(document.getElementById('map-content').style.display === 'block' && $('#mapWrapper').length){
        //Request Ajax
        callMap();
    }else{
        console.log('not active Map');
    }




}, 60000);*/
