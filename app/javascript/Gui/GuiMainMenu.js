var GuiMainMenu = {	
		menuItems : [],
		menuItemsHomePages : [],

		pageSelected : "",
		pageSelectedId : 0,
		pageSelectedClass : "",
		
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
	//document.getElementById("menuUserName").innerHTML = Server.getUserName();
	alert(this.menuItems.length);
	if (this.menuItems.length < 10){
		document.getElementById("menuUserName").innerHTML = "<br>";
	}
	document.getElementById("menuUserName").style.visibility = "";
	var userURL = Server.getServerAddr() + "/Users/" + Server.getUserID() + "?format=json&Fields=PrimaryImageTag";
	var UserData = Server.getContent(userURL);
	if (UserData == null) { return; }
	
	if (UserData.PrimaryImageTag) {
		var imgsrc = Server.getImageURL(UserData.Id,"UsersPrimary",60,60,0,false,0);
		document.getElementById("menuUserImage").style.backgroundImage = "url(" + imgsrc + ")";	
	} else {
		document.getElementById("menuUserImage").style.backgroundImage = "url(images/usernoimage.png)";
	}
	
	//Add menu entries
	var htmlToAdd = "";
	for (var index = 0; index < this.menuItems.length;index++) {
		htmlToAdd += "<div id='" + this.menuItems[index] + "' class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/" + this.menuItems[index] + "-23x19.png)'></div>" + this.menuItems[index].replace(/-/g, ' ')+ "</div>";	
	}	
	document.getElementById("menuItems").innerHTML = htmlToAdd;
	
	//Add settings and logout
	htmlToAdd = "";
	this.menuItems.push("Search");
	htmlToAdd += "<div id=Search class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/Search-23x19.png)'></div>Search</div>";
	this.menuItems.push("Settings");
	htmlToAdd += "<div id=Settings class='menu-item'><div id='menu-Icon' class='menu-icon'style='background-image:url(images/menu/Settings-23x19.png)'></div>Settings</div>";
	//this.menuItems.push("Contributors");
	//htmlToAdd += "<div id=Contributors class='menu-item'><div id='menu-Icon' class='menu-icon'style='background-image:url(images/menu/Code-23x19.png)'></div>Contributors</div>";
	this.menuItems.push("Log-Out");
	htmlToAdd += "<div id=Log-Out class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/Logout-23x19.png)'></div>Log Out</div>";	
	//this.menuItems.push("Log-Out_Delete");
	//htmlToAdd += "<div id=Log-Out_Delete class='menu-item'><div id='menu-Icon' class='menu-icon' style='background-image:url(images/menu/Secure-Logout-23x19.png)'></div>Log Out and Forget</div>";	
	document.getElementById("menuItems").innerHTML += htmlToAdd;
	
	//Function to generate random backdrop
	this.backdropTimeout = setTimeout(function(){
		var randomImageURL = Server.getItemTypeURL("&SortBy=Random&IncludeItemTypes=Series,Movie&Recursive=true&CollapseBoxSetItems=false&Limit=20");
		var randomImageData = Server.getContent(randomImageURL);
		if (randomImageData == null) { return; }
		
		for (var index = 0; index < randomImageData.Items.length; index++) {
			if (randomImageData.Items[index ].BackdropImageTags.length > 0) {
				var imgsrc = Server.getBackgroundImageURL(randomImageData.Items[index ].Id,"Backdrop",960,540,0,false,0,randomImageData.Items[index ].BackdropImageTags.length);
				Support.fadeImage(imgsrc);
				break;
			}
		}
	}, 500);
	
	//Turn On Screensaver
	Support.screensaverOn();
	Support.screensaver();
	
	//Load Home Page
	Support.processHomePageMenu("Home");
}

//Entry Point when called from any page displaying the menu
GuiMainMenu.requested = function(pageSelected, pageSelectedId, pageSelectedClass) {
	//Reset Menus
	this.selectedMainMenuItem = 0;
	this.selectedSubMenuItem = 0;
	
	//UnSelect Selected Item on whatever page is loaded
	this.pageSelected = pageSelected;
	this.pageSelectedId = pageSelectedId;
	
	//Unhighlights the page's selected content
	if (this.pageSelectedId != null) {
		if (pageSelectedClass === undefined) {
			this.pageSelectedClass = "UNDEFINED";
		} else {
			this.pageSelectedClass = pageSelectedClass;
		}
		alert("pageSelectedId: "+pageSelectedId);
		document.getElementById(pageSelectedId).className = document.getElementById(pageSelectedId).className.replace("Selected","");
		document.getElementById(pageSelectedId).className = document.getElementById(pageSelectedId).className.replace("EpisodeListSelected","");
	}
		
	//Show Menu
	document.getElementById("menu").style.visibility = "";
	$('.menu').animate({
		left: 0
	}, 300, function() {
		//animate complete.
	});
	$('.page').animate({
		left: 200
	}, 300, function() {
		//animate complete.
	});
/*	$('.pageBackground').animate({
		left: 200
	}, 300, function() {
		//animate complete.
	});*/

	//Show submenu dependant on selectedMainMenuItem
	this.updateSelectedItems();
	
	//Set Focus
	document.getElementById("GuiMainMenu").focus();
}

GuiMainMenu.updateSelectedItems = function () {		
	for (var index = 0; index < this.menuItems.length; index++){	
		if (index == this.selectedMainMenuItem) {
			document.getElementById(this.menuItems[index]).className = "menu-itemSelected";		
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
	//If a trailer was paused when we arrived in the menu, stop it now.
    if (GuiPage_ItemDetails.trailerState == sf.service.VideoPlayer.STATE_PAUSED) {
	    sf.service.VideoPlayer.stop();
	}
	$('.menu').animate({
		left: -200
	}, 300, function() {
		document.getElementById("menu").style.visibility = "hidden";
	});
	$('.page').animate({
		left: 0
	}, 300, function() {
		//animate complete.
	});
	$('.pageBackground').animate({
		left: 0
	}, 300, function() {
		//animate complete.
	});
	setTimeout(function(){
		Support.processHomePageMenu(GuiMainMenu.menuItems[GuiMainMenu.selectedMainMenuItem]);
	}, 310);
}

GuiMainMenu.playSelectedItem = function() {
	//Pressing play on Photos in the main menu plays a random slideshow.
	if (this.menuItems[this.selectedMainMenuItem] == "Photos") {
		//Close the menu
		$('.menu').animate({
			left: -200
		}, 300, function() {
			document.getElementById("menu").style.visibility = "hidden";
		});
		$('.page').animate({
			left: 0
		}, 300, function() {
			//animate complete.
		});
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
		
		//Hide Menu
		$('.menu').animate({
			left: -200
		}, 300, function() {
			document.getElementById("menu").style.visibility = "hidden";
		});
		$('.page').animate({
			left: 0
		}, 300, function() {
			//animate complete.
		});
		$('.pageBackground').animate({
			left: 0
		}, 300, function() {
			//animate complete.
		});
		
		if (this.pageSelected == "GuiMusicPlayer") {
			GuiMusicPlayer.showMusicPlayer(this.pageSelectedId);
		}
		
		//Set Page GUI elements Correct & Set Focus
		if (this.pageSelectedId != null) {
			if (this.pageSelectedClass == "UNDEFINED") {
				document.getElementById(this.pageSelectedId).className = document.getElementById(this.pageSelectedId).className + " Selected";		
			} else {
				document.getElementById(this.pageSelectedId).className = this.pageSelectedClass;
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