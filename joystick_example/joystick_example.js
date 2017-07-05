function joystick(unique,container_width,container_height){
  var border = 10;
  d3.select("#container_overall").append("div").attr("id","jstick_container_" + unique).style("border",border + "px solid grey").style("width",container_width+"px").style("height",container_height+"px");
  d3.select("#container_overall").append("div").attr("id","checkbox_" + unique+"_div").append("input").attr("type","checkbox").attr("id","checkbox_" + unique);
  d3.select('#container_overall').append("div").append("div").attr("id","result_" + unique);
  var rect = document.getElementById("jstick_container_" +unique).getBoundingClientRect();
  var joystick = new VirtualJoystick({
  stationaryBase: true,
  baseX: container_width/2,
  baseY: container_height/2,
  container	: document.getElementById('jstick_container_' + unique),
  mouseSupport	: true,
});
  // joystick._baseEl.style.display = "none";
  joystick.addEventListener('touchStart', function(){
  console.log('down')
})
joystick.addEventListener('touchEnd', function(){
  console.log('up')
})
setInterval(function(){
  var count;
  $("#jstick_container_"+unique).mouseup(function(){
    console.log("MOUSE UP");
    //check if checkbox is checked
    if(document.getElementById("checkbox_" + unique).checked){
       count = 999;//means circle should return to center
    }
    if(count == 999){
      joystick._stickX = container_width/2;
      joystick._stickY = container_height/2;
      joystick._move(joystick._stickEl.style, (joystick._stickX - joystick._stickEl.width /2), (joystick._stickY - joystick._stickEl.height/2));
      count = 0;
    }
  });

  //will probably need to rewrite this part, deals with when the stick is dragged outside of container
  if(joystick._stickX >rect.left + container_width){
    joystick._stickX = rect.left + container_width;
  }
  else if (joystick._stickY >rect.top + container_height){
    joystick._stickY = rect.top + container_height;
  }
  else if(joystick._stickX < rect.left - border){
    joystick._stickX = rect.left - border;
  }
  else if(joystick._stickY <= rect.top - border){
    joystick._stickY = rect.top - border;
  }
  else if(joystick._stickY > rect.top + container_height && joystick._stickX > rect.left + container_width){
    joystick._stickY = rect.top + container_height;
    joystick._stickX = rect.left + container_width;
  }
  else if(joystick._stickY < rect.top && joystick._stickX <rect.left){
    joystick._stickY = rect.top;
    joystick._stickX = rect.left;
  }
  joystick._move(joystick._stickEl.style, (joystick._stickX - joystick._stickEl.width /2), (joystick._stickY - joystick._stickEl.height/2));
  var outputEl	= document.getElementById('result_' + unique);
  outputEl.innerHTML	= '<b>Result:</b> ';
    + ' dx:'+joystick.deltaX()
    + ' dy:'+joystick.deltaY()
    + (joystick.right()	? ' right'	: '')
    + (joystick.up()	? ' up'		: '')
    + (joystick.left()	? ' left'	: '')
    + (joystick.down()	? ' down' 	: '');
    x = joystick.deltaX();
    y = joystick.deltaY();
}, 1/30 * 1000);
};
