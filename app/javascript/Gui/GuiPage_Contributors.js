var GuiPage_Contributors = {
		MainDevs : ["ChessDragon136","cmcg"],
		ContribDevs : ["Cragjagged","DrWatson","im85288","arcticwaters","SamES"],
		DonateSupport : ["c0m3r","Cbers","crashkelly","DaN","FrostByte","gbone8106","ginganinja","grimfandango","fc7","shorty1483","paulsalter","fluffykiwi","oleg","MongooseMan","SilentAssassin","gogreenpower","Ultroman","Spaceboy","JeremyG","strugglez"]
}

GuiPage_Contributors.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_Contributors.start = function() {
	alert("Page Enter : GuiPage_Contributors");
	
	document.getElementById("Counter").innerHTML = Main.version;
	document.getElementById("guiReturnButton").style.visibility = "";
	document.getElementById("guiReturnButton").innerHTML = "Return";
	
	document.getElementById("pageContent").innerHTML = "<div class='EpisodesSeriesInfo'>About:</div><div id=ContentAbout style='font-size:1em;' class='guiPage_Settings_Settings'></div>";
	
	var htmlToAdd = "Emby for Samsung Smart TVs is a free, opensource community project. A broad range of Smarthub devices are supported due to the generously donated time and efforts of, among others, the following people.<br>";
	htmlToAdd += "Feedback on this and other Emby products is gratefully received at emby.media/community.<br><br>"
	htmlToAdd += "<span style='font-size:1.2em;'>Main Developers</span><table><tr class='guiSettingsRow'>";
	for (var index = 0; index < this.MainDevs.length; index++) {
		if (index % 6 == 0) {
			htmlToAdd += "<tr class='guiSettingsRow'>";
		}
		htmlToAdd += "<td class='guiSettingsTD'>" + this.MainDevs[index] + "</td>";
		if (index+1 % 6 == 0) {
			htmlToAdd += "</tr>";
		}
	}
	htmlToAdd += "</tr></table><br><br>";
	htmlToAdd += "<span style='font-size:1.2em;'>Contributing Developers</span><table><tr class='guiSettingsRow'>";
	for (var index = 0; index < this.ContribDevs.length; index++) {
		if (index % 6 == 0) {
			htmlToAdd += "<tr class='guiSettingsRow'>";
		}
		htmlToAdd += "<td class='guiSettingsTD'>" + this.ContribDevs[index] + "</td>";
		if (index+1 % 6 == 0) {
			htmlToAdd += "</tr>";
		}
	}
	htmlToAdd += "</tr></table><br><br>";
	htmlToAdd += "<span style='font-size:1.2em;'>Donators, supporters and valued beta testers.</span><table><tr class='guiSettingsRow'>";
	for (var index = 0; index < this.DonateSupport.length; index++) {
		if (index % 7 == 0) {
			htmlToAdd += "<tr class='guiSettingsRow'>";
		}
		htmlToAdd += "<td class='guiSettingsTD'>" + this.DonateSupport[index] + "</td>";
		if (index+1 % 7 == 0) {
			htmlToAdd += "</tr>";
		}
	}
	
	document.getElementById("ContentAbout").innerHTML = htmlToAdd + "</tr></table>";
	
	//Set Focus for Key Events
	document.getElementById("GuiPage_Contributors").focus();
}


GuiPage_Contributors.keyDown = function() {
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
		case tvKey.KEY_LEFT:
			alert("LEFT");
			this.openMenu();
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_BLUE:
			GuiMusicPlayer.showMusicPlayer("GuiPage_Contributors");
			break;	
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			this.openMenu();
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_Contributors.openMenu = function() {
	Support.updateURLHistory("GuiPage_Contributors",null,null,null,null,null,null,null);
	GuiMainMenu.requested("GuiPage_Contributors",null);
}