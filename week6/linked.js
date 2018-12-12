var svgBars;

window.onload = function() {
svgBars = makeSvg()



}

  var w = 700;
  var h = 350;

  // make svg (canvas) element
  function makeSvg(){

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              // .attr("transform", "translate(20,0)")

              return svg;

}

d3.json("jsonfile.json").then(function(data)
{
  // console.log(data)

  countries = Object.keys(data)
  console.log(countries);


  totalList = []
  totals = Object.values(data)
  totals.forEach(function(d){
  totalList.push(d.Total)


})
barchart(totalList)

});


  function barchart(t){

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


    var xScale = d3.scaleLinear()
      .range([w, marginLeft])
      .domain([0, countries])

    // var xAxis = svgBars.append('g')
    //       .attr("transform", "translate(" + "0" + "," + (h - marginbottom) +")")
    //       .call(d3.axisBottom(xScale))

        // make Y-axe
    var yAxis = svgBars.append("g")
          .attr("transform", "translate(20," + "0" + ")")
          .call(d3.axisLeft(yScale));

    // var tool_tip = d3.tip()
    //      .attr("class", "d3-tip")
    //      .offset([-8, 0])
    //      .html(function(d) { return  d.country + ": " + d.value;  });
    //    svg.call(tool_tip);
    
    var colour = d3.select('body').append('div')
      .style("display", "true")
      .style("fill", '#99e499')


    console.log(t);
    svg = d3.select("body").append("svg")
    var rects = svgBars.selectAll("rect")
                   .data(t)
                   .enter()
                   .append("rect")
                   .attr("y", function(d) {
                    return yScale(d);
                    })
                   .attr("x", function(d, i) {
                         return xScale(i);
                       })
                   .attr("width", (w / t.length) - barPadding)
                   .attr("height", function(d) {
                    return h - yScale(d) - marginbottom;  //Just the data value
                    })

                   .attr("fill", "teal")
                   .on('mouseenter', function(d){
                     // tool_tip.show;
                     colour.html(d)
                     d3.select(this).style('fill', "maroon")
                   })
                   .on('mouseout', function(d){
                     colour.transition()
                     d3.select(this).style('fill', "teal")
                   })
                   .on('mouseout', tool_tip.hide)
}
