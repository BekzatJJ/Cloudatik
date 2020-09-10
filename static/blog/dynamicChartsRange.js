
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
    labels.push(moment(newtime).format('MM/DD/YYYY h:mm:ss a'));
    //labels.shift();
    //data.shift();        // remove the first left value

    //if(newData > chart.config.options.scales.yAxes[0].ticks.max){
       //chart.config.options.scales.yAxes[0].ticks.max += chart.config.options.scales.yAxes[0].ticks.max*0.10;
    //}else if(newData < chart.config.options.scales.yAxes[0].ticks.min){
        //chart.config.options.scales.yAxes[0].ticks.min -= chart.config.options.scales.yAxes[0].ticks.min*0.10;
    //}
    chart.update();
}

setInterval(function(){



        //Request Ajax
         $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardData/O2ZENT/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    //addData(stackedLine, moment().format('LT'), data[0].data.v)

                    //console.log('Updated: '+ data[0].serial);
                    for(var i=0; i< data.length; i++){
                        var chartTemp = 'chart_' + data[i].id;
                        var lcdId = 'lcd_'+data[i].id;
                        moveChart(chartObject[chartTemp], data[i].data[data[i].parameter], data[i].data.datetime);

                        if(typeof data[i].data[data[i].parameter] === 'boolean' ){
                            setLastValue(lcd[lcdId], data[i].data[data[i].parameter]);
                          }else{
                            setLastValue(lcd[lcdId], parseFloat(data[i].data[data[i].parameter]));
                          }

                    }



                }
            });




}, 60000);
