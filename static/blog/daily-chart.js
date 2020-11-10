  $(document).ready(function(){
    callAPI();

  });

function callAPI(){
      $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardChartData/O4mJwE/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    var spinnerNode = document.getElementById('chart-spinner');
                    spinnerNode.classList.remove('lds-roller');
                    //callChart(data);
                    callChartV(data);
                    rain(data);
                }
            });
};




function callChartV(data){

 Chart.defaults.groupableBar = Chart.helpers.clone(Chart.defaults.bar);

var helpers = Chart.helpers;
Chart.controllers.groupableBar = Chart.controllers.bar.extend({
  calculateBarX: function (index, datasetIndex) {
    // position the bars based on the stack index
    var stackIndex = this.getMeta().stackIndex;
    return Chart.controllers.bar.prototype.calculateBarX.apply(this, [index, stackIndex]);
  },

  hideOtherStacks: function (datasetIndex) {
    var meta = this.getMeta();
    var stackIndex = meta.stackIndex;

    this.hiddens = [];
    for (var i = 0; i < datasetIndex; i++) {
      var dsMeta = this.chart.getDatasetMeta(i);
      if (dsMeta.stackIndex !== stackIndex) {
        this.hiddens.push(dsMeta.hidden);
        dsMeta.hidden = true;
      }
    }
  },

  unhideOtherStacks: function (datasetIndex) {
    var meta = this.getMeta();
    var stackIndex = meta.stackIndex;

    for (var i = 0; i < datasetIndex; i++) {
      var dsMeta = this.chart.getDatasetMeta(i);
      if (dsMeta.stackIndex !== stackIndex) {
        dsMeta.hidden = this.hiddens.unshift();
      }
    }
  },

  calculateBarY: function (index, datasetIndex) {
    this.hideOtherStacks(datasetIndex);
    var barY = Chart.controllers.bar.prototype.calculateBarY.apply(this, [index, datasetIndex]);
    this.unhideOtherStacks(datasetIndex);
    return barY;
  },

  calculateBarBase: function (datasetIndex, index) {
    this.hideOtherStacks(datasetIndex);
    var barBase = Chart.controllers.bar.prototype.calculateBarBase.apply(this, [datasetIndex, index]);
    this.unhideOtherStacks(datasetIndex);
    return barBase;
  },

  getBarCount: function () {
    var stacks = [];

    // put the stack index in the dataset meta
    Chart.helpers.each(this.chart.data.datasets, function (dataset, datasetIndex) {
      var meta = this.chart.getDatasetMeta(datasetIndex);
      if (meta.bar && this.chart.isDatasetVisible(datasetIndex)) {
        var stackIndex = stacks.indexOf(dataset.stack);
        if (stackIndex === -1) {
          stackIndex = stacks.length;
          stacks.push(dataset.stack);
        }
        meta.stackIndex = stackIndex;
      }
    }, this);

    this.getMeta().stacks = stacks;
    return stacks.length;
  },
});

Chart.Tooltip.positioners.custom = function(elements, eventPosition) {
    /** @type {Chart.Tooltip} */
    var tooltip = this;

    /* ... */

    return {
        x: eventPosition.x,
        y: eventPosition.y
    };
}



for (var w=0; w<data.chart_prop.length; w++){
  var mainLabels =[];
    for(var b=data.day_plot-1; b>-1; b--){
      mainLabels.push(moment().subtract(b, 'days').format('DD/MM')+ ' (' + moment().subtract(b, 'days').format('ddd')+')');
    }
    var datasets = [];
    var time = ['day', 'midnight', 'morning', 'afternoon', 'evening'];
    var timeLabels = [];
    console.log(moment().subtract(data.day_plot-1, 'days').format('YYYY-MM-DD'));
  for(var a=0; a<time.length; a++){
    for(var i=1; i<=4; i++){
    var tempDataset = {};
    var arrData = [];
      if(eval('data.chart_prop[w].parameter0'+i) != null){
              switch(i){
                case 1: var color = 'rgba(233,214,98,0.6)';break;
                case 2: var color = 'rgba(12,255,63,0.6)';break;
                case 3: var color = 'rgba(142,112,53,0.6)';break;
                case 4: var color = 'rgba(43,187,1,0.6)';break;
              }
              var parameter = eval('data.chart_prop[w].parameter0'+i);
              tempDataset.label = eval('data.chart_prop[w].label0'+i);
              var tempCount = 0;
              for(var b=data.day_plot-1; b>-1; b--){
                var dateCurrent = moment().subtract(b, 'days').format('YYYY-MM-DD');
                var pushData = null;
                for(var x=0; x<data.data.length; x++){

                  if(data.data[x].date == dateCurrent && data.data[x].time == time[a]){
                    var pushData = data.data[x][parameter];
                  }
                }
                arrData[tempCount] = pushData;
                tempCount++;
              }
              tempDataset.data = arrData;
              tempDataset.backgroundColor = color;
              tempDataset.stack = a+1;
              tempDataset.xAxisID = 'x-axis-1';
              tempDataset.yAxisID = 'y-axis-0';
              tempDataset.barPercentage = 0.7;
              tempDataset.categoryPercentage = 1;
              datasets.push(tempDataset);

      }

    }
  }

  for(var i=0; i<mainLabels.length; i++){

    for(var a=0; a< time.length; a++){
      timeLabels.push(time[a]);
    }
  }
console.log(timeLabels);
console.log(datasets);

    var canvas = document.createElement('canvas');
    canvas.id = w;
    canvas.width = '400';
    canvas.height = '100';
    canvas.style.marginTop = '50px';
    document.getElementById('canvasWrapper').append(canvas);

    //stack or overlay
    if(data.chart_prop[w].chart_category == "Stacked"){
      var stacked = true;
    }else{
      var stacked = false;
    }

    var ctx = document.getElementById(w);

    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
           labels: mainLabels,
            datasets: datasets
        },
        options: {

            legend:{display: false},
              tooltips: {
                mode: 'single',
                position: 'nearest',
                callbacks: {
                  label: function(tti, data){
                    console.log(tti);
                    var stack = data.datasets[tti.datasetIndex].stack;
                    var dataArray = [];
                    var str = [];
                    for(var i=0; i<data.datasets.length; i++){
                      if(data.datasets[i].stack == stack){
                        dataArray.push(data.datasets[i]);
                      }
                    }
                    console.log(dataArray);
                    for(var i=0; i< dataArray.length; i++){
                      str.push(dataArray[i].label+': ' + dataArray[i].data[tti.index]);
                    }
                    return str
                  }
                }
              },
            scales: {
                     xAxes: [{
                      labels: timeLabels,
                      ticks: {
                          autoSkip: false,
                          maxRotation: 90,
                          minRotation: 90
                      }
                     },{
                     stacked: true,
                      type: 'category',
                      id: 'x-axis-1',
                      offset: true,

                      gridLines: {
                        offsetGridLines: true,
                        lineWidth: 4
                      }}],
                yAxes: [{
                  stacked: stacked,
                        type: 'linear',
                        ticks: {
                          beginAtZero:false
                        },
                        gridLines: {
                          display: false,
                          drawTicks: true,
                        },
                        id: 'y-axis-0'
                }]
            },

          /*animation: {
            onComplete: function () {
              var chartInstance = this.chart;
              var ctx = chartInstance.ctx;
              console.log(chartInstance);
              var height = chartInstance.controller.boxes[0].bottom;
              ctx.textAlign = "center";
              Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function (bar, index) {
                  ctx.fillText(dataset.data[index], bar._model.x, bar._model.y);
                }),this)
              }),this);
            }
          }*/
        }
    });
}


  }




function rain(data){
      var mainLabels = ['day', 'midnight', 'morning', 'afternoon', 'evening']
    var datasets = [];
    var days = [];
    var dayLabels = [];
    var stack = 0;
    console.log(moment().subtract(data.day_plot-1, 'days').format('YYYY-MM-DD'));
  for(var b=data.day_plot-1; b>-1; b-- ){
    stack++;
    var dateCurrent = moment().subtract(b, 'days').format('YYYY-MM-DD');
    days.push(moment(dateCurrent).format('DD/MM'));
    for(var i=1; i<=4; i++){
    var tempDataset = {};
    var arrData = [];
      if(eval('data.chart_prop[1].parameter0'+i) != null){
              switch(i){
                case 1: var color = 'rgba(233,214,98,0.6)';break;
                case 2: var color = 'rgba(12,255,63,0.6)';break;
                case 3: var color = 'rgba(142,112,53,0.6)';break;
                case 4: var color = 'rgba(43,187,1,0.6)';break;
              }
              var parameter = eval('data.chart_prop[1].parameter0'+i);
              tempDataset.label = eval('data.chart_prop[1].label0'+i);
              for(var a=0; a<mainLabels.length; a++){
                var pushData = null;
                for(var x=0; x<data.data.length; x++){

                  if(data.data[x].date == dateCurrent && data.data[x].time == mainLabels[a]){
                    var pushData = data.data[x][parameter];
                  }
                }
                arrData[a] = pushData;
              }
              tempDataset.data = arrData;
              tempDataset.backgroundColor = color;
              tempDataset.stack = stack;
              tempDataset.xAxisID = 'x-axis-1';
              if(i==2){
                tempDataset.yAxisID = 'y-axis-2';
              }else{
                tempDataset.yAxisID = 'y-axis-1';
              }

              tempDataset.barPercentage = 0.7;
              tempDataset.categoryPercentage = 1;
              datasets.push(tempDataset);

      }

    }
  }

  for(var i=0; i<mainLabels.length; i++){

    for(var a=0; a< days.length; a++){
      dayLabels.push(days[a]);
    }
  }
console.log(dayLabels);
console.log(datasets);




    var ctx = document.getElementById('vBar');

    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
           labels: mainLabels,
            datasets: datasets
        },
        options: {

            legend:{display: false},
              tooltips: {
                mode: 'single',
                position: 'nearest',
                callbacks: {
                  label: function(tti, data){
                    console.log(tti);
                    var stack = data.datasets[tti.datasetIndex].stack;
                    var dataArray = [];
                    var str = [];
                    for(var i=0; i<data.datasets.length; i++){
                      if(data.datasets[i].stack == stack){
                        dataArray.push(data.datasets[i]);
                      }
                    }
                    console.log(dataArray);
                    for(var i=0; i< dataArray.length; i++){
                      str.push(dataArray[i].label+': ' + dataArray[i].data[tti.index]);
                    }
                    return str
                  }
                }
              },
            scales: {
                     xAxes: [{
                      labels: dayLabels
                     },{
                     stacked: true,
                      type: 'category',
                      id: 'x-axis-1',
                      offset: true,
                      gridLines: {
                        offsetGridLines: true
                      }}],
                yAxes: [{
                  stacked: false,
                        type: 'linear',
                        ticks: {
                          beginAtZero:false
                        },
                        gridLines: {
                          display: false,
                          drawTicks: true,
                        },
                        position: 'left',
                        id: 'y-axis-1'
                },

                {
                  stacked: false,
                        type: 'linear',
                        ticks: {
                          beginAtZero:false
                        },
                        gridLines: {
                          display: false,
                          drawTicks: true,
                        },
                        position: 'right',
                        id: 'y-axis-2'
                }]
            },

          /*animation: {
            onComplete: function () {
              var chartInstance = this.chart;
              var ctx = chartInstance.ctx;
              console.log(chartInstance);
              var height = chartInstance.controller.boxes[0].bottom;
              ctx.textAlign = "center";
              Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function (bar, index) {
                  ctx.fillText(dataset.data[index], bar._model.x, bar._model.y);
                }),this)
              }),this);
            }
          }*/
        }
    });
}
