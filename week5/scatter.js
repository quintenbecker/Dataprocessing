window.onload = function() {

  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"

  var requests = [d3.json(consConf), d3.json(womenInScience)];

  Promise.all(requests).then(function(data) {
      var data1 = transformResponse(data[0]);
      var data2 = transformResponse(data[1]);
      makeSvg()

      console.log(data2)
      console.log(data1);
      // console.log(data2[1]["time"])

      // getData(data1);

      var complete_data = {}
      //
      for (var i = 0; i < data2.length; i++){
        for (var j = 0; j < data1.length; j++){
          if (data2[i]["country"] == data1[j]["Country"] && data2[i]["time"] == data1[j]["time"]){
                if (complete_data[data2[i]["time"]] == undefined){
                  complete_data[data2[i]["time"]] = []
                }
                complete_data[data2[i]["time"]].push([data2[i]["country"], data2[i]["datapoint"], data1[i]["datapoint"]]);
              }
            }
          }
          console.log(complete_data)

  }).catch(function(e){
      throw(e);
  });
};

var w = 500;
var h = 300;


function makeSvg(){

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);
}


function scatterPlot(data){

  svg.selectAll("circle")
     .data(dict.value[1])
     .enter()
     .append("circle")

}



function transformResponse(data){
  t=data

// access data property of the response
let dataHere = data.dataSets[0].series;

// access variables in the response and save length for later
let series = data.structure.dimensions.series;
let seriesLength = series.length;

// set up array of variables and array of lengths
let varArray = [];
let lenArray = [];

series.forEach(function(serie){
    varArray.push(serie);
    lenArray.push(serie.values.length);
});

// get the time periods in the dataset
let observation = data.structure.dimensions.observation[0];

// add time periods to the variables, but since it's not included in the
// 0:0:0 format it's not included in the array of lengths
varArray.push(observation);

// create array with all possible combinations of the 0:0:0 format
let strings = Object.keys(dataHere);

// set up output array, an array of objects, each containing a single datapoint
// and the descriptors for that datapoint
let dataArray = [];

// for each string that we created
strings.forEach(function(string){
    // for each observation and its index
    observation.values.forEach(function(obs, index){
        let data = dataHere[string].observations[index];
        if (data != undefined){

            // set up temporary object
            let tempObj = {};

            let tempString = string.split(":").slice(0, -1);
            tempString.forEach(function(s, indexi){
                tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
            });

            // every datapoint has a time and ofcourse a datapoint
            tempObj["time"] = obs.name;
            tempObj["datapoint"] = data[0];
            tempObj["country"] = t.structure.dimensions.series[1].values[Number(string.slice(-1))].name;
            dataArray.push(tempObj);
        }
    });
});



// return the finished product!
return dataArray;
}
// var years = []
// keys = Object.values(data)
// console.log(keys)


// dict[data[i]["time"]] = []
// dict[data[i]["time"]].push([data[i]["Country"], data[i]["datapoint"])
//
// dict{time}:

  // for (var i = 0; i<time.length; i++){
  //   countries.push(value[i])
  //   countries.push(datapoint[i]);
  //   countries.push(time[i]);
  //   dataset.push([countries]);
  //   countries = []
  //
  // };

  //   console.log(dataset)
  // value.push(data[i]["Country"])
  // datapoint.push(data[i]["datapoint"])
  // time.push(data[i]["time"])
  // dict[data[i]["time"]] = data[i]["datapoint"], data[i]["Country"];



  //
  // function getData(data1, data2){
  //
  //   var complete_data = {}
  //   //
  //   for (var i = 0; i < data2.length; i++){
  //     for (var j = 0; j < data1.length; j++){
  //       if (data2[i]["country"] == data1[j]["Country"] && data2[i]["time"] == data1[j]["time"]){
  //             if (complete_data[data2[i]["time"]] == undefined){
  //               complete_data[data2[i]["time"]] = []
  //             }
  //             complete_data[data2[i]["time"]].push([data2[i]["country"], data2[i]["datapoint"], data1[i]["datapoint"]]);
  //           }
  //         }
  //       }
  //       console.log(complete_data)

    // var dict = {}
    //
    // for (var i=0; i<data.length; i++){
    //
    //   if (dict[data[i]["time"]] == undefined){
    //     dict[data[i]["time"]] = [];
    //   }
    //
    //   var temp = [data[i]["Country"], data[i]["datapoint"]]
    //
    //   dict[data[i]["time"]].push(temp)
    //   };
    //
    //   console.log(dict)
    // }
