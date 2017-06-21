//////////////////////////////////////////////////////////////////////////////////////////////////
//    Timeplot handler                                                                          //
//                                                                                              //
//                                                                                              //
//       Job: builds and generates timeplots then updates socket when timeplots change values   //
//                                                                                              //
//       What it needs to do: settings gear to allow specification for:                         //
//             * sin wave generation                                                            //
//             * square wave generation                                                         //
//             * amplitude                                                                      //
//			   * offset                                                                         //
//			   * frequency                                                                      //
//			   * resolution                                                                     //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////

// Function that generates plots
var plots = new Array();
function plot_generate(name,min,max,datapoints){
    var newb = document.createElement("div"); //create div
    $(newb).addClass("sbs draggable timeplot-container"); //make it sbs, dragable, and a container
    var newtitle = document.createElement("div"); //make inside div
    $(newtitle).addClass("plot_title timeplot-item").html(name); //make it title
    var newplot = document.createElement("div"); //make another div
    $(newplot).addClass("chart timeplot-item"); //make it a chart
    $(newplot).prop('id',name); //call it appropriate name
    $(newtitle).appendTo($(newb)); //add into sbs div
    $(newplot).appendTo($(newb)); //add into sbs div
    plots.push({'name':name,'plot':newb,'min':min, 'max':max, 'datapoints':datapoints});  //add entry to array.
}

// Function that builds timeplots
var plot_handlers = new Array();
function build_plots(){
    var rows,cols;
    //figure out how many rows and columns of plots
    switch (true){
        case plots.length == 4:
            rows = 2;
            cols = 2;
            break;
        case plots.length == 3:
            rows = 1;
            cols = 3;
            break;
        case plots.length>4:
            rows = Math.ceil(plots.length/3);
            cols = 3;
    }
    var plot_count = 0

    // Start constructing the html
    for (var i=0; i<rows;i++){
        // Think of this like building a grid
        var new_row = document.createElement("div"); // build div
        $(new_row).addClass("row row-centered"); // define that div as a row
        var new_col = document.createElement("div"); // create columns div for that row
        $(new_col).addClass("col-md-12"); // make a column based off of css library
        $(new_col).appendTo($(new_row)); // attach that column to the row
        for (var j=0; j<cols; j++){ // for however many columns are necessary for that row
            if (plot_count < plots.length){ 
                $(plots[plot_count]['plot']).appendTo($(new_col));
                plot_count=plot_count+1;
            }
        }
        $(new_row).appendTo($("#main_area"));   
    }
    //angle =new LWChart("Angle","red",[-100, 100],175,PLOT_HEIGHT,PLOT_WIDTH,datapoints);
    for (var i=0; i<plot_count;i++){
        var name = plots[i]['name'];
        var min = plots[i]['min'];
        var max = plots[i]['max'];
        var datapoints = plots[i]['datapoints'];
        plot_handlers[name] = new LWChart(name,"red",[min,max],PLOT_HEIGHT,PLOT_WIDTH,datapoints);
    }
};