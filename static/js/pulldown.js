function Pulldown(div_id,title,names,unique,socket=null){
    var div_id = String(div_id);
    var title = String(title);
    var names = names; //should be 2-long array of values for when switch is low or high
    var value; //holds toggle value right now
    var unique = String(unique); //unique identifying number
    var socket = socket;
    var built = false;
    var setup = function(){
        $("#"+div_id).append("<div class ='toggle_holder ui-field-contain' id=\""+div_id+unique+"_holder\"></div>");
        $("#"+div_id+unique+"_holder").append("<label for =\"" + div_id+unique+"pulldowner"+"\">"+title+": </label>");
        var build_string = "<select name=\""+ div_id+unique+"pulldowner" +"\" id=\""+div_id+unique+"pulldown"+"\">";
        for (var i=0; i<names.length; i++){
            build_string+="<option value=\""+names[i]+"\">"+names[i]+"</option>";
        }
        build_string+="</select>";
        $("#"+div_id+unique+"_holder").append(build_string);
        //$("#"+div_id+unique+"_holder").append("<select name=\""+ div_id+unique+"pulldowner" +"\" id=\""+div_id+unique+"pulldown"+"\"><option value=\""+names[0]+"\">"+names[0]+"</option><option value=\""+names[1]+"\">"+names[1]+" </option></select>");
        //$("#"+div_id+unique+"_holder").append('<label for="slider-1">Input slider:</label><input type="range" name="slider-1" id="slider-1" value="60" min="0" max="100" />');
        built = true;
        $("#"+div_id+unique+"_holder").trigger("create");
    }
    setup();
    if (socket != null){
        socket.on("update_"+unique,function(va){console.log("hit");if (built){$('#'+div_id+unique+"pulldown").val(va).selectmenu('refresh');}});
        $('#'+div_id+unique+"pulldown").on('change',function(){
            socket.emit('reporting', {'unique':unique, 'data':$(this).val()});
        });
    };
};
