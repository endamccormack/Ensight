d3.json('/JsonRequest',function (jsondata) { 
  ///assets/getdata.php
    var data = jsondata.map(function(d) { return d.reading; });
	
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 550 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
var y = d3.scale.linear().domain([0, d3.max(jsondata, function(d) { return parseInt(d.reading);})]).range([height,0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line()
.x(function(d,i) { return x(i); })
.y(function(d) { return y(d); });

var svg = d3.select("#livefeed").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	 /* .append("text")
      .attr("x", 250)
	   .attr("dy", ".80em")
      .style("text-anchor", "end")
      .text("Minutes");*/

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
	  .attr("x", -70)
      .attr("dy", ".80em")
      .style("text-anchor", "end")
      .text("Reading");
	  
  svg.append("path")
      .datum(data)
     .attr("class", "line")
      .attr("d", line);
});
	
