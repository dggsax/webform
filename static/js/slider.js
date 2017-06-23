//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
//    Slider handler                                                                        //
//                                                                                          //
//       Job: builds and generates sliders then updates socket with slider value changes    //
//                                                                                          //
//       What it needs to do: settings gear to allow specification for:                     //
//             * sin wave generation                                                        //
//             * square wave generation                                                     //
//             * amplitude                                                                  //
//			   * offset                                                                     //
//			   * frequency                                                                  //
//			   * resolution                                                                 //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////

// Function that generates sliders and stores them into an array
var sliders = new Array();
function slider_generate(name,min,max,resolution){
	var newb = document.createElement("div");
	$(newb).addClass("slider-container draggable");
	$(newb).attr('id','my_num_row');
	$(newb).append('<label class="slider-item" style="border:0px solid red" for="'+name+'">'+name+':</label>'); // label as slider item
	var slider = document.createElement("div");
	$(slider).addClass("ui-slider slider-item"); // slider as slider item
	$(slider).append('<input type="number" data-type="range" name="'+name // create the name
		+'" id="'+name // create the id
		+'" value="0" min="'+min // define the min
		+'" max="'+max // define the max
		+'" step='+resolution // define the resolution (step)
		+' class="_slider">'); // finish specifying everything...
	var animated_slider = document.createElement("div");
	$(animated_slider).attr("role","application");
	$(animated_slider).addClass("ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all");
	var slider_dial = document.createElement("a");
	$(slider_dial).addClass("ui-slider-handle ui-btn ui-shadow");
	$(slider_dial).attr({
		"role":"slider",
		"type":"number",
		"aria-valuemin":min,
		"aria-valuemax":max,
		"aria-valuenow":"0",
		"aria-valuetext":"0",
		"title":"0",
		"aria-labelledby":name+"-label"
	});
	$(animated_slider).append(slider_dial);
	$(slider).append(animated_slider);
	$(newb).append(slider);
	$(newb).append('<i class="fa fa-cog fa-2x slider-item slider-settings" aria-hidden="true" id="' + name + '"></i>')
	$(newb).append('<div id="'+ name +'_autopilot"></div>')
	// $(container).append(newb);
	sliders.push({'name': name, 'obj':newb});
};

// Function that builds the sliders
function build_sliders(alt,csv){
    var total_rows = Math.ceil(sliders.length/3);
    var slider_count = 0;
    for (var i = 0; i < total_rows; i++){
      var slider_div = document.getElementById("main_area");
      for (var j = 0; j<3; j++){
        if(slider_count < sliders.length){
          $(sliders[slider_count]['obj']).appendTo($(slider_div));
          $(sliders[slider_count]['obj']).children().children().eq(1).remove("div"); // remove the freaking autogenerated input field....
          slider_count = slider_count+1;
        }
      }

      $(slider_div).appendTo($("#main_area")).trigger("create");
    }
};

// Function that builds/hides the autopilot for a selected div
function build_slider_autopilot(div_id){
	var autopilot = div_id+'_autopilot';
	var setup = function(){ // Build for that div the first time.
		// $('#'+div_id+'_autopilot').css("background-color:red;");
		$('#' + autopilot).append('<div class="autopilot-container" id="'+autopilot+'_holder"></div>');
		console.log(autopilot+'_holder');
		var alternator = Toggle(autopilot+'_holder',"alternate?",["no","yes"],'10'+div_id+'69',null);
		$('#'+autopilot+'_holder').append(alternator);
	}

	// Checks if the autopilot fOR THAT SLIDER has already been built.
	if ( $('#'+autopilot).is(':empty')) { // Build the first time, then don't touch it....
		setup();
		d3.select("#main_area").select("#"+autopilot)
    .style("top","120px").style("position","absolute")
    .style("z-index","999999")
    .style("background-color",("#f4f4f4"))
    .append("div").attr("id",autopilot).style("height","0px")
		.style("width","0px")
		.style("position","relative")
		.style("bottom","100px")
		.style("border-width", "100px")
		.style("border-color", "transparent transparent red transparent")
		.style("border-style", "solid");
		console.log("I should be building right now");
	}

	// Deals with making the thingy dissapear/appear
	if ( $('#'+autopilot).is(':visible') ){
		$('#'+autopilot).hide();
	} else {
		$('#'+autopilot).show();
	}
}

//
//$('#alternator').change(function(){
// 	console.log("desiring alternating!");
// 	socket.emit('alternate state', $(this).val());
// });
