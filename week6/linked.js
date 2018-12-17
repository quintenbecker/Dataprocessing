var svgBars;
var svgPie;

window.onload = function() {
svgBars = makeSvg()
svgPie = makeSvgPie()


}

  // make svg (canvas) element
  function makeSvg(){

  var w = 700;
  var h = 350;

  var barSvg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              // .attr("transform", "translate(20,0)")

              return barSvg;
}


// make svg (canvas) element
  function makeSvgPie(){

  var width = 500;
  var height = 400;


  var pieSvg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              // .style("background", "grey")
              .attr("id", "piechart")

              return pieSvg;
}

d3.json("jsonfile.json").then(function(data)
{

  countriesList = []
  countries = Object.keys(data)

  womenList = []
  women = Object.values(data)
  women.forEach(function(a){
    womenList.push(a.Women)
  })

  menList = []
  men = Object.values(data)
  men.forEach(function(b){
    menList.push(b.Men)
  })

  pieDict = []
  //
  // for (i in range(len(countries))){
  //    pieDict.push({"countries[i]"": menList[i], womenList[i]}

  totalList = []
  totals = Object.values(data)
  totals.forEach(function(d){
    totalList.push(d.Total)
  })

  barchart(totalList, countries)
  piechart(womenList, menList)

});

  function piechart(w, women, men){
    var piedata = [{gender: "men", percentage: men}, {gender: "women", percentage: women}]

    var data = d3.pie().sort(null).value(function(d){return d.percentage;})(piedata);

    var segments = d3.arc()
                    .innerRadius(40)
                    .outerRadius(150)

    var sections =  svgPie.append("g")
                    .attr("transform", "translate(300, 250)")
                    .selectAll("path").data(data)


    sections.enter().append("path").attr("d", segments).attr("fill", function(d){
      if (d.data.gender == "men"){
        return "navy";
      }
      return "pink";
    });

  }

  function barchart(t, c){

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
         .html(function(d, i) { return c[i] + ": "+ d});
    svgBars.call(tool_tip);


    var xScale = d3.scaleBand()
      .range([w, marginLeft])
      .domain(c)
      // .attr("transform", "rotate(90)")

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

    // console.log(t);
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
                         return xScale(c[i]);
                       })
                   .attr("width", (w / t.length) - barPadding)
                   .attr("height", function(d) {
                    return h - yScale(d) - marginbottom;  //Just the data value
                    })

                   .attr("fill", "teal")
                   .on('mouseover', tool_tip.show)
                   .on('mouseout', tool_tip.hide)
                   .on("click", function(d, i){
                     piechart(d, menList[i], womenList[i])
                   })
     // append name of y axis
     svgBars.append("text")
     .attr("class", "ytext")
     .style("font-size", "14px")
     .attr("x", 250)
     .attr("y", 20)
     .text("% of adult education (Tertiary) level per country");


     svgPie.append("text")
     .attr("class", "ytext")
     .style("font-size", "14px")
     .attr("x", 200)
     .attr("y", 65)
     .text("% of the all men and woman");


}
