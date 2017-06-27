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
    var plot_count = 0;
    $.each(plots, function(index, value){
      $(value['plot']).appendTo($("#main_area"));
      plot_count += 1;
    });

    //angle =new LWChart("Angle","red",[-100, 100],175,PLOT_HEIGHT,PLOT_WIDTH,datapoints);
    for (var i=0; i<plot_count;i++){
        var name = plots[i]['name'];
        var min = plots[i]['min'];
        var max = plots[i]['max'];
        var datapoints = plots[i]['datapoints'];
        if(datapoints[datapoints.length-1] == "bar" || datapoints[datapoints.length-1] == "line"){
          console.log("It worked!");
          var type = datapoints[datapoints.length-1];
          datapoints.splice(-1,1);
          console.log("name: " + name );
          console.log("max: " + max);
          console.log("min: " + min);
          console.log("type: " + type);
          plot_handlers[name] = new Parallel_Plot(datapoints.length,datapoints,PLOT_WIDTH,PLOT_HEIGHT,max,min,"black",name,type);
        }
        else{
        plot_handlers[name] = new LWChart(name,"red",[min,max],PLOT_HEIGHT,PLOT_WIDTH,datapoints);
        }
    }
};
