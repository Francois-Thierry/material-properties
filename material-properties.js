
////////////////////////////////////////////////////////////////////////////////

//  Plot of the different values found in the litterature for a property of a
//  particular material

////////////////////////////////////////////////////////////////////////////////

// // Helper function to parse years

// var parseYear = d3.timeFormat("%Y").parse;

// function reload_js(src) {
//     $('script[src="' + src + '"]').remove();
//     $('<script>').attr('src', src).appendTo('body');
// }

function properties_details(event){
  selectedProperty = $(event.target);
  selectedItem = selectedProperty.next();
  // console.log(selectedItem.html())
    var text = selectedProperty.html();
    console.log(selectedItem.html())

  if (selectedItem.html() == "") {
    selectedProperty.addClass("active")

    var symbol = text.split(' - ')[1].split(' = ')[0].replace('<b>', '').replace('</sub>', '').replace('<sub>', '_')
    var unit = text.split(' = ')[1].split(" ")[text.split(' = ')[1].split(" ").length-1];

    // $(selectedProperty).innerHTML = "";

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

    property = material.properties.filter(function(el){return el.symbol == symbol})[0];

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

    // selectedItem = ".bib"+property["symbol"];
    // selectedItem = selectedProperty.find(".bibitem");
    // console.log(selectedItem)
    // $(selectedItem).html("");
    for (i = 0; i < property['data'].length; i++) {
      var value = property['data'][i]['value'].toString();
      bibentry = "<div class='property-item'><div class='property-value'>"+symbol+" = "+value+" "+unit+"</div>"
      citation = biblio.filter(function(el){return el.citationKey == property['data'][i]['ref']})[0]["entryTags"];
      // citation = getObjects(biblio, 'citationKey', property['data'][i]['ref'])[0]["entryTags"];
      bibentry += "<div class='property-source'>"+citation["author"]+"<br/>"
      bibentry += "<a target='_blank' href='https://dx.doi.org/"+citation["doi"]+"' style='text-decoration:none'>"+citation["title"]+"</a><br/>"
      bibentry += citation["journal"]+", "+citation["year"]+"</div></div>"
      $(selectedItem).append(bibentry);
    }
  } else {
    selectedItem.html("")
    selectedProperty.removeClass("active")
  }

  // if (selectedProperty.find(".bibitem").html() && selectedProperty.find(".bibitem").html() != "") {
  //   $(selectedItem).html("");

  // } else {
    
  // }
}

function make_properties_accordion(material){
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
    var new_id = property["symbol"]
    // alert(new_id);
    if (std.toString() == "NaN"){
      newContent += '<p class="property" onclick="properties_details(event)">'+property['name']+' - '+symbol+' = '+mean.toString()+' '+unit+'</p><p class="bibitem"></p>'
    }
    else{
      newContent += '<p class="property" onclick="properties_details(event)">'+property['name']+' - '+symbol+' = '+mean.toString()+' \xB1 '+std.toString()+' '+unit+'<p class="bibitem"></p></p>'
      // newContent += '<dd class="accordion-content accordionItem is-collapsed" id="'+new_id+'" aria-hidden="true"><span id="'+new_id+'" class="graph"><p id="'+new_id+'bibitem" class="bibentry"></p></dd>'   
    }
    // newContent += '<p></p>';
    // $('#properties').append(newDiv);
  });
  // $('#properties').append("<dl>");
  $('#properties').append(newContent);
  // reload_js('js/accordion.js');
}
