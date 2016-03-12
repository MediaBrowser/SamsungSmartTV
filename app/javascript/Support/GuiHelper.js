var GuiHelper = {
		helpPage : null
}

//------------------------------------------------------------------------------------------------
//GUIHelper isn't its own window, it just controls the help contents at the bottom of the screen
//------------------------------------------------------------------------------------------------
GuiHelper.toggleHelp = function(helpPage) {
	this.helpPage = helpPage;
	if (document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility == ""){
		document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility = "hidden";
	}
	GuiHelper.setHelpPage(helpPage);
	
	//Unhide help window
	document.getElementById("Help").style.visibility = "";
	
	//Set focus
	document.getElementById("GuiHelper").focus();
}

GuiHelper.keyDown = function() {
	var keyCode;
	if (event) {
	 keyCode = event.keyCode;	
	} else {
		return;
	}
	
	switch(keyCode) {
		case tvKey.KEY_YELLOW:
		case tvKey.KEY_RETURN:
			
			//Stops Return causing the app to exit when closing help text.
			widgetAPI.blockNavigation(event);
			
			if (document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility == "hidden"){
				document.getElementById("GuiImagePlayer_ScreensaverOverlay").style.visibility = "";
			}
			
			//If required for Screensaver call in GuiImagePlayer_Screensaver
			if (document.getElementById("Help").style.visibility == "") {
				//Hide help window
				document.getElementById("Help").style.visibility = "hidden";
				
				//Set focus back to original page
				document.getElementById(this.helpPage).focus();
			}
			break;
	}
}

GuiHelper.setHelpPage = function(helpPage) {
	//switch (helpPage) {
		//case "GuiPage_IP":
		//	document.getElementById("Help").innerHTML = "Welcome to a IP";
		//	break;
		//case "GuiUsers":
		//	document.getElementById("Help").innerHTML = "Welcome to a User";
		//	break;
		//case "GuiDisplayOneItem":
		//	document.getElementById("Help").innerHTML = this.generateDisplayOneItemHelp();
		//	break;
		//default:
			//document.getElementById("Help").innerHTML = "Welcome to a page with no help written!";
			document.getElementById("HelpTitle").innerHTML = "Help Page";
			document.getElementById("HelpContent").innerHTML = this.generateDisplayOneItemHelp();
		//	break;
	//}
}

GuiHelper.generateDisplayOneItemHelp = function() {
	if (this.helpPage == "GuiImagePlayer") {
		var htmlToAdd = "Return, Stop - Ends slideshow and returns the user to the previous screen. <br> " +
		"Left, Right - Move 1 image backwards or forwards. <br>" +
		"Pause - Pause slideshow. <br>" +
		"Play - Resume slideshow. <br>" +
		"Red - Mark photo as a favourite. <br>" +
		"Green - Toggle Date/Time overlay; None | Date | Date : Time <br>" +
		"Yellow - Show this help message. <br>" +
		"Blue - When music is playing, show the music player controls. ";
		} else {
		var htmlToAdd = "Tools - Show the main menu. <br> " +
		"Return - Returns the user to the previous screen. <br> " +
		"Up, Down, Left, Right - Navigation Control. <br>" +
		"Enter - Select the highlighted item. <br>" +
		"Red - Add or remove an item on the favourites page. <br>" +
		"Green - Mark a video item as watched or unwatched. <br>" +
		"Yellow - Show this help message. <br>" +
		"Blue - When music is playing, show the music player controls. <br>" +
		"Ch. Up/Down - Skips one page of content. ";
	}
	return htmlToAdd;
	
}

GuiHelper.setControlButtons = function(redText,greenText,yellowText,blueText,returnText) {
	//Displays the coloured remote control buttons on screen to indicate their current function.
	//Each parameter is the button text. A null value means the button is hidden, 0 means don't change it.
	//The position value is calculated to group the visible buttons on the right.
	//The offset allows for longer labels.
	
	//Get the current text if needed.
	if (redText == 0){
		redText = document.getElementById("guiRedButton").innerHTML;
		if (redText == "") {
			redText = null;
			}
	}
	if (greenText == 0){
		greenText = document.getElementById("guiGreenButton").innerHTML;
		if (greenText == "") {
			greenText = null;
			}
	}
	if (yellowText == 0){
		yellowText = document.getElementById("guiYellowButton").innerHTML;
		if (yellowText == "") {
			yellowText = null;
			}
	}
	if (blueText == 0){
		blueText = document.getElementById("guiBlueButton").innerHTML;
		if (blueText == "") {
			blueText = null;
			}
	}
	if (returnText == 0){
		returnText = document.getElementById("guiReturnButton").innerHTML;
		if (returnText == "") {
			returnText = null;
		}
	}
	
	//Calculate an offset value if the label is longer than 5 characters.
	var redOffset = 0;
	if (redText != null){ 
		redOffset = (redText.length > 5) ? (redText.length -5)*20 : 0;
	}
	
	var greenOffset = 0;
	if (greenText != null){
		greenOffset = (greenText.length > 5) ? (greenText.length -5)*20 : 0;
	}
	
	var yellowOffset = 0;
	if (yellowText != null){
		yellowOffset = (yellowText.length > 5) ? (yellowText.length -5)*20 : 0;
	}
	
	var blueOffset = 0;
	if (blueText != null){
		blueOffset = (blueText.length > 5) ? (blueText.length -5)*20 : 0;
	}
	
	var returnOffset = 0;
	if (returnText != null){
		returnOffset = (returnText.length > 5) ? (returnText.length -5)*20 : 0;
	}
	
	//Add the offset values to item's standard position.
	var redPos = (redText == null) ? 0 : 570;
	redPos = redPos + redOffset + greenOffset + yellowOffset + blueOffset + returnOffset;
	var greenPos = (greenText == null) ? 0 : 460;
	greenPos = greenPos + greenOffset + yellowOffset + blueOffset + returnOffset;
	var yellowPos = (yellowText == null) ? 0 : 320;
	yellowPos = yellowPos + yellowOffset + blueOffset + returnOffset;
	var bluePos = (blueText == null) ? 0 : 190;
	bluePos = bluePos + blueOffset + returnOffset;
	var returnPos = (returnText == null) ? 0 : 100;
	returnPos = returnPos + returnOffset;
	
	//This section moves the items right if some are not being displayed.
	if (returnText == null){
		bluePos = bluePos -90;
		yellowPos = yellowPos -90;
		greenPos = greenPos -90;
		redPos = redPos -90;
	}
	if (blueText == null){
		yellowPos = yellowPos -150;
		greenPos = greenPos -150;
		redPos = redPos -150;
	}
	if (yellowText == null){
		greenPos = greenPos -130;
		redPos = redPos -130;
	}
	if (greenText == null){
		redPos = redPos -150;
	}
	
	//Set control button visibility, inner text and position.
	if (redText == null){
		document.getElementById("guiRedButton").style.visibility = "hidden";
		document.getElementById("guiRedButton").innerHTML = null;
	} else {
		document.getElementById("guiRedButton").style.visibility = "";
		document.getElementById("guiRedButton").innerHTML = redText;
		document.getElementById("guiRedButton").style.right = redPos + "px";
	}
	if (greenText == null){
		document.getElementById("guiGreenButton").style.visibility = "hidden";
		document.getElementById("guiGreenButton").innerHTML = null;
	} else {
		document.getElementById("guiGreenButton").style.visibility = "";
		document.getElementById("guiGreenButton").innerHTML = greenText;
		document.getElementById("guiGreenButton").style.right = greenPos + "px";
	}
	if (yellowText == null){
		document.getElementById("guiYellowButton").style.visibility = "hidden";
		document.getElementById("guiYellowButton").innerHTML = null;
	} else {
		document.getElementById("guiYellowButton").style.visibility = "";
		document.getElementById("guiYellowButton").innerHTML = yellowText;
		document.getElementById("guiYellowButton").style.right = yellowPos + "px";
	}
	if (blueText == null){
		document.getElementById("guiBlueButton").style.visibility = "hidden";
		document.getElementById("guiBlueButton").innerHTML = null;
	} else {
		document.getElementById("guiBlueButton").style.visibility = "";
		document.getElementById("guiBlueButton").innerHTML = blueText;
		document.getElementById("guiBlueButton").style.right = bluePos + "px";
	}
	if (returnText == null){
		document.getElementById("guiReturnButton").style.visibility = "hidden";
		document.getElementById("guiReturnButton").innerHTML = null;
	} else {
		document.getElementById("guiReturnButton").style.visibility = "";
		document.getElementById("guiReturnButton").innerHTML = returnText;
		document.getElementById("guiReturnButton").style.right = returnPos + "px";
	}
};

