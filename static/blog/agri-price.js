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

                    var grades = data.map(function(item){
                        return item.grade;
                    });
                    grades = remove_duplicates(grades);

                    var states = data.map(function(item){
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

                    for(var i=0; i<crops.length; i++){
                        var parent = document.getElementById('crop');
                        var option = document.createElement('option');
                        option.value =  crops[i];
                        option.innerHTML = crops[i];

                        parent.append(option);
                    }
                    for(var i=0; i<grades.length; i++){
                        var parent = document.getElementById('grade');
                        var option = document.createElement('option');
                        option.value =  grades[i];
                        option.innerHTML = grades[i];

                        parent.append(option);
                    }

                    for(var state in geoObj){
                        var parent = document.getElementById('state');
                        var option = document.createElement('option');
                        option.value =  state;
                        option.innerHTML = state;

                        parent.append(option);
                    }
                    //city in state
                    $('#state').on('change', function() {
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

                    console.log(crops);
                    console.log(grades);
                    console.log(geoObj);

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

var filteredData = mixedData.filter(function (el){
    return el.crop == crop &&
           el.grade == grade &&
           el.state == state &&
           el.city == city ;
});

        if(filteredData.length > 0){
            drawChart(filteredData);
        }else{
            alert('No data available for chosen options');
        }
}

function drawChart(filteredData){
    console.log(filteredData);
                                    var labels = filteredData.map(function(e) {
                                        minX = e.month + "/01";
                                        maxX = e.month + "/" + moment(e.year+"-"+e.month, "YYYY-MM").daysInMonth();
                                            var date = e.month+'/'+ e.day +'/'+ e.year;
                                           return moment(date).format('MM/DD');
                                        });
                                    console.log(labels);
                                    var data = filteredData.map(function(e) {
                                           return e.average;
                                        });
                                    console.log(data);
                                var max = Math.max.apply(this, data);
                                var min = Math.min.apply(this, data);

                                if(max < 0){
                                    max = max-(max*0.10);
                                }else{max = max+(max*0.10);}

                                if(min < 0){
                                    min = min+(min*0.10);
                                }else{
                                    min = min-(min*0.10);
                                }


                                    var ctx = document.getElementById('chart');

                                    var config = {
                                       type: 'line',
                                       data: {
                                          labels: labels,
                                          datasets: [{

                                             data: data,
                                             fill: false,
                                             lineTension: 0.5,
                                             pointRadius: 2.2,
                                             borderWidth: 2,
                                             borderColor: "#5f76e8",
                                             backgroundColor: 'rgba(0, 119, 204, 0.3)'
                                          }]
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
