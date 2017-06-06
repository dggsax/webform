//###############
//##           ##
//##    WOO!   ##
//##           ##
//###############

window.onload = function(){
	console.log( "Lets do this!" );

	var submitSliderButton = document.getElementById('submitSlider');
	var submitTimeplotButton = document.getElementById('submitTimeplot');
	var table = [];
	var counter_a = 0;
	var counter_b = 0;

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

	// Update any table whenever a new array is submitted
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
			thead +="</tr>";

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
		tbody += "</tr>"
		$(updated_table_body).append(tbody);
		$(table_header).append(updated_table_body);
	}
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
			var thead = "<tr><th><Priority></th>";
			for (var key in array) {
				// do something with key
				thead += "<th>"+key+"</th>";
			}
			thead +="</tr>";

			$(updated_table_head).append(thead);
			$(table_header).append(updated_table_head);

			var updated_table_body = document.createElement("tbody");
			$(updated_table_body).attr('id', 'timeplot-table-body')
		} else {
			var updated_table_body = document.getElementById("timeplot-table-body");
		}

		// Add a new row to the table.
		var tbody = "<tr><td class='priority'>"+counter+"</td>";
		for (var key in array) {
			// do something with key
			tbody += "<td>"+array[key]+"</td>";
		}
		tbody += "</tr>"
		$(updated_table_body).append(tbody);
		$(table_header).append(updated_table_body);
	}

	//######################
	//##                  ##
	//##    Drag stuff    ##
	//##                  ##
	//######################

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

	//Make diagnosis table sortable
	$("#diagnosis_list tbody").sortable({
	    helper: fixHelperModified,
	    stop: function(event,ui) {renumber_table('#diagnosis_list')}
	}).disableSelection();

	//Delete button in table rows
	$('table').on('click','.btn-delete',function() {
	    tableID = '#' + $(this).closest('table').attr('id');
	    r = confirm('Delete this item?');
	    if(r) {
	        $(this).closest('tr').remove();
	        renumber_table(tableID);
	        }
	});

}

$(document).on("click", ".pure-checkbox", function(){
	var last_child = $(this).parent().parent().children(':last').children();
	if ( $(this).is(':checked') ) {
	    $(last_child).removeAttr('disabled')
	} else {
		$(last_child).removeAttr('style');
		$(last_child).val('');
		$(last_child).attr('disabled','');
	}
});



//Delete button in table rows
$('table').on('click','.btn-delete',function() {
    tableID = '#' + $(this).closest('table').attr('id');
    r = confirm('Delete this item?');
    if(r) {
        $(this).closest('tr').remove();
        renumber_table(tableID);
        }
});




















