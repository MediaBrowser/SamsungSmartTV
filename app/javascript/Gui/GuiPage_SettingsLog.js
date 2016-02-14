var GuiPage_SettingsLog = {
		logArray : null,
		selectedBannerItem : 0,
		topLeftItem : 0,
		
		MAXCOLUMNCOUNT : 1,
		MAXROWCOUNT : 22,
		
		bannerItems : ["User Settings","Server Settings","TV Settings","Log","About"],
}

GuiPage_SettingsLog.onFocus = function() {
	GuiHelper.setControlButtons("Clear Log",null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_SettingsLog.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiPage_SettingsLog.start = function() {
	alert("Page Enter : GuiPage_SettingsLog");
	
	//Reset Vars
	this.selectedBannerItem = 3; //match Logs
	
	//Load Data
	this.logArray = FileLog.loadFile(true);  
	this.topLeftItem = this.logArray.length - GuiPage_SettingsLog.getMaxDisplay();
	this.topLeftItem = (this.topLeftItem < 0) ? 0 : this.topLeftItem;
	
	//Load Settings
	document.getElementById("pageContent").className = "";
	document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div><div id='guiTV_Show_Title' class='guiPage_Settings_Title'>Log</div>\ \
		<div id='guiPage_Settings_Settings' class='guiPage_Settings_Settings'></div>";// +
		/*"<div id='guiPage_Settings_Overview' class='guiPage_Settings_Overview'>" +
			"<div id=guiPage_Settings_Overview_Title></div>" +
			"<div id=guiPage_Settings_Overview_Content></div>" +
		"</div>";*/
	
	//Create Banner Items
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index != this.bannerItems.length-1) {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.bannerItems[index].replace(/-/g, ' ')+"</div>";			
		} else {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.bannerItems[index].replace(/-/g, ' ')+"</div>";					
		}
	}
	
	//Update Displayed
	//this.setText();
	this.updateDisplayedItems();
	this.updateSelectedBannerItems();
	document.getElementById("GuiPage_SettingsLog").focus();
}

GuiPage_SettingsLog.updateDisplayedItems = function() {
	var htmlToAdd = "<table>";
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.logArray.length); index++) {
		htmlToAdd += "<tr><td style='padding-right:5px'>"+(index+1)+"</td><td style='word-wrap:break-word;word-break:break-all;width:1500px;'>" + this.logArray[index] + "</td></tr>";
	}
	document.getElementById("guiPage_Settings_Settings").innerHTML = htmlToAdd + "</table>";
}

GuiPage_SettingsLog.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index == this.selectedBannerItem) {
			if (index != this.bannerItems.length-1) { //Don't put padding on the last one.
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding green";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem green";
			}		
		} else {
			if (index != this.bannerItems.length-1) { //Don't put padding on the last one.
				if (index == 3) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
				}
			} else {
				if (index == 3) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem";
				}
			}
		}
	}
	document.getElementById("Counter").innerHTML = (this.selectedBannerItem + 1) + "/" + (this.bannerItems.length);
}

GuiPage_SettingsLog.keyDown = function() {
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
	
	switch(keyCode) {
		//Need Logout Key
		case tvKey.KEY_UP:	
			this.processUpKey();
			break;
		case tvKey.KEY_DOWN:	
			this.processDownKey();
			break;	
		case tvKey.KEY_LEFT:
			this.processLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			this.processRightKey();
			break;	
		case tvKey.KEY_RETURN:
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			this.processSelectedItem();
			break;
		case tvKey.KEY_RED:
			FileLog.empty();
			FileLog.write("---------------------------------------------------------------------",true);
			FileLog.write("Log File Emptied by User")
			GuiPage_SettingsLog.start(); //relead
			break;
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiPage_SettingsLog");
			break;		
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			GuiMainMenu.requested("GuiPage_SettingsLog",null);
			break;	
		case tvKey.KEY_EXIT:
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_SettingsLog.processUpKey = function() {
	this.topLeftItem = this.topLeftItem - this.MAXCOLUMNCOUNT;
	if (this.topLeftItem == -1) {
		this.topLeftItem = 0;
	} else {
		this.updateDisplayedItems();
	}	
}

GuiPage_SettingsLog.processDownKey = function() {
	this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
	if (this.topLeftItem > this.logArray.length - this.getMaxDisplay()) {
		this.topLeftItem = this.topLeftItem - this.MAXCOLUMNCOUNT;
	} else {
		this.updateDisplayedItems();
	}
}

GuiPage_SettingsLog.processLeftKey = function() {
	this.selectedBannerItem--;
	if (this.selectedBannerItem < 0) {
		this.selectedBannerItem = 0;
		this.openMenu();
	} else {
		this.updateSelectedBannerItems();	
	}	
}

GuiPage_SettingsLog.openMenu = function() {
	document.getElementById("bannerItem0").className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
	GuiMainMenu.requested("GuiPage_SettingsLog","bannerItem0","guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding green");
}

GuiPage_SettingsLog.processRightKey = function() {
	this.selectedBannerItem++;
	if (this.selectedBannerItem >= this.bannerItems.length) {
		this.selectedBannerItem--;
	} else {
		this.updateSelectedBannerItems();	
	}
}

GuiPage_SettingsLog.processSelectedItem = function() {
	if (this.bannerItems[this.selectedBannerItem] == "About") {
		Support.updateURLHistory("GuiPage_Settings",null,null,null,null,0,0,null);
		GuiPage_Contributors.start();
	} else if (this.bannerItems[this.selectedBannerItem] != "Log") {
		GuiPage_Settings.start(this.bannerItems[this.selectedBannerItem]);
	}
}

GuiPage_SettingsLog.setText = function() {
	document.getElementById("guiPage_Settings_Overview_Title").innerHTML = "Log Viewer";
	document.getElementById("guiPage_Settings_Overview_Content").innerHTML = "Press the up arrow to navigate to earlier entries in the log, and down to view later entries. The log opens at the last items in the log. <br><br> Press the red button to clear the log.";
}

