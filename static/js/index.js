window.onload = function(){
	console.log( "Lets do this!" );

	var submitSliderButton = document.getElementById('submitSlider');
	var submitTimeplotButton = document.getElementById('submitTimeplot');

	submitSliderButton.onclick = function() {
		submitSlider();
		console.log("submitted slider");
	};
	
	submitTimeplotButton.onclick = function() {
		submitTimeplot();
		console.log("submitted timeplot");
	};

	// Handles submissions for Sliders
	function submitSlider(){
		// Build associative array
		var slider = {};  // denotes an Object is being created
		slider.name = document.getElementById('sliderName').value;
		slider.lowrange = document.getElementById('sliderLowrange').value;
		slider.highrange = document.getElementById('sliderHighrange').value;
		slider.stepsize = document.getElementById('sliderStepsize').value;
		console.log(slider.length);  // results in undefined
		console.log("Name is: " + slider['name']);
		console.log("lowrange is: " + slider['lowrange']);
		console.log("highrange is: " + slider['highrange']);
		console.log("stepsize is: " + slider['stepsize']);

		// Clear the form
		clearForm('#slider');
	};

	// Handles submissions for Timeplots
	function submitTimeplot(){
		// Build associative array
		var timeplot = {};  // denotes an Object is being created
		timeplot.name = document.getElementById('timeplotName').value;
		timeplot.format = document.getElementById('timeplotFormat').value;
		timeplot.lowrange = document.getElementById('timeplotLowrange').value;
		timeplot.highrange = document.getElementById('timeplotHighrange').value;
		console.log(timeplot.length);  // results in undefined
		console.log("Name is: " + timeplot['name']);
		console.log("format is: " + timeplot['format']);
		console.log("lowrange is: " + timeplot['lowrange']);
		console.log("highrange is: " + timeplot['highrange']);

		// Clear the form
		clearForm('#timeplot');
	};

	// Clears out forms specfied by ID in the format '#{id in html}'
	function clearForm(id){
		$(':input',id)
		 .not(':button, :submit, :reset, :hidden')
		 .val('')
		 .removeAttr('checked')
		 .removeAttr('selected');
	}
}

// total_forms = 1;
// for (var i = 0; i < total_forms; i++){
//   var new_form = document.createElement("form");
//   $(new_form).addClass("pure-form pure-form-aligned");
//   $(new_form).attr('id', 'slider1')
//   var fieldset = document.createElement("fieldset");
//   $(fieldset).appendTo($(new_form));
//   $("#forms").append(new_form);
// }
