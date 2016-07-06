var GuiPage_MusicArtist = {
		ItemData : null,
		selectedItem : 0,
		topLeftItem : 0,
		
		totalRecordCount : null,
		
		ItemData2 : null,
		selectedItem2 : -1,
		topLeftItem2 : 0,
		
		ItemIndexData : null,
		indexSeekPos : -1,
		
		timeout : null,
		
		bannerItems : ["Recent","Frequent","Album","Album Artist","Artist"],
		
		selectedBannerItem : 0,
		
		MAXCOLUMNCOUNT : 7,
		MAXROWCOUNT : 2,
		MAXROW2COUNT : 1,
		
		title1 : "",
		startParams : []
}

GuiPage_MusicArtist.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}
GuiPage_MusicArtist.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiPage_MusicArtist.getMaxDisplay2 = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROW2COUNT;
}

GuiPage_MusicArtist.start = function(title1, url1, selectedItem, topLeftItem) {
	alert("Page Enter : GuiPage_MusicArtist");
	
	//Save Start Vars
	Support.pageLoadTimes("GuiPage_MusicArtist","Start",true);
	this.startParams = [title1,url1];
	
	//Reset Vars
	this.selectedItem = selectedItem;
	this.selectedItem2 = -1; //Prevents any item being shown as selected! 
	this.topLeftItem = topLeftItem;
	this.topLeftItem2 = 0;
	this.indexSeekPos = -1,

	//Load Data
	this.title1 = title1;
	
	this.ItemData = Server.getContent(url1 + "&Limit="+File.getTVProperty("ItemPaging"));
	if (this.ItemData == null) { return; }
	this.totalRecordCount = this.ItemData.TotalRecordCount;
	Support.pageLoadTimes("GuiPage_MusicArtist","RetrievedServerData",false);
	
	//Create pageContent
	var htmlToAdd = "<div id=bannerSelection class='bannerMenu'></div>";
	htmlToAdd += "<div id=Center class='SeriesCenter'>";
	htmlToAdd += 	"<div id=Content></div>";
	htmlToAdd += "</div>";
	htmlToAdd += "<div style='padding-top:650px;text-align:center;'>";
	htmlToAdd += 	"<p id=lowerTitle class='albumArtist-lowerTitle'></p>";
	htmlToAdd += 	"<div id=lowerContent class='albumArtist-lowerContent'></div>";
	htmlToAdd += "</div>";
	document.getElementById("pageContent").innerHTML = htmlToAdd;
	
	//Set banner Styling
	document.getElementById("bannerSelection").style.paddingTop="20px";
	document.getElementById("bannerSelection").style.paddingBottom="10px";
	
	
	if (this.ItemData.Items.length > 0) {
		//Index Data - Disabled v0.570d
		//this.ItemIndexData = Support.processIndexing(this.ItemData.Items); 
		
		//Display first XX series
		this.updateDisplayedItems();
		
		//Update Selected Collection CSS
		this.updateSelectedItems(false);
		
		//Add Padding
		if (this.ItemData.Items.length <= this.MAXCOLUMNCOUNT) {
			document.getElementById("Center").style.top = "150px";
		}
		
		//Set Banner Items
		for (var index = 0; index < this.bannerItems.length; index++) {
			if (index != this.bannerItems.length-1) {
				document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='bannerItem bannerItemPadding'>"+this.bannerItems[index].replace(/_/g, ' ')+"</div>";			
			} else {
				document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='bannerItem'>"+this.bannerItems[index].replace(/_/g, ' ')+"</div>";					
			}
		}
		
		this.selectedBannerItem = -1;
		this.updateSelectedBannerItems();
		this.selectedBannerItem = 0; 
		
		//Set Focus for Key Events
		document.getElementById("GuiPage_MusicArtist").focus();	
		Support.pageLoadTimes("GuiPage_MusicArtist","UserControl",false);
	} else {
		//Set message to user
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("Content").style.fontSize="40px";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid<br>Press return to get back to the previous screen";
		
		//Set Background
		Support.fadeImage("images/bg1.jpg"); 
		
		document.getElementById("NoItems").focus();
	}
}

//---------------------------------------------------------------------------------------------------
//      TOP ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------
GuiPage_MusicArtist.updateDisplayedItems = function() {
	
	if (this.topLeftItem + this.getMaxDisplay() > this.ItemData.Items.length) {
		if (this.totalRecordCount > this.ItemData.Items.length) {
			this.loadMoreItems();
		}
	}
	
	Support.updateDisplayedItems(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Content",this.divprepend1,this.isResume);
}

//Function sets CSS Properties so show which user is selected
GuiPage_MusicArtist.updateSelectedItems = function (bypassCounter) {
	Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Music Selected","Music",this.divprepend1,bypassCounter,this.totalRecordCount);
	
	//Prevent execution when selectedItem is set to -1 to hide selected item
	if (this.selectedItem != -1) {	
		
		//Set Title2
		document.getElementById("lowerTitle").innerHTML = "Albums by " + this.ItemData.Items[this.selectedItem].Name;

		//Load Data
		var url2 = "";
		artist = this.ItemData.Items[this.selectedItem].Name.replace(/ /g, '+');	 
		artist = artist.replace(/&/g, '%26');
		switch (this.title1) {
		case "Artists":
			url2 = Server.getItemTypeURL("?SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=MusicAlbum&Recursive=true&StartIndex=0&Artists="+this.ItemData.Items[this.selectedItem].Name.replace(" ","+"));
			break;
		case "Album Artists":
			url2 = Server.getItemTypeURL("?SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=MusicAlbum&Recursive=true&StartIndex=0&Artists="+artist);
			break;
		case "Albums":
			url2 = Server.getChildItemsURL(this.ItemData.Items[this.selectedItem].Id,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Audio&Recursive=true");
			break;
		default:
			//Default is AlbumArtist
			url2 = Server.getItemTypeURL("?SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=MusicAlbum&Recursive=true&StartIndex=0&Artists="+artist);
			break;
		}
		
		//Blocking code to skip getting data for items where the user has just gone past it
		var currentArtistSelected = this.selectedItem; //IS USED
		this.timeout = setTimeout(function(){	
			if (GuiPage_MusicArtist.selectedItem == currentArtistSelected) {
				GuiPage_MusicArtist.ItemData2 = Server.getContent(url2);
				if (GuiPage_MusicArtist.ItemData2 == null) { return; }

				//Display first XX series
				GuiPage_MusicArtist.updateDisplayedItems2();
					
				//Update Selected Collection CSS 
				GuiPage_MusicArtist.updateSelectedItems2(true);
			}
		}, 500);
		
		//Background Image 
		var currentSelectedItem = this.selectedItem; 
		setTimeout(function(){	 
			if (GuiPage_MusicArtist.selectedItem == currentSelectedItem) { 
					//A movie.
					if (GuiPage_MusicArtist.ItemData.Items[currentSelectedItem].BackdropImageTags.length > 0) { 
						var imgsrc = Server.getBackgroundImageURL(GuiPage_MusicArtist.ItemData.Items[currentSelectedItem].Id,"Backdrop",Main.backdropWidth,Main.backdropHeight,0,false,0,GuiPage_MusicArtist.ItemData.Items[currentSelectedItem].BackdropImageTags.length); 
						Support.fadeImage(imgsrc);
					//A music album.
					} else if (GuiPage_MusicArtist.ItemData.Items[currentSelectedItem].ParentBackdropImageTags) { 
						var imgsrc = Server.getBackgroundImageURL(GuiPage_MusicArtist.ItemData.Items[currentSelectedItem].ParentBackdropItemId,"Backdrop",Main.backdropWidth,Main.backdropHeight,0,false,0,GuiPage_MusicArtist.ItemData.Items[currentSelectedItem].ParentBackdropImageTags.length); 
						Support.fadeImage(imgsrc); 
					} 
			} 
	 	}, 1000);
	}
}

GuiPage_MusicArtist.keyDown = function() {
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
	
	switch(keyCode){
		case tvKey.KEY_LEFT:
			alert("LEFT");	
			this.processTopMenuLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");	
			this.processTopMenuRightKey();
			break;
		case tvKey.KEY_DOWN:
			alert ("DOWN");
			this.processTopMenuDownKey();
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processTopMenuEnterKey();
			break;		
		case tvKey.KEY_RED:
			//Disabled v0.570d
			//this.processIndexing();
			break;	
		case tvKey.KEY_UP:	
			this.processTopMenuUpKey();
			break;
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			this.openMenu();
			break;
		case tvKey.KEY_RETURN:
			clearTimeout(this.timeout)
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;
		case tvKey.KEY_YELLOW:	
			//Favourites
			break;		
		case tvKey.KEY_BLUE:
			//Focus the music player
			if (this.selectedItem == -1) {		
				if (this.selectedBannerItem == this.bannerItems.length-1) {
					GuiMusicPlayer.showMusicPlayer("GuiPage_MusicArtist","bannerItem"+this.selectedBannerItem,"bannerItem highlightText");
				} else {
					GuiMusicPlayer.showMusicPlayer("GuiPage_MusicArtist","bannerItem"+this.selectedBannerItem,"bannerItem bannerItemPadding highlightText");
				}
			} else {
				GuiMusicPlayer.showMusicPlayer("GuiPage_MusicArtist",this.divprepend1 + this.ItemData.Items[this.selectedItem].Id,document.getElementById(this.divprepend1 + this.ItemData.Items[this.selectedItem].Id).className);
			}
			
			
			break;	
		case tvKey.KEY_EXIT:
			clearTimeout(this.timeout)
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}

GuiPage_MusicArtist.openMenu = function() {
	if (this.selectedItem == -1) {
		if (this.selectedBannerItem == -1) {
			document.getElementById("bannerItem0").class = "bannerItem bannerItemPadding";
		}
		this.selectedItem = 0;
		this.topLeftItem = 0;
	}
		Support.updateURLHistory("GuiPage_MusicArtist",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,true);
		GuiMainMenu.requested("GuiPage_MusicArtist",this.divprepend1 + this.ItemData.Items[this.selectedItem].Id);
}

GuiPage_MusicArtist.processTopMenuLeftKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem--;
		if (this.selectedBannerItem == -1) { //Going left from the end of the top menu.
			this.openMenu();
		}
		this.updateSelectedBannerItems();	
	} else if (this.selectedItem % this.MAXCOLUMNCOUNT == 0){ //Going left from the first column.
			this.openMenu();	
	} else {
		this.selectedItem--;
		if (this.selectedItem == -1) {
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
}

GuiPage_MusicArtist.processTopMenuRightKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem++;
		if (this.selectedBannerItem >= this.bannerItems.length) {
			this.selectedBannerItem--;
		}
		this.updateSelectedBannerItems();	
	} else {
		this.selectedItem++;
		if (this.selectedItem >= this.ItemData.Items.length) {
			if (this.totalRecordCount > this.ItemData.Items.length) {
				this.loadMoreItems();	
				if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
					this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
					
				}
				this.updateDisplayedItems();
			} else {
				this.selectedItem = this.selectedItem-1;
			}
		} else {
			if (this.selectedItem >= this.topLeftItem+this.getMaxDisplay() ) {
				this.topLeftItem = this.selectedItem;
				this.updateDisplayedItems();
			}
		}
		this.updateSelectedItems();
	}
}

GuiPage_MusicArtist.processTopMenuUpKey = function() {
	this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT;
	if (this.selectedItem < 0) {
		this.selectedBannerItem = 0;
		this.selectedItem = -1;
		//Hide red
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Music Selected","Music",this.divprepend1,true);	
		//update selected banner item
		this.updateSelectedBannerItems();	
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

GuiPage_MusicArtist.processTopMenuDownKey = function() {
	if (this.selectedItem == -1) {
		this.selectedItem = 0;
		this.selectedBannerItem = -1;
		this.updateSelectedBannerItems();
	} else {
		this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT;
		if (this.selectedItem >= this.ItemData.Items.length) {
			if (this.totalRecordCount > this.ItemData.Items.length) {
				this.loadMoreItems();
				
				if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
					this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
					this.updateDisplayedItems();
				}
				
			} else {
				this.selectedItem = (this.ItemData.Items.length-1);
				if (this.selectedItem >= (this.topLeftItem  + this.getMaxDisplay())) {
					this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
					this.updateDisplayedItems();
				}
			}	
		} else {
			if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
				this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
				this.updateDisplayedItems();
			}
		}
	}
	this.updateSelectedItems();
}

GuiPage_MusicArtist.processTopMenuEnterKey = function() {
	alert ("TopMenuEnterKey");
	if (this.selectedItem == -1) {
		Support.enterMusicPage(this.bannerItems[this.selectedBannerItem]);
	} else {
		if (this.ItemData2.Items.length > 0) {
			//Set to 0 and reset display, then set to -1 and update selected so none are selected, then reset to 0
			var rememberSelectedItem = this.selectedItem;
			
			this.selectedItem = -1;
			this.updateSelectedItems(true);		
			this.selectedItem = rememberSelectedItem;
			
			//Set Focus
			document.getElementById("GuiPage_MusicArtistBottom").focus();
			//Update Selected 
			this.selectedItem2 = 0;
			this.updateSelectedItems2(false);
		}
	}		
}

//---------------------------------------------------------------------------------------------------
//      BOTTOM ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------
GuiPage_MusicArtist.updateDisplayedItems2 = function() {
	Support.updateDisplayedItems(this.ItemData2.Items,this.selectedItem2,this.topLeftItem2,
			Math.min(this.topLeftItem2 + this.getMaxDisplay2(),this.ItemData2.Items.length),"lowerContent",this.divprepend2,this.isResume2);
}

//Function sets CSS Properties so show which user is selected
GuiPage_MusicArtist.updateSelectedItems2 = function (bypassCounter) {
	Support.updateSelectedNEW(this.ItemData2.Items,this.selectedItem2,this.topLeftItem2,
			Math.min(this.topLeftItem2 + this.getMaxDisplay2(),this.ItemData2.Items.length),"Music Selected","Music",this.divprepend2,bypassCounter);
}

GuiPage_MusicArtist.bottomKeyDown = function() {
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
			alert("LEFT BOTTOM");	
			this.selectedItem2--;
			if (this.selectedItem2 == -1) {
				this.selectedItem2 = 0; //Going left from bottom items row.
				//Open the menu
				Support.updateURLHistory("GuiPage_MusicArtist",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,false);
				GuiMainMenu.requested("GuiPage_MusicArtistBottom",this.divprepend2 + this.ItemData2.Items[this.selectedItem2].Id);
				
			} else {
				if (this.selectedItem2 < this.topLeftItem2) {
					this.topLeftItem2--;
					if (this.topLeftItem2 < 0) {
						this.topLeftItem2 = 0;
					}
					this.updateDisplayedItems2();
				}			
			}
			this.updateSelectedItems2();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT BOTTOM");	
			this.selectedItem2++;
			if (this.selectedItem2 >= this.ItemData2.Items.length) {
				this.selectedItem2--;
			} else {
				if (this.selectedItem2 >= this.topLeftItem2+this.getMaxDisplay2() ) {
					this.topLeftItem2++;
					this.updateDisplayedItems2();
				}			
			}
			this.updateSelectedItems2();
			break;
		case tvKey.KEY_UP:
			alert("UP BOTTOM");
			this.selectedItem2 = -1;
			this.updateSelectedItems2(true);	
			this.topLeftItem2 = 0;
			
			//Set Focus
			document.getElementById("GuiPage_MusicArtist").focus();
			this.updateSelectedItems(false);
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER BOTTOM");
			this.processSelectedItem();
			break;	
		case tvKey.KEY_PLAY:
			this.playSelectedItem(this.ItemData2.Items,this.selectedItem2);
			break;	
		case tvKey.KEY_YELLOW:
			GuiMusicPlayer.showPlayer();
			break;
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			//Return added here - deleted in MainMenu if user does return
			if (this.selectedItem == -1) {		
				if (this.selectedBannerItem != this.bannerItems.length-1) {
					document.getElementById("bannerItem"+this.selectedBannerItem).className = "bannerItem bannerItemPadding";
				} else {
					document.getElementById("bannerItem"+this.selectedBannerItem).className = "bannerItem";
				}
				this.selectedItem = 0;
				this.topLeftItem = 0;
			}
			Support.updateURLHistory("GuiPage_MusicArtist",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,false);
			GuiMainMenu.requested("GuiPage_MusicArtistBottom",this.divprepend2 + this.ItemData2.Items[this.selectedItem2].Id);				
			break;
		case tvKey.KEY_RETURN:
			//In this instance handle return to go up to the top menu
			alert("RETURN BOTTOM");
			widgetAPI.blockNavigation(event);
			this.selectedItem2 = 0;
			this.topLeftItem2 = 0;

			this.selectedItem2 = -1;
			this.updateSelectedItems2(true);		

			//Set Focus
			document.getElementById("GuiPage_MusicArtist").focus();
			this.updateSelectedItems(false);
			break;
		case tvKey.KEY_YELLOW:	
			//Favourites
			break;			
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiPage_MusicArtistBottom",this.divprepend2 + this.ItemData2.Items[this.selectedItem2].Id,document.getElementById(this.divprepend2 + this.ItemData2.Items[this.selectedItem2].Id).className);
			break;		
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY BOTTOM");
			widgetAPI.sendExitEvent();
			break;
	}
}

//--------------------------------------------------------------------------------------------------------

GuiPage_MusicArtist.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index == this.selectedBannerItem) {
			if (index != this.bannerItems.length-1) {
				document.getElementById("bannerItem"+index).className = "bannerItem bannerItemPadding highlightText";
			} else {
				document.getElementById("bannerItem"+index).className = "bannerItem highlightText";
			}		
		} else {
			if (index != this.bannerItems.length-1) {
				if (this.bannerItems[index] == this.startParams[0]) {
					document.getElementById("bannerItem"+index).className = "bannerItem bannerItemPadding offWhite";
				} else {
					document.getElementById("bannerItem"+index).className = "bannerItem bannerItemPadding";
				}
			} else {
				if (this.bannerItems[index] == this.startParams[0]) {
					document.getElementById("bannerItem"+index).className = "bannerItem offWhite";
				} else {
					document.getElementById("bannerItem"+index).className = "bannerItem";
				}
			}
		}
	}
}

GuiPage_MusicArtist.processSelectedItem = function () {
	Support.updateURLHistory("GuiPage_MusicArtist",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,false);
	var url = Server.getChildItemsURL(this.ItemData2.Items[this.selectedItem2].Id,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Audio&Recursive=true&CollapseBoxSetItems=false");
	GuiPage_Music.start(this.ItemData2.Items[this.selectedItem2].Name,url,this.ItemData2.Items[this.selectedItem2].Type);
}

GuiPage_MusicArtist.playSelectedItem = function (array,selected) {
}

GuiPage_MusicArtist.processIndexing = function() {
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

GuiPage_MusicArtist.loadMoreItems = function() {
	if (this.totalRecordCount > this.ItemData.Items.length) {
		Support.pageLoadTimes("GuiPage_MusicArtist","GetRemainingItems",false);
		
		//Show Loading Div
		document.getElementById("guiPlayer_Loading").style.visibility = "";
		
		//Remove User Control
		document.getElementById("NoKeyInput").focus();
		
		//Load Data
		var originalLength = this.ItemData.Items.length
		var ItemDataRemaining = Server.getContent(this.startParams[1] + "&Limit="+File.getTVProperty("ItemPaging") + "&StartIndex=" + originalLength);
		if (ItemDataRemaining == null) { return; }
		Support.pageLoadTimes("GuiPage_MusicArtist","GotRemainingItems",false);
		
		for (var index = 0; index < ItemDataRemaining.Items.length; index++) {
			this.ItemData.Items[index+originalLength] = ItemDataRemaining.Items[index];
		}
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + this.ItemData.Items.length;
		
		//Reprocess Indexing Algorithm
		
		//Hide Loading Div
		document.getElementById("guiPlayer_Loading").style.visibility = "hidden";
		
		//Pass back Control
		document.getElementById("GuiPage_MusicArtist").focus();
		
		Support.pageLoadTimes("GuiPage_MusicArtist","AddedRemainingItems",false);
	}
}

GuiPage_MusicArtist.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}