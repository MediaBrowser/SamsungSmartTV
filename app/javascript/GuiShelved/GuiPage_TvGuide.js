var GuiPage_TvGuide = {
		ItemData : null,
		ChannelData : null,
		
		selectedItem : 0,
		topLeftItem : 0,
		
		startParams : []
}

GuiPage_TvGuide.start = function(title,url,selectedItem,topLeftItem) {	
	//Save Start Params	
	this.startParams = [title,url];
	
	//Reset Values
	this.selectedItem = selectedItem;
	this.topLeftItem = topLeftItem;
	
	//Load Data
	this.ChannelData = Server.getContent(url);

	if (this.ChannelData.Items.length > 0) {
		//Get Programs
		var channelIDs = "";
		for (var index = 0; index < this.ChannelData.Items.length; index++) {
			if (index == this.ChannelData.Items.length-1) {
				channelIDs += this.ChannelData.Items[index].Id;
			} else {
				channelIDs += this.ChannelData.Items[index].Id + ',';
			}
		}
		
		//Sort Date - %3A is Colon
		var d = new Date();
		var maxStartTime = d.getUTCFullYear() + "-" + (d.getUTCMonth()+1) + "-" + d.getUTCDate() + "T"+ d.getUTCHours() +"%3A30%3A00.000Z";
		var minEndTime =   d.getUTCFullYear() + "-" + (d.getUTCMonth()+1) + "-" + d.getUTCDate() + "T"+ d.getUTCHours() +"%3A00%3A01.000Z";

		var programURLs = Server.getServerAddr() + "/LiveTv/Programs?format=json&UserId=" + Server.getUserID() + "&MaxStartDate="+maxStartTime+"&MinEndDate="+minEndTime+"&channelIds=" + channelIDs;
		alert (programURLs);
		this.ItemData = Server.getContent(programURLs);
			
		this.updateDisplayedItems();
			
		//Update Selected Collection CSS
		//this.updateSelectedItems();	
			
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
	var d = new Date();
	var programCount = 0;
	var htmlToAdd = "<table id=guideTable><th>Programs</th><th colspan=3>" + d.getHours() + ":00</th><th colspan=3>" + d.getHours() + ":30</th>";
	htmlToAdd += "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
	for (var index = 0; index < this.ChannelData.Items.length; index++) {
		htmlToAdd += "<tr><td colspan=2>"+this.ChannelData.Items[index].Name+"</td>";
		
		while (programCount < this.ItemData.Items.length && this.ChannelData.Items[index].Id == this.ItemData.Items[programCount].ChannelId) {
			htmlToAdd += "<td>"+this.ItemData.Items[programCount].Name+"</td>";
			programCount++;
		}
		htmlToAdd += "</tr>";
	}
	htmlToAdd += "</table>";
	
	document.getElementById("pageContent").innerHTML = htmlToAdd;
}

//Function sets CSS Properties so show which user is selected
GuiPage_TvGuide.updateSelectedItems = function () {
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Series Selected","Series","");
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
			alert("ENTER");
			this.processSelectedItem();
			break;
		case tvKey.KEY_PLAY:
			this.playSelectedItem();
			break;	
		case tvKey.KEY_BLUE:	
			Support.logout();
			break;		
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			Support.updateURLHistory("GuiPage_TvGuide",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
			GuiMainMenu.requested("GuiPage_TvGuide",this.ItemData.Items[this.selectedItem].Id);
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_TvGuide.processSelectedItem = function(page,ItemData,startParams,selectedItem,topLeftItem) {
	Support.processSelectedItem("GuiPage_TvGuide",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null,null); 
}



GuiPage_TvGuide.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}