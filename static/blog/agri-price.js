function getDetails(){
   var firstDetails = document.getElementsByClassName('first');
   var allFilled = true;
   for(var i=0; i<firstDetails.length; i++){
    if(firstDetails[i].value == ""){
        allFilled = false;
    }
   }

   if(allFilled){
    var year = $('#year').val();
    var month = $('#month').val();
    var supply = $('#supply').val();

    document.getElementById('getDetails').innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>`;
             $.ajax({
                type: "GET",
                url: 'https://api.cl-ds.com/getCropPrice/'+ year +'/'+ month +'/'+ supply +'/?format=json',
                headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
                //data: "check",
                success: function(data){
                    mixedData = data;
                    document.getElementById('getDetails').innerHTML = `Get`;
                    document.getElementById('crop').innerHTML = `<option value="">Crop</option>`;
                    document.getElementById('grade').innerHTML = `<option value="">Grade</option>`;
                    document.getElementById('state').innerHTML = `<option value="">State</option>`;
                    //Removing Duplicates
                    var crops = data.map(function(item){
                        return item.crop;
                    });
                    crops = remove_duplicates(crops);



                    var states = data.map(function(item){
                        return item.state + "_" + item.city ;
                    });
                    states = remove_duplicates(states);




                    for(var i=0; i<crops.length; i++){
                        var parent = document.getElementById('crop');
                        var option = document.createElement('option');
                        option.value =  crops[i];
                        option.innerHTML = crops[i];

                        parent.append(option);
                    }
                    $('#crop').on('change', function() {
                        document.getElementById('grade').innerHTML = '<option value="">Grade</option>';
                        document.getElementById('state').innerHTML = '';
                        document.getElementById('city').innerHTML = '';
                        var val = $(this).val();
                        filteredData = mixedData.filter(function (el){
                            return el.crop == val
                        });

                        var grades = filteredData.map(function(item){
                            return item.grade;
                        });
                        grades = remove_duplicates(grades);

                    for(var i=0; i<grades.length; i++){
                        var parent = document.getElementById('grade');
                        var option = document.createElement('option');
                        option.value =  grades[i];
                        option.innerHTML = grades[i];

                        parent.append(option);
                    }

                    });

                    $('#grade').on('change', function() {
                        document.getElementById('state').innerHTML = '<option value="">State</option>';
                        document.getElementById('city').innerHTML = '';

                        var val = $(this).val();

                        filteredDataGrade = filteredData.filter(function (el){
                            return el.grade == val
                        });

                    var states = filteredDataGrade.map(function(item){
                        return item.state + "_" + item.city ;
                    });
                    states = remove_duplicates(states);

                    var tempCities = [];
                    for(var i=0; i<states.length; i++){
                        var state = states[i].split(/_/)[0];
                        tempCities= [];
                        if(geoObj.hasOwnProperty(state)){
                             tempCities = geoObj[state];
                             tempCities.push(states[i].split(/_/)[1]);
                             geoObj[state] = tempCities;
                        }else{
                            tempCities.push(states[i].split(/_/)[1]);
                            geoObj[state] = tempCities
                        }


                    }

                    for(var state in geoObj){
                        var parent = document.getElementById('state');
                        var option = document.createElement('option');
                        option.value =  state;
                        option.innerHTML = state;

                        parent.append(option);
                    }

                    });


                    //city in state
                    $('#state').on('change', function() {
                        document.getElementById('city').innerHTML = '<option value="">City</option>';
                          var parent = document.getElementById('city');
                          parent.innerHTML = "";
                          var city = geoObj[this.value];
                          for(var i=0; i< city.length; i++){

                                var option = document.createElement('option');
                                option.value =  city[i];
                                option.innerHTML = city[i];

                                parent.append(option);
                          }

                    });


                    $('#details').collapse('show');
                }

            });
   }else{
        alert("Fill all the fields!!!");
   }

}


function remove_duplicates(arr) {
        var obj = {};
        var ret_arr = [];
         for (var i = 0; i < arr.length; i++) {
            obj[arr[i]] = true;
         }
         for (var key in obj) {
            ret_arr.push(key);
          }
        return ret_arr;
}


function getChart(){
 var crop = $('#crop').val();
 var grade = $('#grade').val();
 var state = $('#state').val();
 var city = $('#city').val();

var filteredDataLatest = mixedData.filter(function (el){
    return el.crop == crop &&
           el.grade == grade &&
           el.state == state &&
           el.city == city ;
});

        if(filteredDataLatest.length > 0){
            drawChart(filteredDataLatest);
        }else{
            alert('No data available for chosen options');
        }
}

function drawChart(filteredDataLatest){
    console.log(filteredDataLatest);
                                    var labels = filteredDataLatest.map(function(e) {
                                        minX = e.month + "/01";
                                        maxX = e.month + "/" + moment(e.year+"-"+e.month, "YYYY-MM").daysInMonth();
                                            var date = e.month+'/'+ e.day +'/'+ e.year;
                                           return moment(date).format('MM/DD');
                                        });
                                    var dataAvg = filteredDataLatest.map(function(e) {
                                           return e.average;
                                        });
                                     var dataHigh = filteredDataLatest.map(function(e) {
                                           return e.high;
                                        });
                                     var dataLow = filteredDataLatest.map(function(e) {
                                           return e.low;
                                        });
                                var max = Math.max.apply(this, dataHigh);
                                var min = Math.min.apply(this, dataLow);

                                if(max < 0){
                                    max = max-(max*0.10);
                                }else{max = max+(max*0.10);}

                                if(min < 0){
                                    min = min+(min*0.10);
                                }else{
                                    min = min-(min*0.10);
                                }

                                    document.getElementById('chart-wrapper').innerHTML = '';
                                    var canvas = document.createElement('canvas');
                                    canvas.id = "chart";
                                    canvas.width = '400';
                                    canvas.height = '150';
                                    document.getElementById('chart-wrapper').append(canvas);

                                    var ctx = document.getElementById('chart');

                                    var config = {
                                       type: 'line',
                                       data: {
                                          labels: labels,
                                          datasets: [{

                                             data: dataAvg,
                                             fill: false,
                                             lineTension: 0.5,
                                             pointRadius: 2.2,
                                             borderWidth: 2,
                                             borderColor: "#5f76e8",
                                             backgroundColor: 'rgba(0, 119, 204, 0.3)'
                                          },
                                          {

                                             data: dataHigh,
                                             fill: false,
                                             lineTension: 0.5,
                                             pointRadius: 2.2,
                                             borderWidth: 2,
                                             borderColor: "#3f91a3",
                                             backgroundColor: 'rgba(123, 0, 17, 0.3)'
                                          },
                                          {

                                             data: dataLow,
                                             fill: false,
                                             lineTension: 0.5,
                                             pointRadius: 2.2,
                                             borderWidth: 2,
                                             borderColor: "#4f11f9",
                                             backgroundColor: 'rgba(111, 234, 123, 0.3)'
                                          },
                                          ]
                                       },
                                       options:{
                                                legend: {
                                                    display: false,
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Here title'
                                                },

                                        maintainAspectRatio: false,
                                            scales:{
                                                xAxes: [{
                                                   ticks: {
                                                        autoSkip: false,
                                                        maxTicksLimit: 20,
                                                        maxRotation: 0,


                                                    },
                                                    distribution: 'linear',
                                                    type: 'time',
                                                    time: {
                                                       unit: 'day',
                                                       displayFormats: {
                                                          day: 'DD'
                                                       },
                                                       stepSize: 1,
                                                       min: minX,
                                                       max: maxX
                                                    }
                                                }],
                                                yAxes: [{
                                                    ticks: {
                                                            min: min,
                                                            max: max
                                                                },
                                                    gridLines: {
                                                        drawBorder: false
                                                    },
                                                    scaleLabel:{
                                                        display:true,
                                                        labelString: "scaleLabel"
                                                    }
                                                }]
                                            }
                                       }
                                    };

                                    var chart = new Chart(ctx, config);
}
