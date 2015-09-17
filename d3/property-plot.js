
////////////////////////////////////////////////////////////////////////////////

//  Plot of the different values found in the litterature for a property of a
//  particular material

////////////////////////////////////////////////////////////////////////////////

// Helper function to parse years

var parseYear = d3.time.format("%Y").parse;

function list(material){
  document.getElementById('mainContainer').innerHTML = '';
  $.each(material['properties'], function(index, property){
    // get the mean value and standard deviation for the property
    var mean = d3.mean(property["data"], function(d) {return d.value;})
    var std = d3.deviation(property["data"], function(d) {return d.value;})
    // round values to 3 digits
    mean = Math.round(mean*1000)/1000
    std = Math.round(std*1000)/1000
    // get the symbol and format subscripts
    var symbol = property["symbol"]
    if (symbol.indexOf("_") > -1){
      symbol = symbol.replace(/_/i, "<sub>") + "</sub>"
    }
    // get the unit and format subscripts
    var unit = property["unit"]
    if (unit.indexOf("_") > -1){
      unit = unit.replace(/_/i, "<sub>") + "</sub>"
    }
    // $('#mainContainer').append('<div class="wrapBoxContent"><div class="button cssCollapse-target">'+property['name']+' - <b>'+symbol+' = '+mean.toString()+' \xB1 '+std.toString()+' '+unit+'</b></div><div class="cssCollapse-hiddenContent"><div class="innerText"><p>Hello</p></div></div></div>')
    // $('.button').cssCollapse();
    var new_id = "graph"+property["symbol"]
    // alert(new_id);
    var newDiv = '<div><h3>'+property['name']+' - <b>'+symbol+' = '+mean.toString()+' \xB1 '+std.toString()+' '+unit+'</b></h3><div id="'+new_id+'" class="graph"><svg></svg></div></div>';
    $('.properties_list').append(newDiv)
    // $('.properties_list').accordion({active:'false'});
  // draw(index);
  });
  $('.properties_list').accordion("refresh");
  $('.properties_list').accordion({active:'false'});

}

function draw(){

selected_graph = "#graph"+property["symbol"]
// alert(JSON.stringify(property["data"]))

//                                                                   DATA EXTENT
//------------------------------------------------------------------------------

var years = property["data"].map(function(d) { return parseYear(d.ref.substr(-4)); });
var values = property["data"].map(function(d) { return d.value; });

var yrange = d3.max(values) - d3.min(values)

var xScale = d3.time.scale()
  .domain([d3.min(years), d3.max(years)])
  .rangeRound([padding, width - padding]);

var yScale = d3.scale.linear()
  .domain([d3.min(values)-0.1*yrange, d3.max(values)+0.1*yrange])
  .rangeRound([height - padding, padding]);      

//                                                                        FIGURE
//------------------------------------------------------------------------------

// clear the div from previous figure

d3.select(selected_graph).select("svg").remove();

// add new figure

var figure = d3.select(selected_graph)
  .append("svg")
  .attr("id", "chart")
  .attr("class", "scatterplot")
  .attr("width", '100%')
  .attr("height", '100%')
  .attr("viewBox", "0 0 960 500")
  .attr("perserveAspectRatio", "xMinYMid")
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

// get the mean value and standard deviation for the property

var mean = d3.mean(property["data"], function(d) {return d.value;})
var std = d3.deviation(property["data"], function(d) {return d.value;})

var format_symbol = property["symbol"]
if (format_symbol.indexOf("_") > -1){
  format_symbol = format_symbol.replace(/_/i, "<sub>") + "</sub>"
}

// round values to 3 digits

mean = Math.round(mean*1000)/1000
std = Math.round(std*1000)/1000

// source tooltip

figure.append("text")
    .attr("class", "tooltip")
    .attr("text-anchor", "middle")
    .attr("transform", "translate("+ (width / 2) +","+ padding / 2 +")")
    .style("font-size", "18px")
    .attr("fill", "#555")
    // .style("font-weight", "bold")
    .text(""); 

//                                                                     PLOT DATA
//------------------------------------------------------------------------------

// create Lines

var mean_line = d3.svg.line()
  .x(function(d) { return xScale(parseYear(d.ref.substr(-4))); })
  .y(function(d) { return yScale(mean); });

// var std_plus_line = d3.svg.line()
//   .x(function(d) { return xScale(parseYear(d.ref.substr(-4))); })
//   .y(yScale(mean+std));

// var std_minus_line = d3.svg.line()
//   .x(function(d) { return xScale(parseYear(d.ref.substr(-4))); })
//   .y(function(d) { return yScale(mean-std); });

// mean value line

figure.append("path")
  .attr("d", mean_line(property["data"]))
  .attr("stroke", "#1db34f")
  .style("stroke-width", 5)

// // standard deviation lines

// figure.append("path")
//   .attr("d", std_plus_line(property["data"]))
//   .attr("stroke", "#1db34f")
//   .style("stroke-width", 3)
//   .style("stroke-dasharray", 3)

// figure.append("path")
//   .attr("d", std_minus_line(property["data"]))
//   .attr("stroke", "#1db34f")
//   .style("stroke-width", 3)
//   .style("stroke-dasharray", 3)

// data as scatter plot

figure.selectAll("circle")
  .data(property["data"])
  .enter()
  .append("circle")
  .attr("cx", function(d) { return xScale(parseYear(d.ref.substr(-4))); })
  .attr("cy", function(d) { return yScale(d.value); })
  .attr("r", "8")
  .attr("stroke", "#16873c")
  .style("stroke-width", 2)
  .attr("fill", "#1db34f")
  .on("click", function(d) { 
    // find property
    citation = getObjects(biblio, 'citationKey', d.ref)[0];
    figure.select(".tooltip").text(function() { return JSON.stringify(citation); });

  })

//------------------------------------------------------------------------------

}
