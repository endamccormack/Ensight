function Historic(i)
{	
	var marker_value = i;
		
var margin = {top: 25, right: 20, bottom: 35, left: 30},
    width = 440,
    height = 275;
		
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;


Date.prototype.getMonthName = function() 
{
var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	return monthNames[this.getMonth()];
}

var formatTime = d3.time.format("%H:%M:%S");

var x = d3.time.scale().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var newdate = d3.time.format('%Y-%m-%dT%H:%M:%S.%LZ').parse;

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
	.tickFormat(d3.time.format("%b %e"))
	.ticks(4);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
	.interpolate('linear')
    .x(function(d) { return x(newdate(d.key)); })
    .y(function(d) { return y(d.values.mean); });
				
var svg = d3.select("#historic").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
function make_x_axis() {return d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(9)}

function make_y_axis() {return d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(9)}
				
d3.json("/JsonRequest/findHistoricData", function(error,data) 
{
var filtered_data = data.filter(function(d) { return d.inspectionPoint_id == marker_value;})	
	filtered_data.forEach(function(d) {
    	d.dateTimeTaken = parseDate(d.dateTimeTaken);
    	d.reading = +d.reading;
		d.parameterType = d.parameterType;
		d.inspectionPoint_id = d.inspectionPoint_id;		
});
	hideProgress();

			
d3.select("#selectparameter")
    .append("select")
	.attr("id", "parameterType")
    .selectAll("option")
    .data(filtered_data)
    .enter().append("option")
    .text(function(d) { return d.parameterType; })
	
 var a = new Array(); 
        $("#parameterType").children("option").each(function(x){ 
                test = false; 
                b = a[x] = $(this).val(); 
                for (i=0;i<a.length-1;i++){ 
                        if (b ==a[i]) test =true; 
                } 
                if (test) $(this).remove(); 
        })  
				
d3.select("#selectmonth")
		.append("select")
		.attr("id", "dateTimeTaken")
      	.selectAll("option")
        .data(filtered_data)
      	.enter().append("option")
        .text(function(d) { return d.dateTimeTaken.getMonthName(); })
		
		 var a = new Array(); 
        $("#dateTimeTaken").children("option").each(function(x){ 
                test = false; 
                b = a[x] = $(this).val(); 
                for (i=0;i<a.length-1;i++){ 
                        if (b ==a[i]) test =true; 
                } 
                if (test) $(this).remove(); 
        })  		


var selectedParameter = document.getElementById("parameterType").value; 
var selectedMonth = document.getElementById("dateTimeTaken").value;
	
var selectedData = filtered_data.filter(function(d) 
{ 
	return d.parameterType == selectedParameter && d.dateTimeTaken.getMonthName() == selectedMonth;
});
				
var newdata = d3.nest()    	
	.key(function(d) { return d3.time.day(d.dateTimeTaken).toISOString(); })
	.sortKeys(d3.ascending)	
	.rollup(function(d) {
	 return {mean:d3.mean(d, function(d_) {return +d_.reading;})};})
	.entries(selectedData);
		
x.domain(d3.extent(newdata, function(d) { return newdate(d.key); }));
y.domain([0, d3.max(newdata, function(d) { return d.values.mean; })]);
		
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text") 
	.attr("x", 240 )
	.attr("y", 430 )
	.style("text-anchor", "middle")
	.text("(TIME)");

svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);
		
/*var myLine = svg.append("line")
.data(newdata)
    .attr("x1", 0)
    .attr("y1", function(d) { return console.log(d.testSourceUpperLimit); })
    .attr("x2", 10)
    .attr("y2", function(d) { return d.testSourceLowerLimit; });*/
       		
svg.append("path")
	.attr("class", "line")
	.attr("d", line(newdata)); 
	
svg.append("g")
	.attr("class", "grid")
	.attr("transform", "translate(0," + height + ")")
	.call(make_x_axis()
	.tickSize(-height, 0, 0)
	.tickFormat(""));

svg.append("g")
	.attr("class", "grid")
	.call(make_y_axis()
	.tickSize(-width, 0, 0)
	.tickFormat(""));
	
var div = d3.select("#historic").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0); 

svg.selectAll("dot")
	.data(newdata)
	.enter()
	.append("circle")
	.attr("class", "dot")
	.attr("r", 4)
	.attr("cx", function(d) { return x(newdate(d.key)); })
	.attr("cy", function(d) { return y(d.values.mean); })
	.attr("fill", "#8cc13f")
	.on("mouseover", function(d) {
	 div.transition()
	.duration(200)
	.style("opacity", .9);	  
	div .html("Inspection Point:"  + "  " + marker_value + "<br/>" + "<br/>" +"Date taken:" + "  " + newdate(d.key) + "<br/>" + "<br/>" 	+ "Average Reading:" + "  " + d.values.mean + "<br/>" + "<br/>" + 		"Parameter:" +  "  " + selectedParameter)
	.style("left", (d3.event.pageX) + "px")
	.style("top", (d3.event.pageY - 28) + "px");
	})
	.on("mouseout", function(d) {
	div.transition()
	.duration(500)
	.style("opacity", 0);
		});
		
d3.select("#parameterType").on("change", upDate);
   
d3.select("#dateTimeTaken").on("change", upDate);

function upDate()
{
var selectedParameter = document.getElementById("parameterType").value;		
var selectedMonth = document.getElementById("dateTimeTaken").value;
	
var selectedData = filtered_data.filter(function(d) 
{ 			
	return d.parameterType == selectedParameter && d.dateTimeTaken.getMonthName() == selectedMonth;
});
			
var newdata = d3.nest()    	
	.key(function(d) { return d3.time.day(d.dateTimeTaken).toISOString(); })
	.sortKeys(d3.ascending)	
	.rollup(function(d) {
	 return {mean:d3.mean(d, function(d_) {return +d_.reading;})};})
	.entries(selectedData);
		
x.domain(d3.extent(newdata, function(d) { return newdate(d.key); }));
y.domain([0, d3.max(newdata, function(d) { return d.values.mean; })]);
		
svg.select("path.line")
   	.transition() 
	.ease("linear")
	.duration(750) 
    .attr( "d", line(newdata));
 		
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
	
svg.selectAll("g.grid")
  	.transition()
	.duration(750)
	.call(make_x_axis)
	.call(make_y_axis)	
				
var circle = svg.selectAll("circle")
    .data(newdata);

circle.enter().append("circle")
	.transition()
	.duration(750)
    .attr("r", 4)
	.attr("fill", "#8cc13f")

circle
    .attr("cx", function(d) { return x(newdate(d.key)); })
	.attr("cy", function(d) { return y(d.values.mean); })
	.on("mouseover", function(d) {
	 div.transition()
	.duration(200)
	.style("opacity", .9);	  
	div .html("Inspection Point:"  + "  " + marker_value + "<br/>" + "<br/>" +"Date taken:" + "  " + newdate(d.key) + "<br/>" + "<br/>" + "Average Reading:" + "  " + d.values.mean + "<br/>" + "<br/>" + 		"Parameter:" +  "  " + selectedParameter)
	.style("left", (d3.event.pageX) + "px")
	.style("top", (d3.event.pageY - 28) + "px");
	})
	.on("mouseout", function(d) {
	div.transition()
	.duration(500)
	.style("opacity", 0);
		});

circle.exit()
	.transition()
	.duration(750)
   	.attr('opacity',0)
	.remove();		
};		
});
}





