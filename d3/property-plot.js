
////////////////////////////////////////////////////////////////////////////////

//  Plot of the different values found in the litterature for a property of a
//  particular material

////////////////////////////////////////////////////////////////////////////////

// Helper function to parse years

var parseYear = d3.time.format("%Y").parse;


function draw(property){

//                                                                   DATA EXTENT
//------------------------------------------------------------------------------


// Scales according to the data

var xmin = d3.min(property["data"], function(d) { return parseYear(d.year.toString()); })
var xmax = d3.max(property["data"], function(d) { return parseYear(d.year.toString()); })
var ymin = d3.min(property["data"], function(d) { return d.rt; })
var ymax = d3.max(property["data"], function(d) { return d.rt; })
var yrange = ymax - ymin

var xScale = d3.time.scale()
  .domain([xmin, xmax])
  .rangeRound([padding, width - padding]);

var yScale = d3.scale.linear()
  .domain([ymin-0.1*yrange, ymax+0.1*yrange])
  .rangeRound([height - padding, padding]);      

//                                                                        FIGURE
//------------------------------------------------------------------------------

// clear the div from previous figure

d3.select("#graph").select("svg").remove();

// add new figure

var figure = d3.select("#graph")
  .append("svg")
  .attr("class", "scatterplot")
  .attr("width", width)
  .attr("height", height)
  .style("shape-rendering", "geometricPrecision")                                               


// Define axes

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .tickPadding(padding / 4)
  .tickSize(-height  + padding * 2, 0);

var yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .tickPadding(padding / 4)
  .tickSize(-width + padding * 2, 0);

// Plot axes

figure.append("g")
  .attr("class", "xaxis")
  .attr("transform", "translate(0," + (height - padding) + ")")
  .call(xAxis);

figure.append("g")
  .attr("class", "yaxis")
  .attr("transform", "translate(" + padding + ",0)")
  .call(yAxis);

// Style axes text 

d3.selectAll(".xaxis text, .yaxis text")
  .attr("fill", "#999")
  .style("font-size", "12px");
  
// Style axes lines  

d3.selectAll(".xaxis line, .yaxis line")
  .attr("stroke", "#eee")
  .style("stroke-width", 1)
  .attr("fill", "none");

//                                                                        LABELS
//------------------------------------------------------------------------------
  
// Create x axis label  
figure.append("text")
  .attr("class", "axis-label")
  .attr("transform", "translate("+ (padding / 4) +","+(height / 2)+")rotate(-90)")
  .text(xAxisLabel);

// Create y axis label  
figure.append("text")
  .attr("class", "axis-label")
  .attr("transform", "translate("+ (width / 2) +","+(height-(padding / 4))+")")
  .text(yAxisLabel);
  
// Style axes labels  
figure.selectAll(".axis-label")
  .attr("text-anchor", "middle")
  .style("font-size", "12px")
  .attr("fill", "#555");

// source tooltip

figure.append("text")
    .attr("class", "tooltip")
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2) +","+ padding / 2 +")")
    .style("font-size", "18px")
    .attr("fill", "#555")
    // .style("font-weight", "bold")
    .text("mean"); 

//                                                                     PLOT DATA
//------------------------------------------------------------------------------

// create Lines

var mean = property["mean"]

var mean_line = d3.svg.line()
  .x(function(d) { return xScale(parseYear(d.year.toString())); })
  .y(function(d) { return yScale(mean); });

var std = property["std"]

var std_plus_line = d3.svg.line()
  .x(function(d) { return xScale(parseYear(d.year.toString())); })
  .y(yScale(mean+std));

var std_minus_line = d3.svg.line()
  .x(function(d) { return xScale(parseYear(d.year.toString())); })
  .y(function(d) { return yScale(mean-std); });
  

// mean value line

figure.append("path")
  .attr("d", mean_line(property["data"]))
  .attr("stroke", "#1db34f")
  .style("stroke-width", 5)

// standard deviation lines

figure.append("path")
  .attr("d", std_plus_line(property["data"]))
  .attr("stroke", "#1db34f")
  .style("stroke-width", 3)
  .style("stroke-dasharray", 3)

figure.append("path")
  .attr("d", std_minus_line(property["data"]))

// figure.selectAll("std_lines")
// .data(property)
// .enter()
// .append("line")
//   .attr("x1", xmin)
//   .attr("x2", xmax)
//   .attr("y1", yScale(mean-std))
//   .attr("y2", yScale(mean-std))

  .attr("stroke", "#1db34f")
  .style("stroke-width", 3)
  .style("stroke-dasharray", 3)

// data as scatter plot

figure.selectAll("circle")
  .data(property["data"])
  .enter()
  .append("circle")
  .attr("cx", function(d) { return xScale(parseYear(d.year.toString())); })
  .attr("cy", function(d) { return yScale(d.rt); })
  .attr("r", "8")
  .attr("stroke", "#16873c")
  .style("stroke-width", 2)
  .attr("fill", "#1db34f")
  .on("click", function(d) { 
    figure.select(".tooltip").text(function() { return d.title; }); 


    
  })

//------------------------------------------------------------------------------

}
