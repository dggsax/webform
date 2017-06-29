var PLOT_WIDTH = 300;
var PLOT_HEIGHT = 175;
var HEADROOM_PRESENT = false;

var ALREADY_BUILT = false;
var TOGGLE_PARAM = '';

/////////////////////
//                 //
//    Autopilot    //
//                 //
/////////////////////

$(document).on("mouseover", ".fa-cog", function(){
    $(this).css("background-color","#e9e9e9")
});

$(document).on("mouseleave", ".fa-cog", function(){
    $(this).css("background-color","initial");
});

$(document).on("click",".fa-cog",function(){
    build_slider_autopilot(this.id);
    // d3.select("#main_area").select("#"+this.id+"_autopilot").style("position","absolute").style("z-index","999999").style("background-color",("#f4f4f4"));
});

/////////////////////END OF AUTOPILOT/////////////////////

var datapoints = 100
var isActive;
$(document).on('pageinit', function() {

    isActive = true; //used for turning off plot updates when page not in focus
    window.onfocus = function () {
      console.log("IN FOCUS");
      isActive = true;
      $('.sbs').css('background-color',"#f9f9f9");
    };

    window.onblur = function () {
      console.log("OUT OF FOCUS");
      isActive = false;
      $('.sbs').css('background-color',"#ffde46");

    };

    //Handle sockets with server:

    var socket = io('http://localhost:3000');

    //Server sending socket containing list of valid serial ports:
    socket.on('serial list display', function(portlist){
        $("#serialport").children().remove().end();
        $.each(portlist, function (i, item) {
            $('#serialport').append($('<option>', {
                value: i,
                text : item.comName
            }));
            $('#serialport option[value='+i+']').prop('selected','selected').change();
        });
    });

    //Connect/Disconnect to Serial Port
    $('#connect').click(function(){
        console.log("esta lit");
        hootenanny();
        if($(this).text() != 'Connected (Click to Disconnect)'){
            socket.emit('serial connect request',{state: ALREADY_BUILT});
            $('#csv').val(0).slider('refresh');
            $('#alternator').val(0).slider('refresh');
            isActive = true;
        }else{
            socket.emit('serial disconnect request');
        }
        var mouseX, mouseY;
        $(document).mousemove(function(e){
          mouseX = e.pageX;
          mouseY = e.pageY;
        });
        plot_count = 0;
        timer = setInterval(function(){
          plot_count = 0;
          $.each(plots, function(index, value){
            plot_count += 1;
          });
          for (var i=0; i<plot_count;i++){
              var name = plots[i]['name'];
              switch(plot_handlers[name].constructor.name){
                case "Time_Series":
                  plot_handlers[name].step([mouseX]);
                  break;
                case "Parallel_Plot":
                  plot_handlers[name].step_p([mouseX, mouseY,300]);
                  break;
                default:
                  console.log("neither!");
                  break;

             }
          }
        }, 10);
    });

    //Update switch to connected or disconnected based on return socket from server
    socket.on('serial connected', function(){
        $('#connect').text('Connected (Click to Disconnect)');
    });
    socket.on('serial disconnected', function(){
        console.log("oh yeah disconnecting!");
        $('#connect').text('Disconnected (Click to Connect)');
    });
    socket.on('state toggle', function(val){
        console.log("toggling");
        $('#'+TOGGLE_PARAM).val(parseFloat(val)).slider('refresh');
    });

    $('#csv').change(function(){
        console.log("csv preference changed!");
        socket.emit('csv state', $(this).val())
    });
    $('#alternator').change(function(){
        console.log("desiring alternating!");
        socket.emit('alternate state', $(this).val());
    });

    // Build default toggles
    var toggle_lock = new lockToggle("lock","Page Lock",["Locked","Unlocked"],69,socket);
    var toggle_csv = new Toggle("generate_csv","Generate CSV?",["OFF","ON"],420,socket);

    //update serial port upon selection:
    $('#serialport').change(function(){
    console.log("serialport selected");
        socket.emit('serial select', $('#serialport option:selected').text());
    });
    //upadte baud rate upon selection:
    $('#baud').change(function(){
        socket.emit('baud select', $('#baud option:selected').text());
    });

    /////////////////////////////////////////////////////
    //                                                 //
    //    THIS IS WHERE YOU MAKE THE PREVIEW HAPPEN    //
    //                                                 //
    /////////////////////////////////////////////////////

    // Insert the stuff here
    // socket.on('startup',function(msg){
    function hootenanny(){
        var alt = false;
        var csv = false;
        //WIPE THE SLATE CLEAN:
        $("#main_area").empty(); //do it this way because jquery needs to be cleaned properly
        sliders = new Array();
        plots = new Array();
        plot_handlers = new Array();
        //-------
        // msg = msg+''; //convert to string...stupid I know.
      msg = "&C&S~Gonzo~commname~0~69~5&A~Gonzo~2&S~Joe~commname~0~69~5&S~Wei~commname~0~100~1&S~Jesus~commname~3~5~1&S~Wow~commname~0~3~4&T~Hehe~U1~1~5&T~Joee~F4~0~100&T~Everything~U1~0~10&T~Help~U1~0~255&T~Wowe~S4~2~5&P~Something~U1~0~1000~hi,there,wassup~line~blue&"
        // msg = "&A~DesiredAngV~5&C&S~Direct~O~0~5.0~0.1&S~DesiredAngV~A~-1~1~0.1&T~AngleV~F4~0~2.5&T~BackEMF~F4~0~5&T~MCmd~F4~0~5&H~4&"
        var sets = msg.split("&");
        var duration = 100; //default
        for (var i = 0;  i < sets.length; i++){
            var test = sets[i].split("~");
            if (test[0] == "D"){
                duration = parseFloat(test[1]);
            }
        }

        for (var i = 0;  i < sets.length; i++){
            console.log(sets[i]);
            var test = sets[i].split("~");
            console.log(test);
            switch (test[0][0]){
                case "A":
                    alt=true;
                    TOGGLE_PARAM = test[1];
                    break;
                case "C":
                    csv=true;
                    break;
                case "S":
                    var name = test[1];
                    var lo = test[3];
                    var hi = test[4];
                    var res = test[5];
                    slider_generate(name,lo,hi,res);
                    break;
                case "T":
                    var name = test[1];
                    var lo = test[3];
                    var hi = test[4];
                    var names = test[5];
                    plot_generate(name,parseFloat(lo),parseFloat(hi),duration);
                    break;
                case "H":
                    HEADROOM_PRESENT = true;
                    break;
                case "P":
                    var name = test[1];
                    var lo = test[3];
                    var hi = test[4];
                    var testing = test[5].split(",");
                    var label_names = [];
                    var color = test[7];
                    console.log("color: " + color);
                    for(z=0; z < testing.length;z++){
                      label_names[z] = testing[z];
                    }

                    label_names[testing.length] = test[6];
                    console.log("sending: " + label_names);
                    plot_generate(name,parseFloat(lo),parseFloat(hi),label_names,color);
                    break;

            }
        }
        build_sliders();
        build_plots();
        socket.emit('all set from gui');
        ALREADY_BUILT = true;

        $( function() {
            $( ".draggable" ).draggable({
                containment: "#main_area",
                snap: true
            });
        } );
    };

    ///////////////////////////
    //                       //
    //    Sending Sockets    //
    //                       //
    ///////////////////////////

    // When the page is locked/unlocked
    $('#lock').change(function(){
        console.log("lock status changed");
        var unique = 696969;
        var val = $(this).children().children().eq(1).val();
        socket.emit('toggle_update_'+unique,val)
    });


    $('._slider').change(function(){
        var message = 'change';
        console.log(message);
        console.log($(this).attr('id'),$(this).val());
        socket.emit(message,{id: $(this).attr('id'), val:$(this).val()});
    });

    /////////////////////////////
    //                         //
    //    Receiving Sockets    //
    //                         //
    /////////////////////////////

    socket.on('setup slider', function(thing){
        $("#"+thing[0]).val(parseFloat(thing[1])).slider("refresh");
    })

    socket.on('note', function(msg) {
        if (isActive){
            if (HEADROOM_PRESENT){
                h = msg.pop();
                document.getElementById("headroom").innerHTML= "more than " + h.toString() + " microseconds";
            }
            for (var i =0; i<msg.length; i++){
                plot_handlers[plots[i]['name']].step(msg[i]);
            }
        }
    });

    $(document).on("click", ".scaler",function(){

        var parent = plot_handlers[$(this).parent().parent().attr("id")];
        //console.log($(this).attr("id"));
        var parid = $(this).parent().parent().attr("id")
        switch ($(this).attr("id")){
            case parid+"VM":
                var parent_range = parent.y_range[1] - parent.y_range[0];
                var parent_mid = (parent.y_range[1] - parent.y_range[0])/2 + parent.y_range[0];
                parent.y_range[1] = (parent.y_range[1] - parent_mid)*2+parent_mid;
                parent.y_range[0] = parent_mid-(parent_mid - parent.y_range[0])*2;
                break;
            case parid+"VP":
                var parent_range = parent.y_range[1] - parent.y_range[0];
                var parent_mid = (parent.y_range[1] - parent.y_range[0])/2 + parent.y_range[0];
                parent.y_range[1] = (parent.y_range[1] - parent_mid)*0.5+parent_mid;
                parent.y_range[0] = parent_mid-(parent_mid - parent.y_range[0])*0.5;
                break;
            case parid+"RS":
                parent.y_range =parent.y_range_orig.slice(0);
                break;
            case parid+"OD":
                var diff = parent.y_range[1] - parent.y_range[0];
                var tp = diff*0.1;
                parent.y_range[1] = parent.y_range[1]+tp;
                parent.y_range[0]=parent.y_range[0]+tp;
                break;
            case parid+"OI":
                var diff = parent.y_range[1] - parent.y_range[0];
                var tp = diff*0.1;
                parent.y_range[1] = parent.y_range[1]-tp;
                parent.y_range[0] = parent.y_range[0]-tp;
                break;
        }
        parent.update();
    });


});



// function LWChart(div_id,color,y_range,height,width,vals){
//     this.div_id = div_id;
//     this.color = color;
//     this.y_range_orig = y_range.slice(0); //used for reset mechanisms.
//     this.y_range = y_range;
//     this.vals = vals;
//     this.margin = {top: 20, right: 30, bottom: 30, left: 40};
//     this.data = d3.range(this.vals).map(function() { return 0; });
//     this.height = height - this.margin.top - this.margin.bottom;
//     this.width = width - this.margin.right - this.margin.left;
//     this.setup = function(){
//         this.chart = d3.select("#"+this.div_id).append("svg")
//         .attr("id","svg_for_"+this.div_id).attr("width",width).attr("height",height).attr('style',"display:inline-block;").attr("class", "gsc");
//         this.y = d3.scale.linear().domain([this.y_range[0],this.y_range[1]]).range([this.height,0]);
//         this.x = d3.scale.linear().domain([0,this.vals-1]).range([0,this.width]);
//         this.x_axis = d3.svg.axis().scale(this.x).orient("bottom").ticks(20);
//         this.y_axis = d3.svg.axis().scale(this.y).orient("left").ticks(11);
//         this.x_grid = d3.svg.axis().scale(this.x).orient("bottom").ticks(20).tickSize(-this.height, 0, 0).tickFormat("");
//         this.y_grid = d3.svg.axis().scale(this.y).orient("left").ticks(11).tickSize(-this.width, 0, 0).tickFormat("");
//         this.chart.append("g").attr("transform","translate("+this.margin.left +","+ this.margin.top + ")");
//         this.chart.append("g").attr("class", "x axis")
//         .attr("transform","translate("+this.margin.left+","+(this.height+this.margin.top)+")").call(this.x_axis);
//         this.chart.append("g").attr("class", "y axis").attr("transform","translate("+this.margin.left+","+this.margin.top+")").call(this.y_axis);
//         this.chart.append("g").attr("class", "grid")
//         .attr("transform","translate("+this.margin.left+","+(this.height+this.margin.top)+")").call(this.x_grid);
//         this.chart.append("g").attr("class", "grid").attr("transform","translate("+this.margin.left+","+this.margin.top+")").call(this.y_grid);
//         this.line = d3.svg.line().x(function(d, i) { return this.x(i)+this.margin.left; }.bind(this)).
//         y(function(d, i) { return this.y(d)+this.margin.top; }.bind(this));
//         this.clip_id = "clipper_"+this.div_id;
//         this.clipper = this.chart.append("clipPath").attr("id", this.clip_id)
//         .append("rect").attr("x",this.margin.left).attr("y",this.margin.top)
//         .attr("width",this.width).attr("height",this.height);
//         this.trace = this.chart.append("g").append("path").datum(this.data).attr("class","line")
//         .attr("d",this.line).attr("clip-path", "url(#"+this.clip_id+")");
//         };
//     this.setup();
//     //console.log(this.div_id);
//     $("#"+this.div_id).prepend("<div class ='button_container' id = \""+this.div_id+"BC2\" >");
//     $("#"+this.div_id+"BC2").append("<button class='scaler' id=\""+this.div_id+"VP\">Z+</button><br>");
//     $("#"+this.div_id+"BC2").append("<button class='scaler' id=\""+this.div_id+"RS\">RS</button><br>");
//     $("#"+this.div_id+"BC2").append("<button class='scaler' id=\""+this.div_id+"VM\">Z-</button><br>");
//     $("#"+this.div_id).prepend("<div class ='button_container' id = \""+this.div_id+"BC1\" >");
//     $("#"+this.div_id+"BC1").append("<button class='scaler' id=\""+this.div_id+"OI\">O+</button><br>");
//     $("#"+this.div_id+"BC1").append("<button class='scaler' id=\""+this.div_id+"OD\">O-</button><br>");
//
//     this.step = function(value){
//             this.data.push(value);
//             this.trace.attr("d",this.line).attr("transform",null).transition().duration(2).ease("linear").attr("transform","translate("+this.x(-1)+",0)");
//             this.data.shift();
//     };
//     this.update = function(){
//         d3.select("#svg_for_"+this.div_id).remove();
//         this.setup();
//     };
// };

function Time_Series(div_id,title,width,height,x_range,y_range,num_traces,colors, unique, socket=null){
    var div_id = div_id;
    var title = title;
    var unique = unique;
    var socket = socket;
    var colors = colors;
    console.log("THIS ONE WILL BE " + colors)
    var y_range_orig = y_range.slice(0); //used for reset mechanisms.
    var vals_orig = x_range;
    var y_range = y_range.slice(0);
    var num_traces = num_traces;
    var vals = x_range;
    var total_height = height;
    var xchange = false;
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var data = [];
    for (var i = 0; i<num_traces; i++){
        data.push(d3.range(vals).map(function() { return 0; }));
    }
    var height = total_height - margin.top - margin.bottom;
    var total_width = width;
    var width = total_width - margin.right - margin.left;
    var overall = $("#"+div_id).append("<div id=\""+div_id+unique+"_overall\">");
    var title_div = $("#"+div_id+unique+"_overall").append("<div class=\"plot_title\" id=\""+div_id+unique+"_title\">"+title+"</div>");
    var top_row = $("#"+div_id+unique+"_overall").append("<div class=\"chart\" id=\""+div_id+unique+"top\">");
    var bottom_row = $("#"+div_id+unique+"_overall").append("<div class=\"chart\" id=\""+div_id+unique+"bot\">");
    var line;
    var traces;


    var x_axis;
    var y_axis;
    var x;
    var y;
    var x_grid;
    var y_grid;
    var chart;
    var chartBody;

    var draw_plot_region = function(){
        console.log("drawing plot for "+unique);
        if (xchange){
            xchange = false;
            if (vals> data[0].length){//increasing amount
                for (var i = 0; i<num_traces;i++){
                    var tempdata = d3.range(vals-data[i].length).map(function() { return 0; });
                    data[i] = tempdata.concat(data[i]);
                }
            }else if (vals< data[0].length){
                var to_remove = data[0].length-vals;
                for(var i =0; i<num_traces; i++){
                    data[i] = data[i].slice(-vals);
                }
            }
        }
        chart = d3.select("#"+div_id+unique+"top").append("svg")
        .attr("id","svg_for_"+div_id+unique).attr("width",total_width).attr("height",total_height).attr('style',"display:inline-block;").attr("class", "gsc");
        y = d3.scale.linear().domain([y_range[0],y_range[1]]).range([height,0]);
        x = d3.scale.linear().domain([0,vals-1]).range([0,width]);
        x_axis = d3.svg.axis().scale(x).orient("bottom").ticks(11);
        y_axis = d3.svg.axis().scale(y).orient("left").ticks(11);
        x_grid = d3.svg.axis().scale(x).orient("bottom").ticks(20).tickSize(-height, 0, 0).tickFormat("");
        y_grid = d3.svg.axis().scale(y).orient("left").ticks(11).tickSize(-width, 0, 0).tickFormat("");
        chart.append("g").attr("transform","translate("+margin.left +","+ margin.top + ")");
        chart.append("g").attr("class", "grid").attr("transform","translate("+margin.left+","+(height+margin.top)+")").call(x_grid);
        chart.append("g").attr("class", "grid").attr("transform","translate("+margin.left+","+margin.top+")").call(y_grid);
        clippy = chart.append("defs").append("svg:clipPath").attr("id",div_id+unique+"clip").append("svg:rect").attr("id",div_id+unique+"clipRect").attr("x",margin.left).attr("y",margin.top).attr("width",width).attr("height",height);
        chartBody = chart.append("g").attr("clip-path","url(#"+div_id+unique+"clip"+")");
        line = new d3.svg.line().x(function(d, i) { return x(i)+margin.left; }.bind(this)).y(function(d, i) { return y(d)+margin.top; }.bind(this));
        traces = [];
        console.log(line);
        for (var i=0; i<num_traces; i++){
            traces.push(chartBody.append("path").datum(data[i]).attr("class","line").attr("d",line).attr("stroke",colors));
        }
        chart.append("g").attr("class", "x axis").attr("transform","translate("+margin.left+","+(height+margin.top)+")").call(x_axis).selectAll("text")
        .attr("y", -5).attr("x", 20).attr("transform", "rotate(90)");
        chart.append("g").attr("class", "y axis").attr("transform","translate("+margin.left+","+margin.top+")").call(y_axis);
    };
    draw_plot_region();
    $("#"+div_id+unique+"top").prepend("<div class ='v_button_container' id = \""+div_id+unique+"BC2\" >");
    $("#"+div_id+unique+"BC2").append("<button class='scaler' id=\""+div_id+unique+"VP\">Z+</button>");
    $("#"+div_id+unique+"BC2").append("<button class='scaler' id=\""+div_id+unique+"VRS\">RS</button>");
    $("#"+div_id+unique+"BC2").append("<button class='scaler' id=\""+div_id+unique+"VM\">Z-</button>");
    $("#"+div_id+unique+"top").prepend("<div class ='v_button_container' id = \""+div_id+unique+"BC1\" >");
    $("#"+div_id+unique+"BC1").append("<button class='scaler' id=\""+div_id+unique+"OI\">O+</button>");
    $("#"+div_id+unique+"BC1").append("<button class='scaler' id=\""+div_id+unique+"OD\">O-</button>");
    $("#"+div_id+unique+"bot").append("<div class ='h_button_container' id = \""+div_id+unique+"BC4\" >");
    $("#"+div_id+unique+"BC4").append("<button class='scaler' id=\""+div_id+unique+"HM\">Z-</button>");
    $("#"+div_id+unique+"BC4").append("<button class='scaler' id=\""+div_id+unique+"HRS\">RS</button>");
    $("#"+div_id+unique+"BC4").append("<button class='scaler' id=\""+div_id+unique+"HP\">Z+</button>");
    this.step = function(values){
            //this.trace.attr("d",this.line).attr("transform",null).transition().duration(0).ease("linear").attr("transform","translate("+this.x(-1)+",0)");
            for (var i=0; i<values.length; i++){
                traces[i].attr("d",line).attr("transform",null);
                data[i].push(values[i]);
                data[i].shift();
            }
    };
    var steppo = this.step;
    var update_scales = function(){
        d3.select("#svg_for_"+div_id+unique).remove();
        draw_plot_region();
    };
    if (socket != null){
        socket.on("update_"+unique,function(values){steppo(values);});
    }
    $("#"+div_id).on("click",function(event){
        console.log(event.target.id);
        switch(event.target.id){
            case div_id+unique+"VM":
                var parent_range = y_range[1] - y_range[0];
                var parent_mid = (y_range[1] - y_range[0])/2 + y_range[0];
                y_range[1] = (y_range[1] - parent_mid)*2+parent_mid;
                y_range[0] = parent_mid-(parent_mid - y_range[0])*2;
                update_scales();
                break;
            case div_id+unique+"VP":
                var parent_range = y_range[1] - y_range[0];
                var parent_mid = (y_range[1] - y_range[0])/2 + y_range[0];
                y_range[1] = (y_range[1] - parent_mid)*0.5+parent_mid;
                y_range[0] = parent_mid-(parent_mid - y_range[0])*0.5;
                update_scales();
                break;
            case div_id+unique+"VRS":
                y_range =y_range_orig.slice(0);
                update_scales();
                break;
            case div_id+unique+"HM":
                if (vals >4){
                    vals = Math.round(vals/2);
                }
                xchange = true;
                update_scales();
                break;
            case div_id+unique+"HP":
                vals = vals*2;
                xchange = true;
                update_scales();
                break;
            case div_id+unique+"HRS":
                vals =vals_orig;
                xchange = true;
                update_scales();
                break;
            case div_id+unique+"OD":
                var diff = y_range[1] - y_range[0];
                var tp = diff*0.1;
                y_range[1] = y_range[1]+tp;
                y_range[0]=y_range[0]+tp;
                update_scales();
                break;
            case div_id+unique+"OI":
                var diff = y_range[1] - y_range[0];
                var tp = diff*0.1;
                y_range[1] = y_range[1]-tp;
                y_range[0] = y_range[0]-tp;
                update_scales();
                break;
        }
    });
};
