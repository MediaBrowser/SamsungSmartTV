var GuiPage_Photos = {
		ItemData : null,
		
		selectedItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 4,
		MAXROWCOUNT : 3,
		
		isResume : false,
		genreType : "",
		startParams : [],
		isLatest : false,
		backdropTimeout : null
}

GuiPage_Photos.onFocus = function() {
	GuiHelper.setControlButtons("Favourite",null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_Photos.getMaxDisplay = function() {
		return 15;
}

GuiPage_Photos.start = function(title,url,selectedItem,topLeftItem) {
	alert("Page Enter : GuiPage_Photos");
	
	//Save Start Params	
	this.startParams = [title,url];
	
	alert (url);
	
	//Reset Values
	this.indexSeekPos = -1;
	this.selectedItem = selectedItem;
	this.topLeftItem = topLeftItem;
	this.genreType = null;
	
	//Load Data
	this.ItemData = Server.getContent(url);
	if (this.ItemData == null) { return; }

	//Set Page Content
	document.getElementById("pageContent").innerHTML = "<div id='title' class='EpisodesSeriesInfo'>"+title+"</div>" +
			"<div id=Center class='SeriesCenter'><div id=Content></div></div>";	
	
	//Set Top 
	GuiPage_Photos.setPadding(title);
	
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
		document.getElementById("GuiPage_Photos").focus();
	} else {
		//Set message to user
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("Content").style.fontSize="1.7empx";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid<br>Press return to get back to the previous screen";
		
		document.getElementById("NoItems").focus();
	}	
}

GuiPage_Photos.updateDisplayedItems = function() {
	var Items = this.ItemData.Items;
	var htmlToAdd = "";	
	var DivIdPrepend = "";
	htmlToAdd += "<div class=photoAlbum><table class=photoTable><tr>";
	for (var i = 0; i < Math.min(this.getMaxDisplay(),Items.length-this.topLeftItem); i++) {
		var imgsrc = "";
		var title = Items[this.topLeftItem+i].Name;
		if (Items[this.topLeftItem+i].Type == "PhotoAlbum" || Items[this.topLeftItem+i].Type == "Folder"){
			var photosUrl = Server.getItemTypeURL("&IncludeItemTypes=photo&Limit=1&SortBy=SortName&SortOrder=Ascending&Recursive=true&ParentId="+Items[this.topLeftItem+i].Id);
			var photos = Server.getContent(photosUrl);
			var photosCount = 0;
			if (photos){
				photosCount = photos.TotalRecordCount;
				if(photos.Items[0]){
					if(photos.Items[0].ImageTags.Primary){			
						imgsrc = Server.getImageURL(photos.Items[0].Id,"Primary",(i==0?880:440),(i==0?880:440),0,false,0);
					}
				}
			}
			if (imgsrc == ""){
				imgsrc = "images/EmptyFolder-122x98.png";
			}
			htmlToAdd += (i==0?"<td class=photoThumbLarge colspan=2 rowspan=2>":"<td class=photoThumbSmall>")+"<div id="+ DivIdPrepend + Items[this.topLeftItem+i].Id + " style=background-color:rgba(0,0,0,0.5);background-image:url(" +imgsrc+ ");width:"+(i==0?572:270)+"px;height:"+(i==0?572:270)+"px><div class=photoTitle style=font-size:"+(i==0?36:28)+"px>"+ title + "</div>";
			if (Items[this.topLeftItem+i].UserData.IsFavorite){
				htmlToAdd += "<div class=favItem></div>";
			}
			if (photosCount > 0) {
				htmlToAdd += "<div class=photoItemCount>"+photosCount+"</div>";
			}
			htmlToAdd += "</div></td>";
		} else if (Items[this.topLeftItem+i].Type == "Video") {
			if (Items[this.topLeftItem+i].ImageTags.Primary){
				imgsrc = Server.getImageURL(Items[this.topLeftItem+i].Id,"Primary",(i==0?880:440),(i==0?880:440),0,false,0);
			} else if (Items[this.topLeftItem+i].ImageTags.Thumb){
				imgsrc = Server.getImageURL(Items[this.topLeftItem+i].Id,"Thumb",(i==0?880:440),(i==0?880:440),0,false,0);
			} else { 
				imgsrc = "images/film-93x105.png";
			}
			htmlToAdd += (i==0?"<td class=photoThumbLarge colspan=2 rowspan=2>":"<td class=photoThumbSmall>")+"<div id="+ DivIdPrepend + Items[this.topLeftItem+i].Id + " style=background-color:rgba(0,0,0,0.5);background-image:url(" +imgsrc+ ");width:"+(i==0?572:270)+"px;height:"+(i==0?572:270)+"px><div class=photoTitle style=font-size:"+(i==0?36:28)+"px>"+ title + "</div>";
			if (Items[this.topLeftItem+i].UserData.IsFavorite){
				htmlToAdd += "<div class=favItem></div>";
			}
			htmlToAdd += "</div></td>";
		} else { //It's a photo (probably).
			if (Items[this.topLeftItem+i].ImageTags.Primary){
				imgsrc = Server.getImageURL(Items[this.topLeftItem+i].Id,"Primary",(i==0?880:440),(i==0?880:440),0,false,0);
			} else if (Items[this.topLeftItem+i].ImageTags.Thumb){
				imgsrc = Server.getImageURL(Items[this.topLeftItem+i].Id,"Thumb",(i==0?880:440),(i==0?880:440),0,false,0);
			} else { 
				imgsrc = "images/menu/photos-54x54.png";
			}
			htmlToAdd += (i==0?"<td class=photoThumbLarge colspan=2 rowspan=2>":"<td class=photoThumbSmall>")+"<div id="+ DivIdPrepend + Items[this.topLeftItem+i].Id + " style=background-color:rgba(0,0,0,0.5);background-image:url(" +imgsrc+ ");width:"+(i==0?572:270)+"px;height:"+(i==0?572:270)+"px>";
			if (Items[this.topLeftItem+i].UserData.IsFavorite){
				htmlToAdd += "<div class=favItem></div>";
			}
			htmlToAdd += "</div></td>";
		}
		if (i == 4 || i == 8) {
			htmlToAdd += "</tr><tr>";
		}
	}
	htmlToAdd += "</tr></table></div>";
	document.getElementById("Content").innerHTML = htmlToAdd;	
}

GuiPage_Photos.updateOneDisplayedItem = function(item,selectedItem) {
	var htmlToAdd = "";	
	if (item.Type == "PhotoAlbum" || item.Type == "Folder") {
		var title = item.Name;
		htmlToAdd += "<div class=photoTitle style=font-size:"+(this.selectedItem==this.topLeftItem?36:28)+"px>"+ title + "</div>";
	}
	if (item.UserData.IsFavorite){
		htmlToAdd += "<div class=favItem></div>";
	}
	var itemCount = item.ChildCount;
	if (itemCount) {
		htmlToAdd += "<div class=photoItemCount>"+itemCount+"</div>";
	}
	document.getElementById(item.Id).innerHTML = htmlToAdd;
}

//Function sets CSS Properties to show which item is selected.
GuiPage_Photos.updateSelectedItems = function () {
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"photo Selected","photo","");
}

GuiPage_Photos.keyDown = function() {
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
			//Watched - Not needed on this page
			break;
		case tvKey.KEY_RED:	
			if (this.ItemData.Items[this.selectedItem].UserData.IsFavorite == true) {
				Server.deleteFavourite(this.ItemData.Items[this.selectedItem].Id);
				this.ItemData.Items[this.selectedItem].UserData.IsFavorite = false;
				//GuiNotifications.setNotification ("Item has been removed from<br>favourites","Favourites");
			} else {
				Server.setFavourite(this.ItemData.Items[this.selectedItem].Id);
				this.ItemData.Items[this.selectedItem].UserData.IsFavorite = true;
				//GuiNotifications.setNotification ("Item has been added to<br>favourites","Favourites");
			}
			this.updateOneDisplayedItem(this.ItemData.Items[this.selectedItem],this.selectedItem)
			break;	
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiPage_Photos");
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

GuiPage_Photos.processSelectedItem = function() {
	clearTimeout(this.backdropTimeout);
	Support.processSelectedItem("GuiPage_Photos",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null,this.genreType,this.isLatest); 
}

GuiPage_Photos.playSelectedItem = function () {
	clearTimeout(this.backdropTimeout);
	Support.playSelectedItem("GuiPage_Photos",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null);
}

GuiPage_Photos.openMenu = function() {
	Support.updateURLHistory("GuiPage_Photos",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
	alert(this.selectedItem);
	GuiMainMenu.requested("GuiPage_Photos",this.ItemData.Items[this.selectedItem].Id);
}

GuiPage_Photos.processLeftKey = function() {
	if (this.selectedItem - this.topLeftItem == 0 || this.selectedItem - this.topLeftItem == 9) {
		this.openMenu();
	} else if (this.selectedItem - this.topLeftItem == 5) {
		this.selectedItem = this.topLeftItem;
		this.updateSelectedItems();
	} else {
		this.selectedItem--;
		if (this.selectedItem < this.topLeftItem) {
			this.topLeftItem = this.selectedItem - (this.getMaxDisplay() - 1);
			if (this.topLeftItem < 0) {
				this.topLeftItem = 0;
			}
			this.updateDisplayedItems();
		}
		this.updateSelectedItems();
	}
}

GuiPage_Photos.processRightKey = function() {
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

//Moving up and down on an irregular shaped grid is imprecise. Handle each case individually.
GuiPage_Photos.processUpKey = function() {
	if (this.selectedItem - this.topLeftItem == 0) {
		if (this.selectedItem > 0) {
			this.selectedItem = Math.max(this.selectedItem-9,0);
			this.topLeftItem = Math.max(this.topLeftItem-9,0);
			this.updateDisplayedItems();
		} else {
			this.selectedItem = 0;
		}		
	} else if (this.selectedItem - this.topLeftItem == 1) {
		if (this.selectedItem > 1) {
			this.selectedItem = Math.max(this.selectedItem-4,0);
			this.topLeftItem = Math.max(this.topLeftItem-4,0);
			this.updateDisplayedItems();
		} else {
			this.selectedItem = 0;
		}
	} else if (this.selectedItem - this.topLeftItem == 2) {
		if (this.selectedItem > 2) {
			this.selectedItem = Math.max(this.selectedItem-4,0);
			this.topLeftItem = Math.max(this.topLeftItem-4,0);
			this.updateDisplayedItems();
		} else {
			this.selectedItem = 0;
		}
	} else if (this.selectedItem - this.topLeftItem == 3) {
		if (this.selectedItem > 3) {
			this.selectedItem = Math.max(this.selectedItem-4,0);
			this.topLeftItem = Math.max(this.topLeftItem-4,0);
			this.updateDisplayedItems();
		} else {
			this.selectedItem = 0;
		}
	} else if (this.selectedItem - this.topLeftItem == 4) {
		if (this.selectedItem > 4) {
			this.selectedItem = Math.max(this.selectedItem-4,0);
			this.topLeftItem = Math.max(this.topLeftItem-4,0);
			this.updateDisplayedItems();
		} else {
			this.selectedItem = 0;
		}
	} else if (this.selectedItem - this.topLeftItem == 5) {
		this.selectedItem = this.topLeftItem+1;
	} else if (this.selectedItem - this.topLeftItem == 6) {
		this.selectedItem = this.topLeftItem+2;
	} else if (this.selectedItem - this.topLeftItem == 7) {
		this.selectedItem = this.topLeftItem+3;
	} else if (this.selectedItem - this.topLeftItem == 8) {
		this.selectedItem = this.topLeftItem+4;
	} else if (this.selectedItem - this.topLeftItem == 9) {
		this.selectedItem = this.topLeftItem;
	} else if (this.selectedItem - this.topLeftItem == 10) {
		this.selectedItem = this.topLeftItem;
	} else if (this.selectedItem - this.topLeftItem == 11) {
		this.selectedItem = this.topLeftItem+5;
	} else if (this.selectedItem - this.topLeftItem == 12) { 
		this.selectedItem = this.topLeftItem+6;
	} else if (this.selectedItem - this.topLeftItem == 13) {
		this.selectedItem = this.topLeftItem+7;
	} else if (this.selectedItem - this.topLeftItem == 14) { 
		this.selectedItem = this.topLeftItem+8;
	}
	this.updateSelectedItems();
}

GuiPage_Photos.processDownKey = function() {
	if (this.selectedItem - this.topLeftItem == 0 && this.ItemData.Items.length-1 > this.selectedItem+9) { 
		this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+9);
	} else if (this.selectedItem - this.topLeftItem == 1 && this.ItemData.Items.length-1 > this.selectedItem+3) {
		this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+5);
	} else if (this.selectedItem - this.topLeftItem == 2 && this.ItemData.Items.length-1 > this.selectedItem+2) {
		this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+6);
	} else if (this.selectedItem - this.topLeftItem == 3 && this.ItemData.Items.length-1 > this.selectedItem+1) {
		this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+7);
	} else if (this.selectedItem - this.topLeftItem == 4 && this.ItemData.Items.length-1 > this.selectedItem) {
		this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+8);
	} else if (this.selectedItem - this.topLeftItem == 5 && this.ItemData.Items.length-1 > this.selectedItem+3) {
		this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+11);
	} else if (this.selectedItem - this.topLeftItem == 6 && this.ItemData.Items.length-1 > this.selectedItem+2) {
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+12);
	} else if (this.selectedItem - this.topLeftItem == 7 && this.ItemData.Items.length-1 > this.selectedItem+1) {
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+13);
	} else if (this.selectedItem - this.topLeftItem == 8 && this.ItemData.Items.length-1 > this.selectedItem) {
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+14);
	} else if (this.selectedItem - this.topLeftItem == 9 && this.ItemData.Items.length-1 > this.selectedItem+5) {
			this.topLeftItem = this.selectedItem; 
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+9);
			this.updateDisplayedItems();
	} else if (this.selectedItem - this.topLeftItem == 10 && this.ItemData.Items.length-1 > this.selectedItem+4) {
			this.topLeftItem = this.selectedItem-1; 
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+10);
			this.updateDisplayedItems();
	} else if (this.selectedItem - this.topLeftItem == 11 && this.ItemData.Items.length-1 > this.selectedItem+3) {
			this.topLeftItem = this.selectedItem-2; 
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+11);
			this.updateDisplayedItems();
	} else if (this.selectedItem - this.topLeftItem == 12 && this.ItemData.Items.length-1 > this.selectedItem+2) { 
			this.topLeftItem = this.selectedItem-3; 
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+12);
			this.updateDisplayedItems();
	} else if (this.selectedItem - this.topLeftItem == 13 && this.ItemData.Items.length-1 > this.selectedItem+1) {
			this.topLeftItem = this.selectedItem-4; 
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+13);
			this.updateDisplayedItems();
	} else if (this.selectedItem - this.topLeftItem == 14 && this.ItemData.Items.length-1 > this.selectedItem) {
			this.topLeftItem = this.selectedItem-5; 
			this.selectedItem = Math.min(this.ItemData.Items.length-1,this.topLeftItem+14);
			this.updateDisplayedItems();
	}
	this.updateSelectedItems();
}

GuiPage_Photos.setPadding = function(title) {
		document.getElementById("Center").style.top = "100px";
}

GuiPage_Photos.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}