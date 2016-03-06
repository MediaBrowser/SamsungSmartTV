var GuiPage_TvGuide = {
		Programs : null,
		Channels : null,
		programGrid : [],
		
		selectedRow : 0,
		selectedColumn : 0,
		topChannel : 0,
		startTime : 0,
		
		bannerItems : ["Guide","Channels","Recordings"],
		startParams : []
}

GuiPage_TvGuide.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_TvGuide.start = function(title,url,selectedRow,selectedColumn,topChannel,startTime) {	
	this.programGrid = [];
	//Save Start Params	
	this.startParams = [title,url];
	
	//Reset Values
	this.selectedRow = selectedRow;
	this.selectedColumn = selectedColumn;
	this.topChannel = topChannel;
	this.startTime = startTime;
	
	//Create the banner menu and program details.
	document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div>" +
			"<div id='tvGuide' class='tvGuide'></div>" +
			"<div id=tvGuideProgramDetails class='tvGuideProgramDetails'>" +
				"<div id='tvGuideTitle' class='tvGuideTitle'></div>" +
				"<div id='tvGuideSubData' class='tvGuideSubData'></div>" +
				"<div id='tvGuideOverview' class='tvGuideOverview'></div>" +
			"</div>";
	
	//Populate the banner menu.
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index != this.bannerItems.length-1) {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";			
		} else {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";					
		}
	}
	
	//Load Data
	this.Channels = Server.getContent(url);

	if (this.Channels.Items.length > 0) {
		//Get Programs
		var channelIDs = "";
		for (var index = 0; index < this.Channels.Items.length; index++) {
			if (index == this.Channels.Items.length-1) {
				channelIDs += this.Channels.Items[index].Id;
			} else {
				channelIDs += this.Channels.Items[index].Id + ',';
			}
		}
		
		//Sort Date - %3A is Colon
		var d = this.startTime;
		var year = d.getUTCFullYear();
		var month = d.getUTCMonth()+1;
		var day = d.getUTCDate();
		var nextDay = day++;
		var hour = d.getUTCHours();
		var min = d.getMinutes();
		if (min < 10){min = "0"+min;}
		if (month < 10){month = "0"+month;}
		if (day < 10){day = "0"+day;}
		if (nextDay < 10){nextDay = "0"+nextDay;}
		if (hour < 10){hour = "0"+hour;}
		
		var maxStartDate = year + "-" + month + "-" + day + "T"+ hour + "%3A" + min + "%3A59.000Z";
		var minEndDate =   year + "-" + month + "-" + nextDay + "T"+ hour + "%3A" + min + "%3A01.000Z";

		var programsURL = Server.getServerAddr() + "/LiveTv/Programs?UserId=" + Server.getUserID() + "&MaxStartDate="+maxStartDate+"&MinEndDate="+minEndDate+"&channelIds=" + channelIDs + "&ImageTypeLimit=1&EnableImages=false&SortBy=StartDate";
		this.Programs = Server.getContent(programsURL);
			
		this.updateDisplayedItems();
		this.updateselectedItems();	
			
		//Set Focus for Key Events
		document.getElementById("GuiPage_TvGuide").focus();
	} else {
		//Set message to user
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("title").innerHTML = "Sorry";
		document.getElementById("pageContent").className = "padding60";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid";
		
		//As no content focus on menu bar and null null means user can't return off the menu bar
		GuiMainMenu.requested(null,null);
	}	
}

GuiPage_TvGuide.updateDisplayedItems = function() {
	//Create Table
	var d = Support.tvGuideStartTime(this.startTime);
	var hour = d.getUTCHours();
	var minute = d.getMinutes();
	var nextHour = hour+1;
	if (nextHour >= 24){nextHour = nextHour -24;}
	var subsequentHour = nextHour+1;
	if (subsequentHour >= 24){subsequentHour = subsequentHour -24;}
	var finalHour = subsequentHour+1;
	if (finalHour >= 24){finalHour = finalHour -24;}
	var htmlToAdd =	"<div id='tvGuideTopLine' class='tvGuideTopLine'>";
	if (minute < 30) {
		htmlToAdd +=	"<div id='tvGuideDay' class='tvGuideDay'>Today</div>" +
						"<div class='tvGuideHour'>" + hour + ":00</div>" +
						"<div class='tvGuideHour'>" + hour + ":30</div>" +
						"<div class='tvGuideHour'>" + nextHour + ":00</div>" +
						"<div class='tvGuideHour'>" + nextHour + ":30</div>" +
						"<div class='tvGuideHour'>" + subsequentHour + ":00</div>" +
						"<div class='tvGuideHour'>" + subsequentHour + ":30</div>";
	} else {
		htmlToAdd +=	"<div id='tvGuideDay' class='tvGuideDay'>Today</div>" +
						"<div class='tvGuideHour'>" + hour + ":30</div>" +
						"<div class='tvGuideHour'>" + nextHour + ":00</div>" +
						"<div class='tvGuideHour'>" + nextHour + ":30</div>" +
						"<div class='tvGuideHour'>" + subsequentHour + ":00</div>" +
						"<div class='tvGuideHour'>" + subsequentHour + ":30</div>" +
						"<div class='tvGuideHour'>" + finalHour + ":00</div>";
	}
	htmlToAdd +=	"</div>";
							
	for (var index = 0; index < this.Channels.Items.length; index++) {
		htmlToAdd += 	"<div id='" + this.Channels.Items[index].Id + "' class=tvGuideChannelLine>" +
							"<div id='" + this.Channels.Items[index].Number + "' class='tvGuideChannelName'>" + this.Channels.Items[index].Number + ": " + this.Channels.Items[index].Name + "</div>";
						
		var channelLineWidth = 0;
		var programsInThisLine = [];
		for (var programIndex = 0; programIndex < this.Programs.Items.length; programIndex++) {
			if (this.Channels.Items[index].Id == this.Programs.Items[programIndex].ChannelId) {
				programsInThisLine.push([this.Channels.Items[index].Id,this.Programs.Items[programIndex].Id]);
				//7.9px = 1min (Obviously fractions of a pixels are not possible but we want to avoid compound error. We'll round it later with ~~programWidth.)
				var programWidth = 0;
				if (Support.tvGuideProgramElapsedMins(this.Programs.Items[programIndex]) > 0) {
					programWidth = (Support.tvGuideProgramDurationMins(this.Programs.Items[programIndex]) - Support.tvGuideProgramElapsedMins(this.Programs.Items[programIndex]) + Support.tvGuideOffsetMins()) *7.9;
				} else {
					programWidth = (Support.tvGuideProgramDurationMins(this.Programs.Items[programIndex])) *7.9;
				}
				var currentChannelLineWidth = channelLineWidth;
				channelLineWidth = channelLineWidth + programWidth + 8; //the extra 8 pixels are the CSS border and margin.
				if (channelLineWidth >= 1450) {
					programWidth = 1450 - currentChannelLineWidth;
				}
				if (programWidth > 0) {
					var bgColour = "";
					if (this.Programs.Items[programIndex].IsNews) {
						bgColour = "background-color:rgba(82,51,120,1);";
					} else if (this.Programs.Items[programIndex].IsSports) {
						bgColour = "background-color:rgba(10,124,51,1);";
					} else if (this.Programs.Items[programIndex].IsKids) {
						bgColour = "background-color:rgba(11,72,125,1);";
					}
					htmlToAdd += 	"<div id='" + this.Programs.Items[programIndex].Id + "' class='tvGuideProgram' style='width:" + ~~programWidth + "px'>";
					
					if (Support.tvGuideProgramElapsedMins(this.Programs.Items[programIndex]) > 0 && Support.tvGuideProgramElapsedMins(this.Programs.Items[programIndex]) < Support.tvGuideProgramDurationMins(this.Programs.Items[programIndex])) {
						htmlToAdd += 	"<div id='tvGuideProgramName' class=tvGuideProgramName><font color=red>Live: </font>" + this.Programs.Items[programIndex].Name + "</div>";
					} else {
						htmlToAdd += 	"<div id='tvGuideProgramName' class=tvGuideProgramName>" + this.Programs.Items[programIndex].Name + "</div>";
					}
					htmlToAdd +=		"<div id='tvGuideProgramTime' class=tvGuideProgramTime>" + this.Programs.Items[programIndex].StartDate.substring(11,16) + " - " + this.Programs.Items[programIndex].EndDate.substring(11,16) + "</div>" +
										"<div id='tvGuideProgramGenre' class=tvGuideProgramGenre style='" + bgColour + "'></div>" +
									"</div>";
				}
				if (channelLineWidth >= 1450) {
					break;
				}
			}
		}
		this.programGrid[index] = programsInThisLine;
		htmlToAdd += "</div>";
		if (this.programGrid.length == 7){
			break;
		}
	}
	var timeLineHeight = 80 + (this.programGrid.length * 104);
	var timeLinePos = 355 + (Support.tvGuideOffsetMins() * 7.9);
	htmlToAdd += "<div id='tvGuideCurrentTime' class='tvGuideCurrentTime' style='height:" + timeLineHeight + "px;left:" + timeLinePos + "px;'>";
	
	document.getElementById("tvGuide").innerHTML = htmlToAdd;
}

GuiPage_TvGuide.updateselectedItems = function () {
	for (var rowIndex = 0; rowIndex < this.programGrid.length; rowIndex++) {
		for (var columnIndex = 0; columnIndex < this.programGrid[rowIndex].length; columnIndex++) {			
			if (columnIndex == this.selectedColumn && rowIndex == this.selectedRow) {
				document.getElementById(this.programGrid[rowIndex][columnIndex][1]).className = "tvGuideProgram buttonSelected";
			} else {
				document.getElementById(this.programGrid[rowIndex][columnIndex][1]).className = "tvGuideProgram tvGuideProgramBg";
			}
		}
	}
	
	var programmeURL = Server.getItemInfoURL(this.programGrid[this.selectedRow][this.selectedColumn][1],"");
	var ProgrammeData = Server.getContent(programmeURL);
	document.getElementById("tvGuideTitle").innerHTML = ProgrammeData.ChannelName;
	document.getElementById("tvGuideSubData").innerHTML = ProgrammeData.Name;
	document.getElementById("tvGuideOverview").innerHTML = ProgrammeData.Overview;
	Support.scrollingText("tvGuideOverview");
}

GuiPage_TvGuide.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	switch(keyCode) {
		//Need Logout Key
		case tvKey.KEY_LEFT:
			alert("LEFT");	
			this.processLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");	
			this.processRightKey();
			break;		
		case tvKey.KEY_UP:
			alert("UP");
			this.processUpKey();
			break;	
		case tvKey.KEY_DOWN:
			alert("DOWN");
			this.processDownKey();
			break;	
		case tvKey.KEY_PANEL_CH_UP: 
		case tvKey.KEY_CH_UP: 
			this.processChannelUpKey();
			break;			
		case tvKey.KEY_PANEL_CH_DOWN: 
		case tvKey.KEY_CH_DOWN: 
			this.processChannelDownKey();
			break;	
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
		case tvKey.KEY_PLAY:
			alert(this.programGrid[this.selectedRow][this.selectedColumn][0]);
			this.playSelectedItem();
			break;	
		case tvKey.KEY_BLUE:	
			Support.logout();
			break;		
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			Support.updateURLHistory("GuiPage_TvGuide",this.startParams[0],this.startParams[1],null,null,this.selectedRow,this.topChannel,null);
			GuiMainMenu.requested("GuiPage_TvGuide",this.ItemData.Items[this.selectedRow].Id);
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_TvGuide.processLeftKey = function() {
	if (this.selectedColumn > 0) {
		this.selectedColumn--;
		this.updateselectedItems();
	} else {
		var guideTime = new Date();
		var timeMsec = this.startTime.getTime();
		var newTime = timeMsec - 9000000; //move the clock back 2.5 hours.
		guideTime.setTime(newTime);
		GuiPage_TvGuide.start("Guide",this.startParams[1],0,0,0,guideTime);
	}
}

GuiPage_TvGuide.processRightKey = function() {
	if (this.selectedColumn < this.programGrid[this.selectedRow].length-1) {
		this.selectedColumn++;
		this.updateselectedItems();
	} else {
		var guideTime = new Date();
		var timeMsec = this.startTime.getTime();
		var newTime = timeMsec + 9000000; //move the clock forward 2.5 hours.
		guideTime.setTime(newTime);
		GuiPage_TvGuide.start("Guide",this.startParams[1],0,0,0,guideTime);
	}
}

GuiPage_TvGuide.processUpKey = function() {
	if (this.selectedRow > 0) {
		while (this.selectedColumn > this.programGrid[this.selectedRow-1].length-1) {
			this.selectedColumn--;
		}
		this.selectedRow--;
		this.updateselectedItems();
	}
}

GuiPage_TvGuide.processDownKey = function() {
	if (this.selectedRow < this.programGrid.length-1) {
		while (this.selectedColumn > this.programGrid[this.selectedRow+1].length-1) {
			this.selectedColumn--;
		}
		this.selectedRow++;
		this.updateselectedItems();
	}
}

GuiDisplay_Series.processSelectedBannerItem = function() {
	if (this.selectedRow == -1) {
		switch (this.bannerItems[this.selectedBannerItem]) {
		case "Recordings":
			var url = Server.getCustomURL("/LiveTV/Recordings?IsInProgress=false&SortBy=StartDate&SortOrder=Descending&StartIndex=0&fields=SortName&UserId=" + Server.getUserID());
			GuiDisplay_Series.start("Recordings LiveTV",url,0,0);
			break;
		case "Guide":
			var url = Server.getCustomURL("/LiveTV/Channels?StartIndex=0&Limit=100&EnableFavoriteSorting=true&UserId=" + Server.getUserID());
			var guideTime = new Date();
			var timeMsec = guideTime.getTime();
			var startTime = timeMsec - 900000; //rewind the clock fifteen minutes.
			guideTime.setTime(startTime);
			GuiPage_TvGuide.start("Guide",url,0,0,0,guideTime);
			break;
		}
	}
}

GuiPage_TvGuide.playSelectedItem = function () {
	Support.updateURLHistory("GuiPage_TvGuide",this.startParams[0],this.startParams[1],null,null,this.selectedRow,this.topChannel,null);
	var url = Server.getItemInfoURL(this.programGrid[this.selectedRow][this.selectedColumn][0],"&ExcludeLocationTypes=Virtual");
	GuiPlayer.start("PLAY",url,0,page);
}

GuiPage_TvGuide.returnFromMusicPlayer = function() {
	this.selectedRow = 0;
	this.updateDisplayedItems();
	this.updateselectedRows();
}