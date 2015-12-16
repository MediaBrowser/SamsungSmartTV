var GuiDisplayOneItem = {
		ItemData : null,
		ItemIndexData : null,
		
		selectedItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 4,
		MAXROWCOUNT : 3,
		
		indexSeekPos : -1,
		isResume : false,
		genreType : "",
		
		startParams : [],
		isLatest : false,
		backdropTimeout : null
}

GuiDisplayOneItem.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiDisplayOneItem.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiDisplayOneItem.start = function(title,url,selectedItem,topLeftItem) {
	alert("Page Enter : GuiDisplayOneItem");
	
	//Save Start Params	
	this.startParams = [title,url];
	
	alert (url);
	
	//Set background
/*	this.backdropTimeout = setTimeout(function(){
		Support.fadeImage("images/lensflare2-960x540.jpg");
	}, 1000);*/
	
	//Reset Values
	this.indexSeekPos = -1;
	this.selectedItem = selectedItem;
	this.topLeftItem = topLeftItem;
	this.genreType = null;
	
	//Load Data
	this.ItemData = Server.getContent(url);
	if (this.ItemData == null) { return; }

	//Setup display width height based on title
	switch (title) {
	case "Media Folders":
	case "Collections":	
		this.MAXCOLUMNCOUNT = 3;
		this.MAXROWCOUNT = 2;
		break;
	case "Music":
	case "Albums":	
	case "Artists":	
		this.MAXCOLUMNCOUNT = 6;
		this.MAXROWCOUNT = 3;
		break;		
	default:
		this.MAXCOLUMNCOUNT = 4;
		this.MAXROWCOUNT = 3;
		break;
	}
	
	//Set Page Content
	document.getElementById("pageContent").innerHTML = "<div id='title' class='EpisodesSeriesInfo'>"+title+"</div>" +
			"<div id=Center class='SeriesCenter'><div id=Content></div></div>";	
	
	//Set Top 
	GuiDisplayOneItem.setPadding(title);
	
	if (this.ItemData.Items.length > 0) {
		//Set isResume based on title - used in UpdateDisplayedItems
		this.isResume = (title == "Resume") ? true : false;
		
		//Alter to only allow indexing on certain pages??
		this.ItemIndexData = Support.processIndexing(this.ItemData.Items); 
	
		//Display first XX series
		this.updateDisplayedItems();
			
		//Update Selected Collection CSS
		this.updateSelectedItems();	
			
		//Set Focus for Key Events
		document.getElementById("GuiDisplayOneItem").focus();
	} else {
		//Set message to user
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("Content").style.fontSize="20px";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid<br>Press return to get back to the previous screen";
		
		document.getElementById("NoItems").focus();
	}	
}

GuiDisplayOneItem.updateDisplayedItems = function() {
	Support.updateDisplayedItems(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Content","",this.isResume,this.genreType,true);
}

//Function sets CSS Properties so show which user is selected
GuiDisplayOneItem.updateSelectedItems = function () {
	if (this.MAXCOLUMNCOUNT == 3) {
		//Add Collections Class to add more margin
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Series Collection Selected","Series Collection","");
	} else {
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Series Selected","Series","");
	}
}

GuiDisplayOneItem.keyDown = function() {
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
		case tvKey.KEY_GREEN:
			//Watched - May not be needed on this page
			break;
		case tvKey.KEY_YELLOW:	
			//Favourites - May not be needed on this page
			break;	
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiDisplayOneItem");
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

GuiDisplayOneItem.processSelectedItem = function() {
	clearTimeout(this.backdropTimeout);
	Support.processSelectedItem("GuiDisplayOneItem",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null,this.genreType,this.isLatest); 
}

GuiDisplayOneItem.playSelectedItem = function () {
	clearTimeout(this.backdropTimeout);
	Support.playSelectedItem("GuiDisplayOneItem",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null);
}

GuiDisplayOneItem.openMenu = function() {
	Support.updateURLHistory("GuiDisplayOneItem",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
	GuiMainMenu.requested("GuiDisplayOneItem",this.ItemData.Items[this.selectedItem].Id);
}

GuiDisplayOneItem.processLeftKey = function() {
	if (Support.isPower(this.selectedItem, this.MAXCOLUMNCOUNT)){
		this.openMenu(); //Going left from anywhere in the first column.
	} else {
		this.selectedItem--;
		if (this.selectedItem == -1) {
			this.selectedItem = 0;
			this.openMenu();
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
}

GuiDisplayOneItem.processRightKey = function() {
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

GuiDisplayOneItem.processUpKey = function() {
	this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT;
	if (this.selectedItem < 0) {
		//Check User Setting
		this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT;	
	} else {
		if (this.selectedItem < this.topLeftItem) {
			if (this.topLeftItem - this.MAXCOLUMNCOUNT < 0) {
				this.topLeftItem = 0;
			} else {
				this.topLeftItem = this.topLeftItem - this.MAXCOLUMNCOUNT;
			}
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiDisplayOneItem.processDownKey = function() {
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

GuiDisplayOneItem.processChannelUpKey = function() {
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

GuiDisplayOneItem.processChannelDownKey = function() {
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

GuiDisplayOneItem.processIndexing = function() {
	var indexLetter = this.ItemIndexData[0];
	var indexPos = this.ItemIndexData[1];
	
	this.indexSeekPos++;
	if (this.indexSeekPos >= indexPos.length) {
		this.indexSeekPos = 0;
		this.topLeftItem = 0;
	}
	
	this.selectedItem = indexPos[this.indexSeekPos];
	this.topLeftItem = this.selectedItem;
	
	this.updateDisplayedItems();
	this.updateSelectedItems();
}

GuiDisplayOneItem.setPadding = function(title) {
	switch (title) {
	case "Media Folders":
	case "Collections":	
		if (this.ItemData.Items.length <= this.MAXCOLUMNCOUNT) {
			document.getElementById("Center").style.top = "110px";
		} else {
			document.getElementById("Center").style.top = "90px";
		}
		break;
	case "Music":
	case "Albums":	
	case "Artists":	
		break;		
	default:
		if (this.ItemData.Items.length > this.MAXCOLUMNCOUNT * 2) {
			//3 Rows
			document.getElementById("Center").style.top = "60px";
		} else if (this.ItemData.Items.length > this.MAXCOLUMNCOUNT) {
			//2 Rows
			document.getElementById("Center").style.top = "110px";
		} else {
			//1 Row
			document.getElementById("Center").style.top = "90px";
		}		
		break;
	}
}

GuiDisplayOneItem.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}