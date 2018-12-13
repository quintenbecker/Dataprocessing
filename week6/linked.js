var svgBars;
var svgPie;

window.onload = function() {
svgBars = makeSvg()
svgPie = makeSvgPie()



}

  var w = 700;
  var h = 350;

  // make svg (canvas) element
  function makeSvg(){

  var barSvg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              // .attr("transform", "translate(20,0)")

              return barSvg;
}

var width = 500;
var height = 350;

// make svg (canvas) element
  function makeSvgPie(){

  var pieSvg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("background", "grey")
              return pieSvg;
}

d3.json("jsonfile.json").then(function(data)
{

  countriesList = []
  countries = Object.keys(data)

  totalList = []
  totals = Object.values(data)
  totals.forEach(function(d){
    totalList.push(d.Total)
  })

barchart(totalList, countries)

});


  function barchart(t, b){

    var w = 700;
    var h = 350;
    var marginHeight = 20;
    var marginLeft = 20;
    var marginbottom = 20;
    var barPadding = 1.5;
    var yMax = 55.17366;
    var countries = 42;


    var yScale = d3.scaleLinear()
      .range([h - marginHeight, 0 + marginbottom])
      .domain([0, yMax])

    var tool_tip = d3.tip()
         .attr("class", "d3-tip")
         .offset([-8, 0])
         .html(function(d, i) { return b[i] + ": "+ d});
    svgBars.call(tool_tip);


    var xScale = d3.scaleBand()
      .range([w, marginLeft])
      .domain(b)

    var xAxis = svgBars.append('g')
          .attr("transform", "translate(" + "0" + "," + (h - marginbottom) +")")
          .call(d3.axisBottom(xScale))
          .style("font-size", "6px")

        // make Y-axe
    var yAxis = svgBars.append("g")
          .attr("transform", "translate(20," + "0" + ")")
          .call(d3.axisLeft(yScale));


    var colour = d3.select('body').append('div')
      .style("display", "true")
      .style("fill", '#99e499')


    console.log(t);
    svg = d3.select("body").append("svg")
    var rects = svgBars.selectAll("rect")
                   .data(t)
                   .enter()
                   .append("rect")
                   .attr("class", "bar")
                   .attr("y", function(d) {
                    return yScale(d);
                    })
                   .attr("x", function(d, i) {
                         return xScale(b[i]);
                       })
                   .attr("width", (w / t.length) - barPadding)
                   .attr("height", function(d) {
                    return h - yScale(d) - marginbottom;  //Just the data value
                    })

                   .attr("fill", "teal")
                   .on('mouseover', tool_tip.show)
                   .on('mouseout', tool_tip.hide)
}
