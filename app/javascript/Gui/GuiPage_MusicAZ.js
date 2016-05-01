var GuiPage_MusicAZ = {
		Letters : ["#","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","?"],
		selectedItem : 0,
		topLeftItem : 0,
		
		bannerItems : [],
		tvBannerItems : ["All","Unwatched","Latest","Upcoming", "Genre", "A-Z"],
		movieBannerItems : ["All","Unwatched","Latest","Genre", "A-Z"],
		musicBannerItems : ["Recent","Frequent","Album","Album Artist", "Artist"],
		selectedBannerItem : 0,
		
		MAXCOLUMNCOUNT : 10,
		MAXROWCOUNT : 4,

		startParams : [],
		backdropTimeout : null
}

GuiPage_MusicAZ.onFocus = function() {
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiPage_MusicAZ.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}


GuiPage_MusicAZ.start = function(entryView,selectedItem) {
	alert("Page Enter : GuiPage_MusicAZ");
	
	//Save Start Vars
	this.startParams = [entryView];
	
	switch (entryView) {
	case "TV":
		this.bannerItems = this.tvBannerItems;
		break;
	case "Movies":
		this.bannerItems = this.movieBannerItems;
		break;
	default:
		this.bannerItems = this.musicBannerItems;
		break;
	}
		
	//Reset Vars
	this.selectedItem = (selectedItem == -1) ? 0 : selectedItem;
	alert ("MusixcAZ Selected: " + this.selectedItem);
	this.topLeftItem = 0;
	
	//Proceed as Normal	
	//Update Padding on pageContent
	document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div><div id=Center class='SeriesCenter'><div id=Content style='padding-top:40px;'></div></div>";
		
	//Set banner Styling
	document.getElementById("bannerSelection").style.paddingTop="20px";
	document.getElementById("bannerSelection").style.paddingBottom="10px";
		
	//Display first XX series
	this.updateDisplayedItems();
		
	//Update Selected Collection CSS
	this.updateSelectedItems(false);
		
	//Set Banner Items
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index != this.bannerItems.length-1) {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";			
		} else {
			document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";					
		}
	}
	
	//Update Selected Banner Item
	this.selectedBannerItem = -1;
	this.updateSelectedBannerItems();
	this.selectedBannerItem = 0; 
	
	//Set Focus for Key Events
	document.getElementById("GuiPage_MusicAZ").focus();	
}

//---------------------------------------------------------------------------------------------------
//      TOP ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------
GuiPage_MusicAZ.updateDisplayedItems = function() {
	var htmlToAdd = "";
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.Letters.length); index++) {
		htmlToAdd += "<div id="+this.Letters[index] + "><div style='text-align:center;font-size:2.5em;padding-top:30px;'>"+this.Letters[index] + "</div></div>";
	}
	document.getElementById("Content").innerHTML = htmlToAdd;
}

//Function sets CSS Properties so show which user is selected
GuiPage_MusicAZ.updateSelectedItems = function (bypassCounter) {
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.Letters.length); index++){	
		if (index == this.selectedItem) {
			document.getElementById(this.Letters[index]).style.zIndex = "5";
			document.getElementById( this.Letters[index]).className = "Letter seriesSelected";			
		} else {
			document.getElementById(this.Letters[index]).style.zIndex = "2";
			document.getElementById(this.Letters[index]).className = "Letter";		
		}			
    }
	
	//Update Counter DIV
	if (this.Letters.length == 0) {
		document.getElementById("Counter").innerHTML = "";
	} else {
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + this.Letters.length;	
	}
}

GuiPage_MusicAZ.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.bannerItems.length; index++) {
		if (index == this.selectedBannerItem) {
			if (index != this.bannerItems.length-1) {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding BannerSelected";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem BannerSelected";
			}		
		} else {
			if (index != this.bannerItems.length-1) {
				if (this.bannerItems[index] == this.startParams[0]) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
				}
			} else {
				if (this.bannerItems[index] == this.startParams[0]) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem";
				}
			}
		}
	}
	if (this.selectedItem == -1) {
		document.getElementById("Counter").innerHTML = (this.selectedBannerItem+1) + "/" + this.bannerItems.length;
	}
}

GuiPage_MusicAZ.keyDown = function() {
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
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;		
		case tvKey.KEY_BLUE:
			//Focus the music player
			if (this.selectedItem == -1) {		
				if (this.selectedBannerItem == this.bannerItems.length-1) {
					GuiMusicPlayer.showMusicPlayer("GuiPage_MusicAZ","bannerItem"+this.selectedBannerItem,"guiDisplay_Series-BannerItem BannerSelected");
				} else {
					GuiMusicPlayer.showMusicPlayer("GuiPage_MusicAZ","bannerItem"+this.selectedBannerItem,"guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding BannerSelected");
				}
			} else {
				GuiMusicPlayer.showMusicPlayer("GuiPage_MusicAZ",this.Letters[this.selectedItem],document.getElementById(this.Letters[this.selectedItem]).className);
			}
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}

GuiPage_MusicAZ.openMenu = function() {
	if (this.selectedItem == -1) {
		Support.updateURLHistory("GuiPage_MusicAZ",this.startParams[0],null,null,null,this.selectedItem,this.topLeftItem,true);
		if (this.selectedBannerItem == this.bannerItems.length-1) {
			GuiMainMenu.requested("GuiPage_MusicAZ","bannerItem"+this.selectedBannerItem,"guiDisplay_Series-BannerItem BannerSelected");
		} else {
			GuiMainMenu.requested("GuiPage_MusicAZ","bannerItem"+this.selectedBannerItem,"guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding BannerSelected");
		}
	} else {
		Support.updateURLHistory("GuiPage_MusicAZ",this.startParams[0],null,null,null,this.selectedItem,this.topLeftItem,true);
		GuiMainMenu.requested("GuiPage_MusicAZ",this.Letters[this.selectedItem],document.getElementById(this.Letters[this.selectedItem]).className);
	}
}

GuiPage_MusicAZ.processTopMenuLeftKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem--;
		if (this.selectedBannerItem == -1) { //Going left from the end of the top menu.
			this.selectedBannerItem = 0;
			this.openMenu();
			return;
		}
		this.updateSelectedBannerItems();
	} else if (this.selectedItem % this.MAXCOLUMNCOUNT == 0){ //Going left from the first column.
		this.openMenu();
	} else {
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
}

GuiPage_MusicAZ.processTopMenuRightKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem++;
		if (this.selectedBannerItem >= this.bannerItems.length) {
			this.selectedBannerItem--;
		}
		this.updateSelectedBannerItems();	
	} else {
		this.selectedItem++;
		if (this.selectedItem >= this.Letters.length) {
			this.selectedItem--;
		} else {
			if (this.selectedItem >= this.topLeftItem+this.getMaxDisplay() ) {
				this.topLeftItem = this.selectedItem;
				this.updateDisplayedItems();
			}
		}
		this.updateSelectedItems();
	}
}

GuiPage_MusicAZ.processTopMenuUpKey = function() {
	if (this.selectedItem > (this.MAXCOLUMNCOUNT *2) -1){
		this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT +1; //Moving up from the bottom row.
	} else {
		this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT; //Moving up to the top row or the menu.
	}
	if (this.selectedItem < 0) {
		this.selectedBannerItem = 0;
		this.selectedItem = -1;
		this.updateSelectedItems();	
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

GuiPage_MusicAZ.processTopMenuDownKey = function() {
	if (this.selectedItem == -1) {
		this.selectedItem = 0;
		this.selectedBannerItem = -1;
		this.updateSelectedBannerItems();
	} else {
		if (this.selectedItem < this.MAXCOLUMNCOUNT +1){
			this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT; //Moving down from the top row.
		} else {
			this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT -1; //Moving down to the bottom row.
		}
		
		if (this.selectedItem >= this.Letters.length) {
			if (this.totalRecordCount > this.Letters.length) {
				this.loadMoreItems();
				
				if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
					this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
					this.updateDisplayedItems();
				}
				
			} else {
				this.selectedItem = (this.Letters.length-1);
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

GuiPage_MusicAZ.processTopMenuEnterKey = function() {
	alert ("TopMenuEnterKey");
	clearTimeout(this.backdropTimeout);
	
	//Add URL History
	Support.updateURLHistory("GuiPage_MusicAZ",this.startParams[0],null,null,null,this.selectedItem,this.topLeftItem,null);
	
	if (this.selectedItem == -1) {
		switch (this.bannerItems[this.selectedBannerItem]) {
		case "All":		
			if (GuiDisplay_Series.isTvOrMovies == 1) {	
				var url = Server.getChildItemsURL(Server.getMoviesViewId(),"&IncludeItemTypes=Movie&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
				GuiDisplay_Series.start("All Movies",url,0,0);
			} else {
				var url = Server.getChildItemsURL(Server.getTvViewId(),"&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
				GuiDisplay_Series.start("All TV",url,0,0);
			}
		break;
		case "Unwatched":
			if (GuiDisplay_Series.isTvOrMovies == 1) {	
				var url = Server.getChildItemsURL(Server.getMoviesViewId(),"&IncludeItemTypes=Movie&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true&Filters=IsUnPlayed");
				GuiDisplay_Series.start("Unwatched Movies",url,0,0);
			}	else {
				var url = Server.getChildItemsURL(Server.getTvViewId(),"&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&isPlayed=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
				GuiDisplay_Series.start("Unwatched TV",url,0,0);
			}
		break;
		case "Upcoming":
			GuiTV_Upcoming.start();
		break;
		case "Latest":		
			if (GuiDisplay_Series.isTvOrMovies == 1) {
				var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Movie&ParentId="+Server.getMoviesViewId()+"&isPlayed=false&IsFolder=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
				GuiDisplay_Series.start("Latest Movies",url,0,0);
			} else if (GuiDisplay_Series.isTvOrMovies == 0){
				var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Episode&isPlayed=false&IsFolder=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
				GuiDisplay_Series.start("Latest TV",url,0,0);
			} else {
				var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Audio&Limit=21&fields=SortName,Genres");
				GuiDisplay_Series.start("Latest Music",url,0,0);
			}			
		break;
		case "Genre":
			if (GuiDisplay_Series.isTvOrMovies == 1) {	
				var url1 = Server.getCustomURL("/Genres?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Movie&ParentId="+Server.getMoviesViewId()+"&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,ItemCounts&userId=" + Server.getUserID());
				GuiDisplay_Series.start("Genre Movies",url1,0,0);
			} else {
				var url1 = Server.getCustomURL("/Genres?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Series&ParentId="+Server.getTvViewId()+"&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,ItemCounts&userId=" + Server.getUserID());
				GuiDisplay_Series.start("Genre TV",url1,0,0);
			}		
		break;
		case "Album":	
		case "Album Artist":	
		case "Artist":	
			Support.removeLatestURL(); //Staying on the same page
			GuiPage_MusicAZ.start(this.bannerItems[this.selectedBannerItem],this.selectedItem);		
		break;
		case"A-Z":
			Support.removeLatestURL(); //Staying on the same page
			if (GuiDisplay_Series.isTvOrMovies == 1) {
				GuiPage_MusicAZ.start("Movies",this.selectedItem);
			} else {
				GuiPage_MusicAZ.start("TV",this.selectedItem);
			}
			break;
		case "Recent": //Music Only
			var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items?format=json&SortBy=DatePlayed&SortOrder=Descending&IncludeItemTypes=Audio&Filters=IsPlayed&Limit=21&Recursive=true&fields=SortName,Genres");
			GuiDisplay_Series.start("Recent Music",url,0,0);
			break;
		case "Frequent": //Music Only
			var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items?format=json&SortBy=PlayCount&SortOrder=Descending&IncludeItemTypes=Audio&Limit=21&Filters=IsPlayed&Recursive=true&fields=SortName,Genres");
			GuiDisplay_Series.start("Frequent Music",url,0,0);
			break;	
		}	
	} else {
		var urlString = (this.selectedItem == 0) ? "&NameLessThan=A" : "&NameStartsWith=" + this.Letters[this.selectedItem];
		urlString = (this.selectedItem == 27) ? "&NameStartsWithOrGreater=~" : urlString;

		switch (this.startParams[0]) {
			case "Album":
				var url = Server.getItemTypeURL("&IncludeItemTypes=MusicAlbum&Recursive=true&ExcludeLocationTypes=Virtual&fields=SortName,Genres&CollapseBoxSetItems=false" + urlString);
				GuiDisplay_Series.start("Album Music",url,0,0);
			break;
			case "Album Artist":
				var url = Server.getCustomURL("/Artists/AlbumArtists?format=json&SortBy=SortName&SortOrder=Ascending&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,Genres,ItemCounts&userId=" + Server.getUserID() + urlString);
				GuiPage_MusicArtist.start("Album Artist",url,0,0);
				break;
			case "Artist":
				var url = Server.getCustomURL("/Artists?format=json&SortBy=SortName&SortOrder=Ascending&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,Genres,ItemCounts&userId=" + Server.getUserID() + urlString);
				GuiDisplay_Series.start("Artist Music",url,0,0);
				break;
			case "TV":				
				var url = Server.getCustomURL("/Items?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Series&ParentId="+Server.getTvViewId()+"&Recursive=true&CollapseBoxSetItems=false&fields=SortName,Overview,Genres,RunTimeTicks&userId=" + Server.getUserID() + urlString);
				GuiDisplay_Series.start("Letter TV",url,0,0);		
				break;	
			case "Movies":				
				var url = Server.getCustomURL("/Items?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Movie&ParentId="+Server.getMoviesViewId()+"&Recursive=true&CollapseBoxSetItems=false&fields=SortName,Overview,Genres,RunTimeTicks&userId=" + Server.getUserID() + urlString);
				GuiDisplay_Series.start("Letter Movies",url,0,0);		
				break;		
			default:
				break;
		}
	}		
}

GuiPage_MusicAZ.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}