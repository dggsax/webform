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

// Define to socket

var socket = io('http://localhost:3000');

// Function that generates sliders and stores them into an array
var sliders = new Array();
function slider_generate(name,min,max,resolution){
	var newb = document.createElement("div");
	$(newb).addClass("slider-container draggable");
	$(newb).attr('id',name);
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
function build_sliders(){
    var total_rows = Math.ceil(sliders.length/3);
    var slider_count = 0;
    for (var i = 0; i < total_rows; i++){
      var slider_div = document.getElementById("drag_container");
      for (var j = 0; j<3; j++){
        if(slider_count < sliders.length){
          $(sliders[slider_count]['obj']).appendTo($(slider_div));
          $(sliders[slider_count]['obj']).children().children().eq(1).remove("div"); // remove the freaking autogenerated input field....
          slider_count = slider_count+1;
        }
      }
      $(slider_div).appendTo($("#drag_container")).trigger("create");
    }
};

// Function that builds/hides the autopilot for a selected div
function build_slider_autopilot(div_id){
	var autopilot = div_id+'_autopilot';
	// Setupsssss
	var setup = function(){ // Build for that div the first time.
		$('#' + autopilot).append('<div class="autopilot-container" id="'+autopilot+'_holder"></div>');
		var alternator = Toggle(autopilot+'_holder',"alternate?",["no","yes"],'10'+div_id+'69',socket);
		$('#'+autopilot+'_holder').append(alternator);

		$('#'+autopilot+'_holder').append('Wave Type:<select name="waves"');

		$('#'+autopilot+'_holder').append('Wave Type:<select name="waves"'

			+ 'style="background-color:#f6f6f6;display:table-cell;width:100%;">'
			+ ' <option value="Sin">Sin</option>'
			+ ' <option value="Square">Square</option>'
			+ ' <option value="Triangle">Triangle</option>'
			+ ' <option value="Sawtooth">Sawtooth</option></select><br>');

		$('#'+autopilot+'_holder').append('Frequency (hz):<input alight="right" type="number" data-type="range"') // Attach Frequency Field

		$('#'+autopilot+'_holder').append('Frequency (hz):<input alight="right" type="number" data-type="range"' // Attach Frequency Field

			+ 'name="'+div_id+'_frequency' // create the name
			+'" id="'+div_id+'_frequency' // create the id
			+'" value="0"' // define the value
			+'" class="autopilot_frequency"'
			+ ' style="background-color:#f6f6f6;display:table-cell;width:100%"><br>');	// define the frequency type
		$('#'+autopilot+'_holder').append('Amplitude (unit):<input alight="right" type="number" data-type="range"' // Attach Frequency Field
			+ 'name="'+div_id+'_amplitude' // create the name
			+'" id="'+div_id+'_amplitude' // create the id
			+'" value="0" ' // define the value
			+'" class="autopilot_amplitude"'
			+ ' style="background-color:#f6f6f6;display:table-cell;width:100%">');	// define the resolution (step)
		$('#'+autopilot+'_holder').append('Offset (unit):<input alight="right" type="number" data-type="range"' // Attach Frequency Field
			+ 'name="'+div_id+'_offset' // create the name
			+'" id="'+div_id+'_offset' // create the id
			+'" value="0" ' // define the value
			+'" class="autopilot_frequency"' // define the class
			+ ' style="background-color:#f6f6f6;display:table-cell;width:100%">');	// define the resolution (step)=
		$('#'+autopilot+'_holder').append('Update Frequency (ms):<input alight="right" type="number" data-type="range"' // Attach Frequency Field
			+ 'name="'+div_id+'_updatefreq' // create the name
			+'" id="'+div_id+'_updatefreq' // create the id
			+'" value="0" ' // define the value
			+'" class="autopilot_frequency"' // define the class
			+ ' style="background-color:#f6f6f6;display:table-cell;width:100%">');	// define the resolution (step)=

	}
	console.log(autopilot);

	// Checks if the autopilot fOR THAT SLIDER has already been built.
	if ( $('#'+autopilot).is(':empty')) { // Build the first time, then don't touch it....
		setup();

		d3.select("#main_area").select("#"+autopilot)
		.style("top","110px").style("position","absolute")
		.style("z-index","999999")
		.style("background-color",("#f4f4f4"));

		d3.select("#" + div_id).append("div").style("height","0px")
		.style("width","0px")
		.style("position","relative")
		.style("bottom","100px")
		.style("border-width", "10px")
		.style("border-color", "transparent transparent black transparent")
		.style("border-style", "solid")
		.style("bottom","7px")
		.style("left", "6px")
		.attr("class","triangle")
		.attr("id", autopilot + "_triangle");
	} else {
		console.log("for some reason it's not empty");

	}

	// Deals with making the thingy dissapear/appear
	if ( $('#'+autopilot).is(':visible') ){
		$('#'+autopilot).hide();
		$('#' + autopilot + '_triangle').hide();
	} else {
		$('#'+autopilot).show();

		$('#' + autopilot + '_triangle').show();

	}
};

//
//$('#alternator').change(function(){
// 	console.log("desiring alternating!");
// 	socket.emit('alternate state', $(this).val());
// });
