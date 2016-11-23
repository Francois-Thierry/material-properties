
////////////////////////////////////////////////////////////////////////////////

//  Plot of the different values found in the litterature for a property of a
//  particular material

////////////////////////////////////////////////////////////////////////////////

// Helper function to parse years

var parseYear = d3.timeFormat("%Y").parse;

function reload_js(src) {
    $('script[src="' + src + '"]').remove();
    $('<script>').attr('src', src).appendTo('body');
}

function properties_details(event){
  var text = $(event.target).html();
  var symbol = text.split(' - ')[1].split(' = ')[0].replace('<b>', '').replace('</sub>', '').replace('<sub>', '_')
  var unit = text.split(' = ')[1].split(" ")[text.split(' = ')[1].split(" ").length-1];
  // $(selected_graph+"bibitem").html("");
  $(selected_graph).innerHTML = "";

  // find property
  if (symbol.search("\u03C7") > -1){
    symbol = symbol.replace(/\u03C7/i, "chi");
  }
    if (symbol.search("\u03B5") > -1){
    symbol = symbol.replace(/\u03B5/i, "eps");
  }
  if (symbol.indexOf("\u221E") >-1){
    symbol = symbol.replace(/\u221E/i, "inf")
  }

  property = getObjects(current_material['properties'], 'symbol', symbol)[0];

  if (symbol.indexOf("_") > -1){
      symbol = symbol.replace(/_/i, "<sub>") + "</sub>"
    }
  if (symbol.indexOf("chi") > -1){
      symbol = symbol.replace(/chi/i, "\u03C7")
    }
  if (symbol.indexOf("eps") > -1){
    symbol = symbol.replace(/eps/i, "\u03B5")
  }
  if (symbol.indexOf("inf") >-1){
    symbol = symbol.replace(/inf/i, "\u221E")
  }

  selected_graph = "#graph"+property["symbol"];
  $(selected_graph).html("");
  for (i = 0; i < property['data'].length; i++) {
    var value = property['data'][i]['value'].toString();
    bibentry = "<b>"+symbol+" = "+value+" "+unit+"</b><br/>"
    citation = getObjects(biblio, 'citationKey', property['data'][i]['ref'])[0]["entryTags"];
    bibentry += citation["author"]+"<br/>"
    bibentry += "<a target='_blank' href='https://dx.doi.org/"+citation["doi"]+"' style='text-decoration:none'><i>"+citation["title"]+"</i></a><br/>"
    bibentry += citation["journal"]+", "+citation["year"]
    $(selected_graph).append('<p>'+bibentry+'</p>');
  }
}

function make_properties_accordion(material){
  document.getElementById('properties').innerHTML = '';
  var newContent = '';
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
    if (symbol.indexOf("chi") >-1){
      symbol = symbol.replace(/chi/i, "\u03C7")
    }
    if (symbol.indexOf("eps") >-1){
      symbol = symbol.replace(/eps/i, "\u03B5")
    }
    if (symbol.indexOf("inf") >-1){
      symbol = symbol.replace(/inf/i, "\u221E")
    }

    // get the unit and format subscripts
    var unit = property["unit"]
    if (unit.indexOf("_") > -1){
      unit = unit.replace(/_/i, "<sub>") + "</sub>"
    }
    if (unit.search("eps") > -1) {
      unit = unit.replace(/eps/i, "\u03B5")
    }
    var new_id = "graph"+property["symbol"]
    // alert(new_id);
    if (std.toString() == "NaN"){
      newContent += '<dt onclick="properties_details(event)"><a href="#'+new_id+'" aria-expanded="false" aria-controls="'+new_id+'" class="accordion-title accordionTitle js-accordionTrigger">'+property['name']+' - <b>'+symbol+' = '+mean.toString()+' '+unit+'</b></a></dt>'
      newContent += '<dd class="accordion-content accordionItem is-collapsed" id="'+new_id+'" aria-hidden="true"><span id="'+new_id+'" class="graph"><p id="'+new_id+'bibitem" class="bibentry">essai</p></dd>'
      // newDiv += '<div><h3>'+property['name']+' - <b>'+symbol+' = '+mean.toString()+' '+unit+'</b></h3><span id="'+new_id+'" class="graph"><p id="'+new_id+'bibitem" class="bibentry"></p></span></div>';
    }
    else{
      newContent += '<dt onclick="properties_details(event)"><a href="#'+new_id+'" aria-expanded="false" aria-controls="'+new_id+'" class="accordion-title accordionTitle js-accordionTrigger">'+property['name']+' - <b>'+symbol+' = '+mean.toString()+' \xB1 '+std.toString()+' '+unit+'</b></a></dt>'
      newContent += '<dd class="accordion-content accordionItem is-collapsed" id="'+new_id+'" aria-hidden="true"><span id="'+new_id+'" class="graph"><p id="'+new_id+'bibitem" class="bibentry">essai</p></dd>'
      // var newDiv = '<div><h3>'+property['name']+' - <b>'+symbol+' = '+mean.toString()+' \xB1 '+std.toString()+' '+unit+'</b></h3><span id="'+new_id+'" class="graph"><p id="'+new_id+'bibitem" class="bibentry"></p></span></div>';   
    }
    // $('#properties').append(newDiv);
  });
  // $('#properties').append("<dl>");
  $('#properties').append("<dl>"+newContent+"</dl>");
  reload_js('js/accordion.js');
}
