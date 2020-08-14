//initialize
var single1;
var singleW;
var singleEnergy;
var singleAmp;

var stackedLineWatt;
var stackedLineEnergy;
//Second Node
var dataTemp;
var stackedLineTemp;
var stackedLineHumid;
var singleTemp;
var singleHumid;

//All Charts declare
/*var ctx = document.getElementById('myChart').getContext('2d');
var ctx2 = document.getElementById('myChart2').getContext('2d');
var ctx3 = document.getElementById('consumChart').getContext('2d');
var ctx4 = document.getElementById('myChartTemp').getContext('2d');
var ctx5 = document.getElementById('myChartHumid').getContext('2d');
var ctx6 = document.getElementById('myChartWatt').getContext('2d');
var ctx7 = document.getElementById('myChartEnergy').getContext('2d');*/


//Charts Options
var optionsVolt ={
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
                            beginAtZero: true,
                            min: 230,
                            max: 260,
                            stepSize: 5
                                },
                        scaleLabel: {
                            display:true,
                            labelString: 'Voltage (V)'
                                }
                        }]

                    }
    };
var optionsAmp ={
                legend: {
                    display: false,
                    position: 'top',
                    labels:{
                        boxWidth: 80,
                        ontColor: 'black'
                        }
                    },
                 scales:{

                    yAxes: [{
                        scaleLabel: {
                            display:true,
                            labelString: 'Current (A)'
                            }
                        }]

                    }


};

var optionsWatts ={
                legend: {
                    display: false,
                    position: 'top',
                    labels:{
                        boxWidth: 80,
                        ontColor: 'black'
                        }
                    },
                scales:{

                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 50,
                            stepSize: 5
                                },
                        scaleLabel: {
                            display:true,
                            labelString: 'Power (W)'
                                }
                        }]

                    }
    };

    var optionsEnergy ={
                legend: {
                    display: false,
                    position: 'top',
                    labels:{
                        boxWidth: 80,
                        ontColor: 'black'
                        }
                    },
                scales:{

                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 140,
                            max: 100,
                            stepSize: 5
                                },
                        scaleLabel: {
                            display:true,
                            labelString: 'Energy (kWh)'
                                }
                        }]

                    }
    };

var optionsTemp ={
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
                    beginAtZero: true,
                    min: 10,
                    max: 50,
                    stepSize: 5
                    },
                scaleLabel: {
                    display:true,
                    labelString: 'Temperature (C)'
                    }
                }]

            }


    };
var optionsHumid ={
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
                                        beginAtZero: true,
                                        min: 0,
                                        max: 100,
                                        stepSize: 5
                                    },
                                    scaleLabel: {
                                        display:true,
                                        labelString: 'Humidity'
                                    }
                                }]

                            }


                        };

var dataConsum = {
                            labels: [moment().subtract(7, 'days').format('YYYY-MM-DD'),
                             moment().subtract(6, 'days').format('YYYY-MM-DD'),
                              moment().subtract(5, 'days').format('YYYY-MM-DD'),
                              moment().subtract(4, 'days').format('YYYY-MM-DD'),
                              moment().subtract(3, 'days').format('YYYY-MM-DD'),
                              moment().subtract(2, 'days').format('YYYY-MM-DD'),
                              moment().subtract(1, 'days').format('YYYY-MM-DD')],
                            datasets:[{
                                label: 'Spending (RM)',
                                data: [],
                                fill: false,
                                lineTension: 0.5,
                                borderColor: 'rgba(151, 190, 252,0.8)'
                            }]
                        };
var optionsConsum ={
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
                                        beginAtZero: true,
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1
                                    },
                                    scaleLabel: {
                                        display:true,
                                        labelString: 'Spending (RM)'
                                    }
                                }]

                            }


                        }

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

/*setInterval(function(){

    $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardData/O2ZENT/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    //addData(stackedLine, moment().format('LT'), data[0].data.v)
                    moveChart(stackedLine, data[0].data.v, data[0].data.datetime);
                    setLastValue(single1, parseFloat(data[0].data.v));

                    moveChart(stackedLine2, data[1].data.a, data[1].data.datetime);
                    setLastValue(singleAmp, parseFloat(data[1].data.a));

                    moveChart(stackedLineWatt, data[2].data.w, data[2].data.datetime);
                    setLastValue(singleW, parseFloat(data[2].data.w));

                    moveChart(stackedLineEnergy, data[3].data.kwh_n, data[3].data.datetime);
                    setLastValue(singleEnergy, parseFloat(data[3].data.kwh_n));




                     if(moment(data[0].data.datetime).format('h:mm a') < moment().subtract(10, 'minutes').format('h:mm a')){

                        setLED('canvasLed1', false);
                        setLED('canvasLed11', false);
                        $('#lastUpdate').text('Last update: ' + moment(data[0].data.datetime).calendar());
                    }else{setLED('canvasLed1', true);
                          setLED('canvasLed11', true);
                          $('#lastUpdate').text('Last update: ' + moment(data[0].data.datetime).calendar());}


                }
            });
}, 60000);*/
