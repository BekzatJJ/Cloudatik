
//Dynamic Functions

function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
function moveChart(chart, newData, newtime) {
    var data = chart.data.datasets[0].data;
    var labels = chart.data.labels
    data.push(newData);    // add the new value to the right
    labels.push(moment(newtime).format('h:mm a'));
    labels.shift();
    data.shift();        // remove the first left value
    chart.update();
}

setInterval(function(){

var nodes = document.getElementsByClassName('node');

for(var b=0; b< nodes.length; b++){
    if(ajaxNodeProcess[nodes[b].id] == false){

    }else if(document.getElementById('section_'+nodes[b].id).style.display === 'block'){
        //Request Ajax
         $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardData/' + nodes[b].id + '/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    //addData(stackedLine, moment().format('LT'), data[0].data.v)

                    //console.log('Updated: '+ data[0].serial);
                    for(var i=0; i< data.length; i++){
                        var chartTemp = 'chart_' + data[i].id;
                        var lcdId = 'lcd_'+data[i].id;
                        moveChart(chartObject[chartTemp], data[i].data[data[i].parameter], data[i].data.datetime);
                        setLastValue(lcd[lcdId], parseFloat(data[i].data[data[i].parameter]));
                    }


                     if(moment(data[0].data.datetime).format('h:mm a') < moment().subtract(10, 'minutes').format('h:mm a')){

                        setLED('canvasLed_'+ data[0].serial, false);
                        setLED('dashboardLed_'+ data[0].serial, false);
                        $('#lastUpdate_'+data[0].serial).text('Last update: ' + moment(data[0].data.datetime).calendar());
                    }else{setLED('canvasLed_'+ data[0].serial, true);
                        setLED('dashboardLed_'+ data[0].serial, true);
                        $('#lastUpdate_'+data[0].serial).text('Last update: ' + moment(data[0].data.datetime).calendar());}


                }
            });
    }
}


}, 60000);
