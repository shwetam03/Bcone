function disableRightClick()
{

	document.onkeydown = function(e) 
	{
		if(event.keyCode == 123) {
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'F'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'H'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'A'.charCodeAt(0)){
		return false;
		}
		if(e.ctrlKey && e.keyCode == 'E'.charCodeAt(0)){
		return false;
		}
	}
	if (document.layers) 
	{
		//Capture the MouseDown event.
		document.captureEvents(Event.MOUSEDOWN);

		//Disable the OnMouseDown event handler.
		document.onmousedown = function () {
			return false;
		};
	}
	else 
	{
		//Disable the OnMouseUp event handler.
		document.onmouseup = function (e) {
			if (e != null && e.type == "mouseup") {
				//Check the Mouse Button which is clicked.
				if (e.which == 2 || e.which == 3) {
					//If the Button is middle or right then disable.
					return false;
				}
			}
		};
	}

	//Disable the Context Menu event.
	document.oncontextmenu = function () 
	{
		return false;
	};
}
