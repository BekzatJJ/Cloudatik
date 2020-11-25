

function callDailyChart(id){
      $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getDashboardChartData/'+id+'/',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){

                    //callChart(data);
                    callChartV(data, id);

                }
            });
};




function callChartV(data, id){

for (var w=0; w<data.chart_prop.length; w++){
  var mainData = {};
  var mainLabels =[];
    for(var b=data.day_plot-1; b>-1; b--){
      mainLabels.push(moment().subtract(b, 'days').format('MM/DD')+ ' (' + moment().subtract(b, 'days').format('ddd')+')');
    }
    var datasets = [];
    if(data.chart_prop[w].period == null){
      var time = ['day', 'midnight', 'morning', 'afternoon', 'evening'];
    }else{
      var time = data.chart_prop[w].period.split(/, /);
    }

    //count parameters
    var parameter_count=0;
    for(var b=1; b>0; b++){
      if(data.chart_prop[w].hasOwnProperty("parameter0"+b)){
        parameter_count++;
      }else{
        break;
      }
    }

console.log(mainLabels);
console.log(parameter_count);

for(var i=0; i<mainLabels.length; i++){
  var tempData = {};
  for(var b=0; b<time.length; b++){
    var tempParamData ={};
    for(var c=1; c<=parameter_count; c++){
      if(eval('data.chart_prop[w].parameter0'+c) != null){
        var date = mainLabels[i].split(/ /)[0] + '/'+ moment().format('YYYY');
        date = moment(date).format('YYYY-MM-DD');
        for(var x=0; x<data.data.length; x++){
          if(data.data[x].date == date && data.data[x].time == time[b]){
            tempParamData[eval('data.chart_prop[w].label0'+c)] = data.data[x][eval('data.chart_prop[w].parameter0'+c)];
          }
        }

      }

    }
    tempData[time[b]] = tempParamData;
  }
  mainData[mainLabels[i]] =  tempData;
}
  var parametersConfig = {};
 for(var c=1; c<=parameter_count; c++){
  if(eval('data.chart_prop[w].parameter0'+c) !== null){
    parametersConfig[eval('data.chart_prop[w].label0'+c)] = {
      axis: eval('data.chart_prop[w].axis0'+c),
      unit: eval('data.chart_prop[w].unit0'+c)
    };
  }

 }
 var chartConfig = {
  chart_category: eval('data.chart_prop[w].chart_category'),
  chart_title:  eval('data.chart_prop[w].chart_title'),
  priority: eval('data.chart_prop[w].priority'),
  parameters: parametersConfig
 };
console.log(mainData);


    callAmChart(id,mainData,  mainLabels, time, w, chartConfig);




}

}

function callAmChart(id, data, mainLabels, time, w, chartConfig) {
//<div id="chartdiv" style="width: 100%; height:500px;"></div>

var parent = document.getElementById('am_'+id);
var child = document.createElement('div');
child.id = 'chart_'+w+'_'+id;
child.style.width = '100%';
child.style.height = '500px';

parent.appendChild(child);
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create('chart_'+w+'_'+id, am4charts.XYChart);

// some extra padding for range labels
chart.paddingBottom = 50;

chart.cursor = new am4charts.XYCursor();
chart.cursor.lineX.disabled = false;
chart.cursor.lineY.disabled = false;
//chart.cursor.maxTooltipDistance = -1;
chart.scrollbarX = new am4core.Scrollbar();
chart.logo.disabled = true;
chart.responsive.enabled = true;

chart.responsive.rules.push({
  relevant: function(target) {
      if (target.pixelWidth <= 766) {
        return true;
      }
      return false;
  },
  state: function(target, stateId) {

    if (target instanceof am4charts.Chart) {
      var state = target.states.create(stateId);
      state.properties.paddingTop = 0;
      state.properties.paddingRight = 15;
      state.properties.paddingBottom = 5;
      state.properties.paddingLeft = 15;
      return state;
    }

    if (target instanceof am4core.Scrollbar) {
      var state = target.states.create(stateId);
      state.properties.start = 0.79;
      state.properties.keepSelection = true;
      return state;
    }

    if (target instanceof am4charts.Legend) {
      var state = target.states.create(stateId);
      state.properties.paddingTop = 0;
      state.properties.paddingRight = 0;
      state.properties.paddingBottom = 0;
      state.properties.paddingLeft = 0;
      state.properties.marginLeft = 0;
      return state;
    }


    return null;
  }
});


//title
var topContainer = chart.chartContainer.createChild(am4core.Container);
topContainer.layout = "absolute";
topContainer.toBack();
topContainer.paddingBottom = 15;
topContainer.width = am4core.percent(100);

var title = topContainer.createChild(am4core.Label);
title.text = chartConfig.chart_title;
title.fontWeight = 600;
title.align = "center";
// will use this to store colors of the same items
var colors = {};

var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.grid.template.location = 0;
categoryAxis.dataItems.template.text = "{realName}";
categoryAxis.renderer.labels.template.rotation = -90;
categoryAxis.renderer.labels.template.horizontalCenter = "right";
categoryAxis.renderer.labels.template.verticalCenter = "middle";
categoryAxis.adapter.add("tooltipText", function(tooltipText, target){
  return categoryAxis.tooltipDataItem.dataContext.realName;
})

var axes = {};
var series = {};
var shiftPixels = -5;
var axisCount = 0;
for(var parameter in chartConfig.parameters){
  //yAxes
  if(!axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)]){
    if(axisCount == 0){
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)] = chart.yAxes.push(new am4charts.ValueAxis());
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].tooltip.disabled = false;
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].title.text = chartConfig.parameters[parameter].unit;
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].extraMax = 0.2;
    }else{
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)] = chart.yAxes.push(new am4charts.ValueAxis());
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].tooltip.disabled = false;
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].title.text = chartConfig.parameters[parameter].unit;
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].renderer.opposite = 'opposite';
      axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)].extraMax = 0.2;
    }
     axisCount++;
  }

  //series
  series[parameter] = chart.series.push(new am4charts.ColumnSeries());
  series[parameter].columns.template.width = am4core.percent(30);
  series[parameter].tooltipText = "{provider}: "+parameter+", {valueY}";;
  series[parameter].dataFields.categoryX = "category";
  series[parameter].dataFields.valueY = parameter;

  series[parameter].columns.template.column.cornerRadiusTopLeft = 2;
  series[parameter].columns.template.column.cornerRadiusTopRight = 2;

  series[parameter].yAxis = axes['yAxis'+ eval(chartConfig.parameters[parameter].axis)];
  if(chartConfig.chart_category == 'Overlay'){
      series[parameter].clustered = false;
      series[parameter].columns.template.dx = shiftPixels;
      shiftPixels += 5;
  }else if(chartConfig.chart_category == 'Stack'){
       series[parameter].stacked = true;
  }



  }

console.log(series);
var counter = 0;
var brightness = 0;
for(var parameter in chartConfig.parameters){

    switch(counter){
      case 0:      series[parameter].columns.template.adapter.add("fill", function(fill, target) {
                   var name = target.dataItem.dataContext.realName;
                   var item = target.dataItem.dataContext.itemName;
                   if (!colors[name]) {
                      chart.colors.step = 3;
                     colors[name] = chart.colors.next();
                   }
                   target.stroke = colors[name];
                   return colors[name];
                  }); break;
      case 1:     series[parameter].columns.template.adapter.add("fill", function(fill, target) {
                   var name = target.dataItem.dataContext.realName;
                   var item = target.dataItem.dataContext.itemName;
                   if (!colors[name]) {
                     colors[name] = chart.colors.next();
                   }
                   target.stroke = colors[name].brighten(-0.1);
                   return colors[name].brighten(-0.1);
                  });break;
      case 2:     series[parameter].columns.template.adapter.add("fill", function(fill, target) {
                   var name = target.dataItem.dataContext.realName;
                   var item = target.dataItem.dataContext.itemName;
                   if (!colors[name]) {
                     colors[name] = chart.colors.next();
                   }
                   target.stroke = colors[name].brighten(-0.2);
                   return colors[name].brighten(-0.2);
                  });break;
      case 3:     series[parameter].columns.template.adapter.add("fill", function(fill, target) {
                   var name = target.dataItem.dataContext.realName;
                   var item = target.dataItem.dataContext.itemName;
                   if (!colors[name]) {
                     colors[name] = chart.colors.next();
                   }
                   target.stroke = colors[name].brighten(-0.3);
                   return colors[name].brighten(-0.3);
                  });break;
      case 4:     series[parameter].columns.template.adapter.add("fill", function(fill, target) {
                   var name = target.dataItem.dataContext.realName;
                   var item = target.dataItem.dataContext.itemName;
                   if (!colors[name]) {
                     colors[name] = chart.colors.next();
                   }
                   target.stroke = colors[name].brighten(-0.4);
                   return colors[name].brighten(-0.4);
                  });break;
      case 5:     series[parameter].columns.template.adapter.add("fill", function(fill, target) {
                   var name = target.dataItem.dataContext.realName;
                   var item = target.dataItem.dataContext.itemName;
                   if (!colors[name]) {
                     colors[name] = chart.colors.next();
                   }
                   target.stroke = colors[name].brighten(-0.5);
                   return colors[name].brighten(-0.5);
                  });break;
    }

    counter++;

}



var rangeTemplate = categoryAxis.axisRanges.template;
rangeTemplate.tick.disabled = false;
rangeTemplate.tick.location = 0;
rangeTemplate.tick.strokeOpacity = 0.6;
rangeTemplate.tick.length = 60;
rangeTemplate.grid.strokeOpacity = 0.5;
rangeTemplate.label.tooltip = new am4core.Tooltip();
rangeTemplate.label.tooltip.dy = -10;
rangeTemplate.label.cloneTooltip = false;

///// DATA
var chartData = [];
var lineSeriesData = [];



// process data ant prepare it for the chart
for (var providerName in data) {
 var providerData = data[providerName];

 // add data of one provider to temp array
 var tempArray = [];
 var count = 0;
 // add items
 for (var itemName in providerData) {
  var itemData = providerData[itemName];
   if(itemName != "quantity"){
   count++;
   var tempObject = {
          category: providerName + "_" + itemName,
          realName: itemName,
          provider: providerName
        };
     for(var item in itemData){
      tempObject[item] = itemData[item];
     }
      // we generate unique category for each column (providerName + "_" + itemName) and store realName
        tempArray.push(tempObject);
   }
 }



 // push to the final data
 am4core.array.each(tempArray, function(item) {
   chartData.push(item);
 })

 // create range (the additional label at the bottom)
 var range = categoryAxis.axisRanges.create();
 range.category = tempArray[0].category;
 range.endCategory = tempArray[tempArray.length - 1].category;
 range.label.text = tempArray[0].provider;
 range.label.dy = 0;
 range.label.truncate = true;
 range.label.fontWeight = "bold";
 range.label.rotation = 0;
 range.label.inside = true;
 range.label.horizontalCenter = "middle";
 range.label.valign = "top";
// range.label.align = "center";
 range.label.tooltipText = tempArray[0].provider;

 range.label.adapter.add("maxWidth", function(maxWidth, target){
   var range = target.dataItem;
   var startPosition = categoryAxis.categoryToPosition(range.category, 0);
   var endPosition = categoryAxis.categoryToPosition(range.endCategory, 1);
   var startX = categoryAxis.positionToCoordinate(startPosition);
   var endX = categoryAxis.positionToCoordinate(endPosition);
   return endX - startX;
 })
}


chart.data = chartData;


// last tick
var range = categoryAxis.axisRanges.create();
range.category = chart.data[chart.data.length - 1].category;
range.label.disabled = true;
range.tick.location = 1;
range.grid.location = 1;




}








