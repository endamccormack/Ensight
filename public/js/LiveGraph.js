function Live(i)
{
	var marker_value = i;
		
var margin = {
top: 65,
right: 80,
bottom: 40,
left: 40},

width = 580 - margin.left - margin.right,
height = 570 - margin.top - margin.bottom;
	
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;	
	
var formatTime = d3.time.format("%A %B %d %H:%M:%S");	
	
var x = d3.time.scale()
		.range([0, width]);

var y = d3.scale.linear()
		.range([height, 0]);
	
var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom")
		.tickSize(-height);

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
	var filtered_data = data.filter(function(d) { return d.inspectionPoint_id == marker_value;})	
			
	color.domain(d3.keys(filtered_data[0]).filter(function(key) { return key == "testSource_id"; }));
	
	filtered_data.map( function (d) {
	d.inspectionPoint_id = +d.inspectionPoint_id;
	d.testSource_id = +d.testSource_id;
	d.testSourceUpperLimit = +d.testSourceUpperLimit;
	d.testSourceLowerLimit = +d.testSourceLowerLimit; 
	d.dateTimeTaken = parseDate(d.dateTimeTaken);
	d.reading = +d.reading;
	d.parameterType = d.parameterType;
	d.parameter_id = +d.parameter_id;
	d.clientSite_id = +d.clientSite_id;
	d.clientSiteName = d.clientSiteName;
	return d;
 });
  
filtered_data = d3.nest().key(function(d) { return d.testSource_id; }).entries(filtered_data);

x.domain([d3.min(filtered_data, function(d) { return d3.min(d.values, function (d) { return d.dateTimeTaken; }); }),
          d3.max(filtered_data, function(d) { return d3.max(d.values, function (d) { return d.dateTimeTaken; }); })]);
y.domain([d3.min(filtered_data, function(d) { return d3.min(d.values, function (d) { return d.reading; }); }),
          d3.max(filtered_data, function(d) { return d3.max(d.values, function (d) { return d.reading; }); })]);	
		  
var status = d3.select("#status")
		.append("svg")
		.attr('class', 'status')
		.attr("width", 50)
		.attr("height", 140);
		
var div = d3.select("#status")
		.append("div")
		.attr("class", "statustext");
	 						  		  
var legend = svg.selectAll('g')
		.data(filtered_data, function(d) { return d.key; })
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
		.data(filtered_data, function(d) { return d.key; })
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
	var filtered_data = data.filter(function(d) { return d.inspectionPoint_id == marker_value;})	

 	color.domain(d3.keys(filtered_data[0]).filter(function(key) { return key == "testSource_id"; }));
	
	filtered_data.map( function (d) {
	d.inspectionPoint_id = +d.inspectionPoint_id;
	d.testSource_id = +d.testSource_id;
	d.testSourceUpperLimit = +d.testSourceUpperLimit;
	d.testSourceLowerLimit = +d.testSourceLowerLimit;  
	d.dateTimeTaken = parseDate(d.dateTimeTaken);
	d.reading = +d.reading;
	d.parameterType = d.parameterType;
	d.parameter_id = +d.parameter_id;
	d.clientSite_id = +d.clientSite_id;
	d.clientSiteName = d.clientSiteName;
	return d;
});
	
var maxDate = d3.max( filtered_data, function(d) { return formatTime(d.dateTimeTaken); }); 

svg.selectAll( ".timeDisplay" )
  .data( [maxDate] )
  .text( function(d) { return d; } )
  .enter()
  .append("text")
  .attr("class", "timeDisplay" )
  .attr("x", width )
  .attr("y", -35)
  .attr("text-anchor", "end" );  
	
filtered_data = d3.nest().key(function(d) { return d.testSource_id; }).entries(filtered_data);

x.domain([d3.min(filtered_data, function(d) { return d3.min(d.values, function (d) { return d.dateTimeTaken; }); }),
          d3.max(filtered_data, function(d) { return d3.max(d.values, function (d) { return d.dateTimeTaken; }); })]);
y.domain([d3.min(filtered_data, function(d) { return d3.min(d.values, function (d) { return d.reading; }); }),
          d3.max(filtered_data, function(d) { return d3.max(d.values, function (d) { return d.reading; }); })]);	
		  
var newparameters = svg.selectAll("g.parameter")
     .data(filtered_data);
	
newparameters
  		.select( ".line" )
		.transition() 
		.ease("linear")
		.duration(750) 
		.attr( "d", function(d) { return line(d.values); })
	
					
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
		 	
status
		.data(filtered_data)
		.append("circle")		
   		.attr("cx", 30)
   		.attr("cy", 20)
   		.attr("r", 7)
  		.style("fill", function(d){    
  		     
    	if (d.values[0].reading > d.values[0].testSourceUpperLimit)
		{	
			div .html("Site ID:" + " " + d.values[0].clientSite_id + "<br/>" + "<br/>" + "Inspection Point ID:" + " "  + marker_value + "<br/>" + "<br/>" +"Currently non-compliant - " + d.values[0].parameterType + " " + "levels are above regulated limits");
			return "red"

		} 
		else if (d.values[0].reading < d.values[0].testSourceLowerLimit)
		{		
			div .html("Site ID:" + " " + d.values[0].clientSite_id + "<br/>" + "<br/>" + "Inspection Point ID:" + " "  + marker_value + "<br/>" + "<br/>" +"Currently non-compliant - " + d.values[0].parameterType + " " + "levels are below regulated limits");
			return "red"
		} 
		else
		{ 	
			div .html ("Site ID:" + " " + d.values[0].clientSite_id + "<br/>" + "<br/>" + "Inspection Point ID:" + " "  + marker_value + "<br/>" + "<br/>" +"Currently compliant");
			return "green"
		} 
	
;}) 
});
};});
}