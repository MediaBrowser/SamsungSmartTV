var GuiPage_TvChannel = {
		ItemData : null,
		ItemIndexData : null,
		
		selectedItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 7, 
		MAXROWCOUNT : 3,
		
		startParams : []
}

GuiPage_TvChannel.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiPage_TvChannel.start = function(title,url,selectedItem,topLeftItem) {	
	alert("Page Enter : GuiPage_TvChannel");
	//Save Start Params	
	this.startParams = [title,url];
	
	//Reset Values
	this.selectedItem = selectedItem;
	this.topLeftItem = topLeftItem;
	
	//Load Data
	this.ItemData = Server.getContent(url);

	//Update Page
	document.getElementById("pageContent").innerHTML = "<div id=Center class='SeriesCenter'><div id=Content></div></div>" +
	"<div id=SeriesContent class='SeriesContent'><div id='SeriesTitle' style='position:relative; height:40px; font-size:1.6em;'></div>" +
	"<div id='SeriesSubData' style='padding-top:2px;color:#2ad;font-size:1.8em;'></div>" +
	"<div id='SeriesOverview' style='margin-top:6px;padding-right:10px;font-size:1.1em;max-height:150px;overflow-y:hidden;'></div>" +
	"</div>";
	
	document.getElementById("SeriesContent").style.top = "810px";
	document.getElementById("Center").style.top = "20px";
	
	if (this.ItemData.Items.length > 0) {
		//Display first 12 series
		this.updateDisplayedItems();
			
		//Update Selected Collection CSS
		this.updateSelectedItems();	
			
		//Set Focus for Key Events
		document.getElementById("GuiPage_TvChannel").focus();
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

GuiPage_TvChannel.updateDisplayedItems = function() {
	Support.updateDisplayedItems(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Content","",null,null);
}

//Function sets CSS Properties so show which user is selected
GuiPage_TvChannel.updateSelectedItems = function () {
	Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Music Selected","Music","",false,this.ItemData.Items.TotalRecordCount);

	var programmeURL = Server.getItemInfoURL(this.ItemData.Items[this.selectedItem].CurrentProgram.Id,"");
	var ProgrammeData = Server.getContent(programmeURL);
	
	document.getElementById("SeriesTitle").innerHTML = this.ItemData.Items[this.selectedItem].Name;
	document.getElementById("SeriesSubData").innerHTML = this.ItemData.Items[this.selectedItem].CurrentProgram.Name;
	document.getElementById("SeriesOverview").innerHTML = ProgrammeData.Overview;
	
}

GuiPage_TvChannel.keyDown = function() {
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
			Support.updateURLHistory("GuiPage_TvChannel",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
			GuiMainMenu.requested("GuiPage_TvChannel",this.ItemData.Items[this.selectedItem].Id);
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_TvChannel.processSelectedItem = function() {
	Support.processSelectedItem("GuiPage_TvChannel",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null,null); 
}

GuiPage_TvChannel.playSelectedItem = function () {
	GuiPage_TvChannel.processSelectedItem();
}

GuiPage_TvChannel.processLeftKey = function() {
	this.selectedItem--;
	if (this.selectedItem < 0) {
		this.selectedItem = 0;
	} else {
		if (this.selectedItem < this.topLeftItem) {
			this.topLeftItem = this.selectedItem - (this.getMaxDisplay() - 1);
			if (this.topLeftItem < 0) {
				this.topLeftItem = 0;
			}
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiPage_TvChannel.processRightKey = function() {
	this.selectedItem++;
	if (this.selectedItem >= this.ItemData.Items.length) {
		this.selectedItem--;
	} else {
		if (this.selectedItem >= this.topLeftItem+this.getMaxDisplay() ) {
			this.topLeftItem = this.selectedItem;
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiPage_TvChannel.processUpKey = function() {
	this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT;
	if (this.selectedItem < 0) {
		//Check User Setting
		if (true) {
			this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT;
			Support.updateURLHistory("GuiPage_TvChannel",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
			GuiMainMenu.requested("GuiPage_TvChannel",this.ItemData.Items[this.selectedItem].Id);
		} else {
			this.selectedItem = 0;
			this.topLeftItem = 0;
			this.updateDisplayedItems();
			this.updateSelectedItems();
		}		
	} else {
		if (this.selectedItem < this.topLeftItem) {
			if (this.topLeftItem - this.MAXCOLUMNCOUNT < 0) {
				this.topLeftItem = 0;
			} else {
				this.topLeftItem = this.topLeftItem - this.MAXCOLUMNCOUNT;
			}
			this.updateDisplayedItems();
		}
		this.updateSelectedItems();
	}
}

GuiPage_TvChannel.processDownKey = function() {
	this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT;
	if (this.selectedItem >= this.ItemData.Items.length) {
		this.selectedItem = (this.ItemData.Items.length-1);
		if (this.selectedItem >= (this.topLeftItem  + this.getMaxDisplay())) {
			this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
			this.updateDisplayedItems();
		}
	} else {
		if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
			this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiPage_TvChannel.processChannelUpKey = function() {
	this.selectedItem = this.selectedItem - this.getMaxDisplay();
	if (this.selectedItem < 0) {
		this.selectedItem = 0;
		this.topLeftItem = 0;
		this.updateDisplayedItems();
	} else {
		if (this.topLeftItem - this.getMaxDisplay() < 0) {
			this.topLeftItem = 0;
		} else {
			this.topLeftItem = this.topLeftItem - this.getMaxDisplay();
		}
		this.updateDisplayedItems();
	}
	this.updateSelectedItems();
}

GuiPage_TvChannel.processChannelDownKey = function() {
	this.selectedItem = this.selectedItem + this.getMaxDisplay();
	if (this.selectedItem >= this.ItemData.Items.length) {		
		this.selectedItem = (this.ItemData.Items.length-1);
		if (this.selectedItem >= this.topLeftItem + this.getMaxDisplay()) {
			this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
		}
		this.updateDisplayedItems();
	} else {
		this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
		this.updateDisplayedItems();
	}
	this.updateSelectedItems();
}

GuiPage_TvChannel.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}