function Numerical_Reporter(div_id,title,range,color,bg_color,unique,precision=null,socket=null){
    var div_id = div_id;
    var color = color;
    var bg_color = bg_color;
    var title = title;
    var precision = precision;
    var range = range; //shape is : [low,high]..saturate otherwise
    var value = 0.0;
    var unique = unique; //unique identifying number
    var socket = socket;

    var format = function(value){
        if (precision==null){
            return value;
        } else{
            return value.toPrecision(precision);
        }

    } 
    $("#"+div_id).append("<div class ='number_holder' id=\""+div_id+unique+"_holder\"></div>");
    $("#"+div_id+unique+"_holder").append("<div class ='number_title' id=\""+div_id+unique+"_title\">"+title+"</div>");
    $("#"+div_id+unique+"_holder").append("<div class ='reported_number' style=\"color:"+ color+";background-color:"+bg_color+";\" id=\""+div_id+unique+"_number\">"+format(value)+"</div>");
    this.step = function(value){ 
        if (range[1] != null && value> range[1]){
            value = range[1];
        }else if (range[0] != null && value <range[0]){
            value= range[0];
        }
        $("#"+div_id+unique+"_number").html(format(value));
    };
    var steppo = this.step;
    if (socket != null){
        socket.on("update_"+unique,function(val){steppo(val);});
    }
};
