//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
//    Timeplot handler                                                                      //
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
	$(newb).addClass('param_area-item');
	$(newb).attr('id','my_num_row');
	$(newb).append('<label class="element-label" for="'+name+'">'+name+':</label>');
	var slider = document.createElement("div"); 
	$(slider).addClass("ui-slider");
	$(slider).append('<input type="range" name="'+name // create the name
		+'" id="'+name // create the id 
		+'" value="0" min="'+min // define the min
		+'" max="'+max // define the max
		+'" step='+resolution // define the resolution (step)
		+' class="paramSlider" style="width:20px;" data-role="none">'); // finish specifying everything...
	var animated_slider = document.createElement("div");
	$(animated_slider).attr("role","application");
	$(animated_slider).addClass("ui-slider-track ui-shadow-inset ui-bar-inherit ui-corner-all");
	var slider_dial = document.createElement("a");
	$(slider_dial).addType("number");
	$(slider_dial).addClass("ui-slider-handle ui-btn ui-shadow");
	$(slider_dial).addRole("slider");
	$(slider_dial).attr({
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
	sliders.push({'name': name, 'obj':newb});
};

// Function that builds the sliders
function build_sliders(alt,csv){
    var total_rows = Math.ceil(sliders.length/3);
    var slider_count = 0;
    for (var i = 0; i < total_rows; i++){
      var slider_div = document.getElementById("param_area");
      for (var j = 0; j<3; j++){
        if(slider_count < sliders.length){
          $(sliders[slider_count]['obj']).appendTo($(slider_div));
          slider_count = slider_count+1;
        }
      }
      $(slider_div).appendTo($("#param_area")).trigger("create");         
    }
};