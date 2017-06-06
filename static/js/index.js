window.onload = function(){
	console.log( "Lets do this!" );

	var submitSliderButton = document.getElementById('submitSlider');
	var submitTimeplotButton = document.getElementById('submitTimeplot');
	var table = [];
	var counter = 0;

	submitSliderButton.onclick = function() {
		submitSlider();
		console.log("submitted slider");
	};
	
	submitTimeplotButton.onclick = function() {
		submitTimeplot();
		console.log("submitted timeplot");
	};

	// Han$dles submissions for Sliders
	function submitSlider(){
		counter += 1;
		// Build associative array
		var slider = {};  // denotes an Object is being created
		slider.name = document.getElementById('sliderName').value;
		slider.lowrange = document.getElementById('sliderLowrange').value;
		slider.highrange = document.getElementById('sliderHighrange').value;
		slider.stepsize = document.getElementById('sliderStepsize').value;
		slider.alternate = '<input type="checkbox" class="pure-checkbox" name="slider-checkbox-'+counter+'" id="alt_'+counter+'">';
		slider.period = '<input id="slider_period_'+counter+'" type="number" placeholder="any number" disabled>';
		
		// Update the table	
		sliderTable(slider, counter);

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

		// Prints info to console (honestly just comment out when you know the array works...)
		// console.log(timeplot.length);  // results in undefined
		// console.log("Name is: " + timeplot['name']);
		// console.log("format is: " + timeplot['format']);
		// console.log("lowrange is: " + timeplot['lowrange']);
		// console.log("highrange is: " + timeplot['highrange']);

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

	// Update any table whenever a new array is submitted
	function sliderTable(array, counter) {
		// Grab existing/new table element
		var updated_table = document.getElementById("slider-table");

		// For initialization of the table, otherwise it adds column labels
		// everytime a new thing is added...
		if (counter < 2) {
			
			$(updated_table).addClass("pure-table pure-table-bordered");

			// Build the table head (Columns...)
			var updated_table_head = document.createElement("thead");
			var thead = "<tr>";
			for (var key in array) {
				// do something with key
				thead += "<th>"+key+"</th>";
			}
			thead +="</tr>";

			$(updated_table_head).append(thead);
			$(updated_table).append(updated_table_head);

			var updated_table_body = document.createElement("tbody");
			$(updated_table_body).attr('id', 'slider-table-body')
		} else {
			var updated_table_body = document.getElementById("slider-table-body");
		}

		// Add a new row to the table.
		var tbody = "<tr>";
		for (var key in array) {
			// do something with key
			tbody += "<td>"+array[key]+"</td>";
		}
		tbody += "</tr>"
		$(updated_table_body).append(tbody);
		$(updated_table).append(updated_table_body);
	}
	
}

$(document).on("click", ".pure-checkbox", function(){
	var element = document.getElementById(this.id);
	console.log(element);
});

























