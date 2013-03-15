
	
var margin = {
top: 35,
right: 80,
bottom: 40,
left: 40},

width = 580 - margin.left - margin.right,
height = 470 - margin.top - margin.bottom;
	
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;	
	
var formatTime = d3.time.format("%A %B %d %H:%M:%S");	
	
var x = d3.time.scale()
		.range([0, width]);

var y = d3.scale.linear()
		.range([height, 0]);
	
var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
		.tickSize(-height)
		.tickSubdivide(1);

var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left");

var line = d3.svg.line()
    	.interpolate("basis")
    	.x(function(d) { return x(d.dateTimeTaken); })
    	.y(function(d) { return y(d.reading); });

var svg = d3.select("#livefeed").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
svg.append("defs").append("clipPath")
    	.attr("id", "clip")
  		.append("rect")
    	.attr("width", width)
    	.attr("height", height);
		
d3.json("/JsonRequest/findGetLiveData", function(error, data) 
{
 		color.domain(d3.keys(data[0]).filter(function(key) { return key == "parameter_id"; }));
 		data = data.map( function (d) { 
    	d.dateTimeTaken = parseDate(d.dateTimeTaken);
		d.reading = +d.reading;
		return d;
 });
    
data = d3.nest().key(function(d) { return d.parameter_id; }).entries(data);


x.domain([d3.min(data, function(d) { return d3.min(d.values, function (d) { return d.dateTimeTaken; }); }),
          d3.max(data, function(d) { return d3.max(d.values, function (d) { return d.dateTimeTaken; }); })]);
y.domain([d3.min(data, function(d) { return d3.min(d.values, function (d) { return d.reading; }); }),
          d3.max(data, function(d) { return d3.max(d.values, function (d) { return d.reading; }); })]);	
		  
var status = d3.select("#status")
		.append("svg")
		.attr("width", 580)
		.attr("height", 250);		  
		  
var legend = svg.selectAll('g')
		.data(data, function(d) { return d.key; })
     	.enter()
     	.append('g')
     	.attr('class', 'legend')
		.attr('transform', function (d, i) { 
        return "translate(" + width + " ,   " + 0 + ")";});
    
legend.append('rect')
     	.style('fill', function(d) { return color(d.key);})
		.attr('x', 0)
        .attr('width', 10)
        .attr('y', function (d, i) { return i * 20; })
        .attr('height', 10);
      
legend.append('text')
		.text(function(d){ return d.values[0].parameterType; })
       	.attr('x', 12)
       	.attr('y', function (d, i) {
        return i * 20 + 9;});
      	
svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
			        
var parameter = svg.selectAll(".parameter")
		.data(data, function(d) { return d.key; })
      	.enter().append("g")
      	.attr("class", "parameter");

parameter.append("path")
      	.attr("class", "line")
      	.attr("d", function(d) { return line(d.values); })
      	.style("stroke", function(d) { return color(d.key); });
	  
svg.append("g").attr("clip-path", "url(#clip)");

var inter = setInterval(function() {	
updateData();
}, 5000);		
	
function updateData() 
{
d3.json("/JsonRequest/findGetLiveData", function(error, data) 
{
 		color.domain(d3.keys(data[0]).filter(function(key) { return key == "parameter_id"; }));
 		data = data.map( function (d) { 
    	d.dateTimeTaken = parseDate(d.dateTimeTaken);
		d.reading = +d.reading;
		return d;
});
 
data.push(data);
		
var maxDate = d3.max( data, function(d) { return d.dateTimeTaken; }); 

svg.selectAll( ".timeDisplay" )
  .data( [maxDate] )
  .text( function(d) { return d; } )
  .enter()
  .append("text")
  .attr("class", "timeDisplay" )
  .attr("x", width )
  .attr("y", -15)
  .attr("text-anchor", "end" );  
	
data = d3.nest().key(function(d) { return d.parameter_id; }).entries(data);


x.domain([d3.min(data, function(d) { return d3.min(d.values, function (d) { return d.dateTimeTaken; }); }),
          d3.max(data, function(d) { return d3.max(d.values, function (d) { return d.dateTimeTaken; }); })]);
y.domain([d3.min(data, function(d) { return d3.min(d.values, function (d) { return d.reading; }); }),
          d3.max(data, function(d) { return d3.max(d.values, function (d) { return d.reading; }); })]);	
		  
status
	.append("circle")
	.data(data)
   	.attr("cx", 30)
   	.attr("cy", 25)
   	.attr("r", 7)
  	.style("fill", function(d){           
    if (d.reading > d.testSourceUpperLimit) 
	{return "red"} else 
	{ 
	return "green" 
	} ;}) 

var newparameters = svg.selectAll("g.parameter")
      .data(data);
	
newparameters
  	.select( "path.line" )
   	.transition() 
	.ease("linear")
	.duration(750) 
    .attr( "d", function(d) { return line(d.values); });	
			
svg.select(".x.axis")
  		.transition()
		.duration(750)
		.ease("linear")
		.call(xAxis);
	  	  
svg.select(".y.axis")
  		.transition()
		.duration(750)
		.ease("linear")
		.call(yAxis); 
		
data.shift();


});
};});
