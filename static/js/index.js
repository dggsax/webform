//#######################################################
//##                                                   ##
//##    Javascript for the index page of the webform   ##
//##                                                   ##
//#######################################################

window.onload = function(){
	console.log( "Lets do this!" );

	// Initialize the buttons
	var submitSliderButton = document.getElementById('submitSlider');
	var submitTimeplotButton = document.getElementById('submitTimeplot');
	

	// Initialize the tables list as well as other things, like counters...
	var table = [];
	var counter_a = 0;
	var counter_b = 0;

	// Do stuff when the submit button for sliders is clicked
	submitSliderButton.onclick = function() {
		// Run function to grab info from form to the table
		submitSlider();
		// Debug message
		console.log("submitted slider");
	};
	
	// Do stuff when the submit button for timeplots is clicked
	submitTimeplotButton.onclick = function() {
		// Run function to grab info from form to the table
		submitTimeplot();
		// Debug message
		console.log("submitted timeplot");
	};

	// Handles submissions for Sliders
	function submitSlider(){
		counter_a += 1;
		// Build associative array
		var slider = {};
		slider.name = document.getElementById('sliderName').value;
		slider.lowrange = document.getElementById('sliderLowrange').value;
		slider.highrange = document.getElementById('sliderHighrange').value;
		slider.stepsize = document.getElementById('sliderStepsize').value;
		slider.alternate = '<input type="checkbox" class="pure-checkbox" name="slider-checkbox-'+counter_a+'" id="alt_'+counter_a+'">';
		slider.period = '<input id="slider_period_'+counter_a+'" type="number" placeholder="any number" step="any" disabled>';
		
		// Update the table	
		sliderTable(slider, counter_a);

		// Clear the form
		clearForm('#slider');
	};

	// Handles submissions for Timeplots
	function submitTimeplot(){
		counter_b += 1;
		// Build associative array
		var timeplot = {};  // denotes an Object is being created
		timeplot.name = document.getElementById('timeplotName').value;
		timeplot.format = document.getElementById('timeplotFormat').value;
		timeplot.lowrange = document.getElementById('timeplotLowrange').value;
		timeplot.highrange = document.getElementById('timeplotHighrange').value;

		// Build the table
		timeplotTable(timeplot, counter_b);

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

	// Make and/or update the slider table
	function sliderTable(array, counter) {
		// Grab existing/new table element
		var table_div = document.getElementById("slider-table-div");

		// For initialization of the table, otherwise it adds column labels
		// everytime a new thing is added...
		if (counter < 2) {
			var table_header = document.createElement("table");
			$(table_header).addClass("pure-table pure-table-bordered");
			$(table_header).attr('id','slider-table')
			$(table_div).append(table_header);
			// Build the table head (Columns...)
			var updated_table_head = document.createElement("thead");
			var thead = "<tr><Order>";
			for (var key in array) {
				// do something with key
				thead += "<th>"+key+"</th>";
			}
			thead +="<th>Delete?</th></tr>";

			$(updated_table_head).append(thead);
			$(table_header).append(updated_table_head);

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
		tbody += '<td><i class="fa fa-trash" aria-hidden="true"></i></td></tr>'
		$(updated_table_body).append(tbody);
		$(table_header).append(updated_table_body);
	}

	// Make/update the timeplot table
	function timeplotTable(array, counter) {
		// Grab existing/new table element
		var table_div = document.getElementById("timeplot-table-div");

		// For initialization of the table, otherwise it adds column labels
		// everytime a new thing is added...
		if (counter < 2) {
			var table_header = document.createElement("table");
			$(table_header).addClass("pure-table pure-table-bordered");
			$(table_header).attr('id','timeplot-table')
			$(table_div).append(table_header);

			// Build the table head (Columns...)
			var updated_table_head = document.createElement("thead");
			// <tr><th>Priority</th>
			var thead = "<tr>";
			for (var key in array) {
				// do something with key
				thead += "<th>"+key+"</th>";
			}
			thead +="<th>Delete?</th></tr>";

			$(updated_table_head).append(thead);
			$(table_header).append(updated_table_head);

			var updated_table_body = document.createElement("tbody");
			$(updated_table_body).attr('id', 'timeplot-table-body')
		} else {
			var updated_table_body = document.getElementById("timeplot-table-body");
		}

		// Add a new row to the table.
		var tbody = "<tr draggable='true' data-letter='a'>";
		for (var key in array) {
			// do something with key
			tbody += "<td>"+array[key]+"</td>";
		}
		tbody += '<td><i class="fa fa-trash" aria-hidden="true"></i></td></tr>'
		$(updated_table_body).append(tbody);
		$(table_header).append(updated_table_body);
	}	
}


//#######################################
//##                                   ##
//##    Make the tables reorderable    ##
//##                                   ##
//#######################################

$(document).on("click", "#submitTimeplot, #submitSlider", function(){
	//Make slider table sortable
	$("#slider-table tbody").sortable({
	    helper: fixHelperModified,
	    stop: function(event,ui) {}
	}).disableSelection();

	//Make timeplot table sortable
	$("#timeplot-table tbody").sortable({
	    helper: fixHelperModified,
	    stop: function(event,ui) {}
	}).disableSelection();

	//Delete button in table rows
	$('table').on('click','.fa-trash',function() {
		$(this).closest('tr').remove();
	});

	//Helper function to keep table row from collapsing when being sorted
	var fixHelperModified = function(e, tr) {
	    var $originals = tr.children();
	    var $helper = tr.clone();
	    $helper.children().each(function(index) 
	    {
	      $(this).width($originals.eq(index).width())
	    });
	    return $helper;
	};
});

//#######################################################
//##                                                   ##
//##    Animate the checkboxes for the sliders table   ##
//##                                                   ##
//#######################################################

$(document).on("click", ".pure-checkbox", function(){
	// Selects the checkbox (notice it does the second to last child because of the trashcan)
	var last_child = $(this).parent().parent().children(':nth-last-child(2)').children();
	if ( $(this).is(':checked') ) { 	// If the thing is checked
	    $(last_child).removeAttr('disabled') // Make it so the user can modify the stuff in the table
	} else { 	// If the thing is un-checked
		$(last_child).removeAttr('style'); 
		$(last_child).val('');
		$(last_child).attr('disabled','');
	}
}); 

//##############################################################
//##                                                          ##
//##    Hides tables if there are no entries, for prettyness  ##
//##                                                          ##
//##############################################################

// Call the CheckTables function after 100 milliseconds
setInterval(CheckTables, 100);

function CheckTables() {
	// Identifies all the tables and goes through them

	var previewButton = document.getElementById('preview');
	var buildButton = document.getElementById('build');
	
    $( "table" ).each(function( index ) {
		$(this).find('tbody:empty').parent().hide();
		$(this).find('tbody:not(:empty)').parent().show();
    });

    if($('.pure-table').children(':visible').length != 0) {
    	// action when all are hidden
    	// var previewButton = document.getElementById('preview');
    	previewButton.style.display = "unset";
    	buildButton.style.display = "unset";
    } else {
    	previewButton.style.display = "none";
    	buildButton.style.display = "none";
    }
}