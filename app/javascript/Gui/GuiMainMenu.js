var GuiMainMenu = {	
		menuItems : [],
		menuItemsHomePages : [],

		pageSelected : "",
		selectedDivId : 0,
		selectedDivClass : "",
		
		testModeCount : 0,
		testModeTimeout : null,
			
		isMusicPlaying : false,
		
		clockVar : null
}

GuiMainMenu.getSelectedMainMenuItem = function() {
	return this.selectedMainMenuItem;
}

//Entry Point from User Menu - ONLY RUN ONCE PER USER LOGIN
GuiMainMenu.start = function() {	
	//Generate Menu based on whether there is any of (Folders, TV, Movies, .....)
	this.menuItems.length = 0;
	this.menuItemsHomePages.length = 0;
	
	//Generate main menu items
	this.menuItemsHomePages = Support.generateTopMenu(); 
	this.menuItems = Support.generateMainMenu();
	
	//Get user details.
	//document.getElementById("menuUserName").innerHTML = "<br>"+Server.getUserName()+"<br><br>";
	var userURL = Server.getServerAddr() + "/Users/" + Server.getUserID() + "?format=json&Fields=PrimaryImageTag";
	var UserData = Server.getContent(userURL);
	if (UserData == null) { return; }
	
	//User Image
	if (UserData.PrimaryImageTag) {
		var imgsrc = Server.getImageURL(UserData.Id,"UsersPrimary",70,70,0,false,0);
		document.getElementById("menuUserImage").style.backgroundImage = "url(" + imgsrc + ")";	
	} else {
		document.getElementById("menuUserImage").style.backgroundImage = "url(images/loginusernoimage.png)";
	}
	
	//Add menu entries
	var htmlToAdd = "";
	for (var index = 0; index < this.menuItems.length;index++) {
		htmlToAdd += "<div id='" + this.menuItems[index] + "' class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/" + this.menuItems[index] + "-46x37.png)'></div>" + this.menuItems[index].replace(/_/g, ' ')+ "</div>";	
	}	
	document.getElementById("menuItems").innerHTML = htmlToAdd;
	
	//Add settings and logout
	htmlToAdd = "";
	this.menuItems.push("Search");
	htmlToAdd += "<div id=Search class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/Search-46x37.png)'></div>Search</div>";
	this.menuItems.push("Settings");
	htmlToAdd += "<div id=Settings class='menu-item'><div id='menu-Icon' class='menu-icon'style='background-image:url(images/menu/Settings-46x37.png)'></div>Settings</div>";
	this.menuItems.push("Log_Out");
	htmlToAdd += "<div id=Log_Out class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/Logout-46x37.png)'></div>Log Out</div>";	
	document.getElementById("menuItems").innerHTML += htmlToAdd;
	
	//Turn On Screensaver
	Support.screensaverOn();
	Support.screensaver();
	
	//Validate and update home page URL's
	//Convert views in http format to viewnames for settings in versions <=2.1.3
	var url1 = File.getUserProperty("View1");
	if (url1.substring(0,4) == "http") {
		alert("Converting View1");
		File.setUserProperty("View1","TVNextUp");
		File.setUserProperty("View1Name","Next Up");
	}

	var url2 = File.getUserProperty("View2");
	if (url2) {
		if (url2.substring(0,4) == "http") {
			alert("Converting View2");
			File.setUserProperty("View2","LatestMovies");
			File.setUserProperty("View2Name","Latest Movies");
		}
	}

	//Initialise view URL's
	Support.initViewUrls();
	
	//Set the page highlight colour
	Main.highlightColour = File.getUserProperty("HighlightColour");
	
	//Load Home Page
	Support.processHomePageMenu("Home");
}

//Entry Point when called from any page displaying the menu
GuiMainMenu.requested = function(pageSelected, selectedDivId, selectedDivClass) {
	//Reset Menus
	this.selectedMainMenuItem = 0;
	this.selectedSubMenuItem = 0;
	
	//UnSelect Selected Item on whatever page is loaded
	this.pageSelected = pageSelected;
	this.selectedDivId = selectedDivId;
	
	//Unhighlights the page's selected content
	if (this.selectedDivId != null) {
		if (selectedDivClass === undefined) {
			this.selectedDivClass = "UNDEFINED";
		} else {
			this.selectedDivClass = selectedDivClass;
		}
		document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("GuiPage_Setting_Changing arrowUpDown","");
		document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("highlight"+Main.highlightColour+"Background","");
		document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("highlight"+Main.highlightColour+"Text","");
		document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("seriesSelected","");
		document.getElementById(selectedDivId).className = document.getElementById(selectedDivId).className.replace("Selected","");
	}
		
	//Show Menu
	document.getElementById("menu").style.visibility = "";
	document.getElementById("menu").style.left = "0px";
	document.getElementById("page").style.left = "350px";

	//Show submenu dependant on selectedMainMenuItem
	this.updateSelectedItems();
	
	//Set Focus
	document.getElementById("GuiMainMenu").focus();
}

GuiMainMenu.updateSelectedItems = function () {		
	for (var index = 0; index < this.menuItems.length; index++){	
		if (index == this.selectedMainMenuItem) {
			document.getElementById(this.menuItems[index]).className = "menu-item highlight"+Main.highlightColour+"Background";		
		} else {
			document.getElementById(this.menuItems[index]).className = "menu-item";
		}	
    }
}

//-------------------------------------------------------------
//      Main Menu Key Handling
//-------------------------------------------------------------
GuiMainMenu.keyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Update Screensaver Timer
	Support.screensaver();
	
	//If screensaver is running 
	if (Main.getIsScreensaverRunning()) {
		//Update Main.js isScreensaverRunning - Sets to True
		Main.setIsScreensaverRunning();
		
		//End Screensaver
		GuiImagePlayer_Screensaver.stopScreensaver();
		
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode)
	{	
		case tvKey.KEY_UP:
			alert("Up");
			this.processUpKey();
			break;	
		case tvKey.KEY_DOWN:
			alert("DOWN");
			this.processDownKey();
			break;		
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processSelectedItems();
			break;
		case tvKey.KEY_PLAY:
			this.playSelectedItem();
			break;
		case tvKey.KEY_RIGHT:
		case tvKey.KEY_RETURN:
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			//Allows blocking of return from menu if page has no selectable items
			this.processReturnKey();
			break;
		case tvKey.KEY_RED:
			//this.toggleTestMode();
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiMainMenu.processSelectedItems = function() {
	
	//Selecting home when you came from home just closes the menu.
	if 	(this.menuItems[this.selectedMainMenuItem] == "Home" &&
		(this.pageSelected == "GuiPage_HomeOneItem" || this.pageSelected == "GuiPage_HomeTwoItems")) {
			this.processReturnKey();
			return;
	}
	
	//If a trailer was paused when we arrived in the menu, stop it now.
    if (GuiPage_ItemDetails.trailerState == sf.service.VideoPlayer.STATE_PAUSED) {
	    sf.service.VideoPlayer.stop();
	}

    //Close the menu
	document.getElementById("menu").style.visibility = "none";
	document.getElementById("menu").style.left = "-350px";
	document.getElementById("page").style.left = "0px";
	
	setTimeout(function(){
		Support.processHomePageMenu(GuiMainMenu.menuItems[GuiMainMenu.selectedMainMenuItem]);
	}, 200);
}

GuiMainMenu.playSelectedItem = function() {
	//Pressing play on Photos in the main menu plays a random slideshow.
	if (this.menuItems[this.selectedMainMenuItem] == "Photos") {

		//Close the menu
		document.getElementById("menu").style.visibility = "none";
		document.getElementById("menu").style.left = "-350px";
		document.getElementById("page").style.left = "0px";
		
		var userViews = Server.getUserViews();
		for (var i = 0; i < userViews.Items.length; i++){
			if (userViews.Items[i].CollectionType == "photos"){
				GuiImagePlayer.start(userViews,i,true);
			}
		}
	}
}

GuiMainMenu.processReturnKey = function() {
	if (this.pageSelected != null) {
		//As I don't want the settings page in the URL History I need to prevent popping it here (as its not added on leaving the settings page
		if (this.pageSelected != "GuiPage_Settings") {
			Support.removeLatestURL();
		}
		
		//Cheap way to unhighlight all items!
		this.selectedMainMenuItem = -1;
		this.updateSelectedItems();
		this.selectedMainMenuItem = 0;
		
		//Close the menu
		document.getElementById("menu").style.visibility = "none";
		document.getElementById("menu").style.left = "-350px";
		document.getElementById("page").style.left = "0px";
		
		if (this.pageSelected == "GuiMusicPlayer") {
			GuiMusicPlayer.showMusicPlayer(this.selectedDivId);
		}

		//Set Page GUI elements Correct & Set Focus
		if (this.selectedDivId != null) {
			if (this.selectedDivClass == "UNDEFINED") {
				document.getElementById(this.selectedDivId).className = document.getElementById(this.selectedDivId).className + " Selected";		
			} else {
				document.getElementById(this.selectedDivId).className = this.selectedDivClass;
			}
		}
		
		//If a trailer was playing, set it going again.
	    if (GuiPage_ItemDetails.trailerState == sf.service.VideoPlayer.STATE_PAUSED) {
	    	setTimeout(function(){
		    	sf.service.VideoPlayer.show();
		    	sf.service.VideoPlayer.resume();
	    	}, 300);
		}
		
		document.getElementById(this.pageSelected).focus();	
	}
}

GuiMainMenu.processUpKey = function() {
	this.selectedMainMenuItem--;
	if (this.selectedMainMenuItem < 0) {
		this.selectedMainMenuItem = this.menuItems.length-1;
	}
	this.updateSelectedItems();
}

GuiMainMenu.processDownKey = function() {
	this.selectedMainMenuItem++;
	if (this.selectedMainMenuItem >= this.menuItems.length) {
		this.selectedMainMenuItem = 0;
	}	
	this.updateSelectedItems();
}

GuiMainMenu.toggleTestMode = function() {
	if (this.testModeCount < 2) {
		this.testModeCount++;
		clearTimeout (this.testModeTimeout);
		this.testModeTimeout = setTimeout(function() {
			GuiMainMenu.testModeCount = 0;
		},3000)
	} else {
		clearTimeout (this.testModeTimeout);
		Main.setTestMode();
		GuiNotifications.setNotification("Test mode is now: " + Main.getTestMode(),"Test Mode");
		this.testModeCount = 0;
	}
}