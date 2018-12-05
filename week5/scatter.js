var makeScatter;
var updateScatter;

window.onload = function() {

  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"

  var requests = [d3.json(consConf), d3.json(womenInScience)];

  Promise.all(requests).then(function(data) {
      var data1 = transformResponse(data[0]);
      var data2 = transformResponse(data[1]);
      svg = makeSvg()

      // convert data from sites to data parsed in lists (in dictionaries)
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

      // make dictionary with country and their 'rgb' color
      var countries = {
        France: "123,197,87",
        Germany: "220,194,46",
        Korea: "150,96,197",
        Netherlands: "222,80,164",
        Portugal: "41,117,209",
        UK: "0,0,0"
      }
      // variables of canvas and values
      var marginHeight = 20;
      var marginLeft = 20;
      var marginbottom = 20;
      var padding = 10
      var xMax = 50
      var xMin = 0
      var yMax = 150
      var yMin = 80

      // scales scatterplot to y axis
      var yScale = d3.scaleLinear()
        .range([h - marginHeight, 0 + marginbottom])
        .domain([yMin, yMax]);

        // scales scatterplot to x axis
      var xScale = d3.scaleLinear()
        .range([marginLeft, w-padding])
        .domain([xMin, xMax]);

      dropdown = Object.values(complete_data)


// makes scatteplot
makeScatter = function(year){

  svg.selectAll("circle").remove().exit();

  var scatter = svg.selectAll("circle")
                   .data(dropdown[year-2007])
                   .enter()
                   .append("circle")
                   .attr("cx", function(d) {
                      return xScale(d[1]);
                      })
                   .attr("cy", function(d) {
                      return yScale(d[2]);
                      })
                   .attr("r", 10)
                   .attr("fill", function(d){
                     return "rgb(" + countries[(d[0])] + ")";
                     });

}
// append name of y axis
svg.append("text")
.attr("class", "ytext")
.attr("x", 50)
.attr("y", 40)
.attr("text-anchor", "right")
.text("% of women in science from total amount of researchers");
// .attr("transform", "rotate (-90)")

// append name of x axis
svg.append("text")
.attr("class", "ytext")
.attr("x", 800)
.attr("y", 450)
.attr("text-anchor", "rotate")
.text("Consumer Confidence");

  // make X-axis
  var xAxis = svg.append('g')
   .attr("transform", "translate(" + "5" + "," + (h - marginbottom) +")")
   .call(d3.axisBottom(xScale))

   // make Y-axis
  var yAxis = svg.append("g")
   .attr("transform", "translate(25," + "0" + ")")
   .call(d3.axisLeft(yScale));

   // make lagenda element
  var legenda = svg.selectAll(".legenda")
  .data(Object.keys(countries))
  .enter().append("g")
  .attr("class", "legenda")
  .attr("transform", function(d, i){
    return "translate(0," + i * 20 +")"
  });

  // apply rectanglas filles with each colour of country
  legenda.append("rect")
  .attr("x", 900)
  .attr("y", 0)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i){
    return "rgb(" + Object.values(countries)[i] + ")"
  });

  // apply text (country) to each rectangle
  legenda.append("text")
 .attr("x", 920)
 .attr("y", 15)
 .text(function(d) {
   return d;
 });


  }).catch(function(e){
      throw(e);
  });
};

  var w = 1000;
  var h = 500;

  // make svg (canvas) element
  function makeSvg(){

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .attr("transform", "translate(20,0)")

              return svg;
              // return w;
              // return h;
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

            // every datapoint has a time, country and ofcourse a datapoint
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
