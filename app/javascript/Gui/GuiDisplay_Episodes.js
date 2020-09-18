var GuiDisplay_Episodes = {
		ItemData : null,
		ItemIndexData : null,
		
		selectedItem : 0,
		selectedBannerItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 1,
		MAXROWCOUNT : 8,
		
		indexSeekPos : -1,
		isResume : false,
		genreType : "",
		
		startParams : [],
		isLatest : false
}

GuiDisplay_Episodes.onFocus = function() {
	GuiHelper.setControlButtons("Favourite","Watched",null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
}

GuiDisplay_Episodes.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiDisplay_Episodes.start = function(title,url,selectedItem,topLeftItem) {	
	alert("Page Enter : GuiDisplay_Episodes");
	//Save Start Params	
	this.startParams = [title,url];
	alert (url);
	//Reset Values
	this.indexSeekPos = -1;
	this.selectedItem = selectedItem;
	this.selectedBannerItem = 0;
	this.topLeftItem = topLeftItem;
	this.genreType = null;
	
	//Load Data
	this.ItemData = Server.getContent(url);
	if (this.ItemData == null) { Support.processReturnURLHistory(); }
	
	//Latest Page Fix
	this.isLatest = false;
	if (title == "New TV") {
		this.isLatest = true;
	}
	
	if (this.ItemData.Items.length > 0) {
		
		document.getElementById("pageContent").innerHTML = "<div id=allOptions class='EpisodesAllOptions'>" +
		"<span id='bannerItem0'>Play All</span>" +
		"<span id='bannerItem1'>Shuffle All</span></div><div id=Content class='EpisodesList'></div>" +
		"<div id='EpisodesSeriesInfo' class='EpisodesSeriesInfo'></div>" + 
		"<div id='EpisodesImage' class='EpisodesImage'></div>" + 
		"<div id='EpisodesInfo' class='EpisodesInfo'>" +
		"<div id='SeriesTitle' style='font-size:1.7em; margin:6px 0px'></div>" +
		"<hr/>"+
		"<div id='SeriesOverview' class='EpisodesOverview'></div></div>" +
		"<div id='SeriesSubData' class='EpisodesSubData'></div>";
		
		
		//Set backdrop
		if (this.ItemData.Items[0].ParentBackdropImageTags){
			var imgsrc = Server.getBackgroundImageURL(this.ItemData.Items[0].ParentBackdropItemId,"Backdrop",Main.backdropWidth,Main.backdropHeight,0,false,0,this.ItemData.Items[0].ParentBackdropImageTags.length);
			Support.fadeImage(imgsrc);
		}
		
		//If cover art use that else use text
		if (this.ItemData.Items[0].ParentLogoItemId) {
			var imgsrc = Server.getImageURL(this.ItemData.Items[0].ParentLogoItemId,"Logo",600,80,0,false,0);
			document.getElementById("EpisodesSeriesInfo").style.backgroundImage="url('"+imgsrc+"')";
			document.getElementById("EpisodesSeriesInfo").className = 'EpisodesSeriesInfoLogo';	
		} else {
			document.getElementById("EpisodesSeriesInfo").innerHTML = this.ItemData.Items[0].SeriesName + " | Season " +  this.ItemData.Items[0].ParentIndexNumber;
			document.getElementById("EpisodesSeriesInfo").className = 'EpisodesSeriesInfo';
		}
		
		//Indexing Algorithm
		this.ItemIndexData = Support.processIndexing(this.ItemData.Items); 
	
		//Display first XX series
		this.updateDisplayedItems();
		this.updateSelectedBannerItems();
			
		//Update Selected Collection CSS
		this.updateSelectedItems();	
			
		//Set Focus for Key Events
		document.getElementById("GuiDisplay_Episodes").focus();
		
		//Load theme music if any
		GuiMusicPlayer.start("Theme", null, "GuiDisplay_Episodes",null,this.ItemData.Items[0].SeriesId,this.ItemData.Items[0].SeasonId);
	} else {
		//Set message to user
		document.getElementById("pageContent").innerHTML = "<div id='itemContainer' class='Columns"+this.MAXCOLUMNCOUNT+" padding10'><p id='title' class=pageTitle>"+title+"</p><div id=Content></div></div>";
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("title").innerHTML = "Sorry";
		document.getElementById("Content").className = "padding60";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid";
		
		//As no content focus on menu bar and null null means user can't return off the menu bar
		GuiMainMenu.requested(null,null);
	}	
}

GuiDisplay_Episodes.updateDisplayedItems = function() {
	var htmlToAdd = "";
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length); index++) {		
		var title = "";
		if (this.ItemData.Items[index].IndexNumber === undefined) {
			title = this.ItemData.Items[index].Name;
		} else {
			title = this.ItemData.Items[index].IndexNumber + " - " + this.ItemData.Items[index].Name;
		}
		
		htmlToAdd += "<div id=" + this.ItemData.Items[index].Id + " class='EpisodeListSingle'>";
		
		if (this.ItemData.Items[index].ImageTags.Primary) {			
			var imgsrc = Server.getImageURL(this.ItemData.Items[index].Id,"Primary",200,92,0,false,0);
			htmlToAdd += "<div class='EpisodeListSingleImage' style=background-image:url(" +imgsrc+ ")></div>";
		} else {
			htmlToAdd += "<div class='EpisodeListSingleImage'></div>";
		}
		
		htmlToAdd += "<div id=title_" + this.ItemData.Items[index].Id;
		
		if (this.ItemData.Items[index].UserData.Played == true) {
			htmlToAdd += " class='EpisodeListSingleTitleWatched'>"+ title +"</div>";
		}else if (this.ItemData.Items[index].LocationType == "Virtual"){
			htmlToAdd += " class='EpisodeListSingleTitleVirtual'>"+ title +"</div>";
		} else {
			htmlToAdd += " class='EpisodeListSingleTitle'>"+ title +"</div>";
		}
		if (this.ItemData.Items[index].UserData.IsFavorite == true) {
			htmlToAdd += "<div class='ShowListSingleFav'></div>";
		}
		if (this.ItemData.Items[index].UserData.Played == true) {
			htmlToAdd += "<div class='ShowListSingleWatched highlight"+Main.highlightColour+"Background'>&#10003</div>";
		}
		if (this.ItemData.Items[index].LocationType == "Virtual"){
			imageMissingOrUnaired = (Support.FutureDate(this.ItemData.Items[index].PremiereDate) == true) ? "ShowListSingleUnaired" : "ShowListSingleMissing";
			htmlToAdd += "<div class='"+imageMissingOrUnaired+"'></div>";
		}
		htmlToAdd += "</div>";

	}
	document.getElementById("Content").innerHTML = htmlToAdd;
	
	//Loop again to fix heights - has to be done after html is set!
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length); index++) {		
		//Height fix for overview based on height of title - Numbers will need to change if styling is changed!
		var titleHeight = $('#title_'+this.ItemData.Items[index].Id).height();
		
		if (titleHeight >= 50) {
			document.getElementById("title_"+this.ItemData.Items[index].Id).style.paddingTop = "2px";
		} else if (titleHeight >= 34) {
			document.getElementById("title_"+this.ItemData.Items[index].Id).style.paddingTop = "18px";
		}
	}
}

//Function sets CSS Properties so show which user is selected
GuiDisplay_Episodes.updateSelectedItems = function () {
	Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"EpisodeListSingle highlight"+Main.highlightColour+"Background","EpisodeListSingle","");
	
	if (this.selectedItem > -1) {
		//Update Displayed Image
		if (this.ItemData.Items[this.selectedItem].ImageTags.Primary) {			
			var imgsrc = Server.getImageURL(this.ItemData.Items[this.selectedItem].Id,"Primary",890,310,0,false,0);
			document.getElementById("EpisodesImage").style.backgroundImage="url('" + imgsrc + "')";
		}
					
		//Set Metadata
		var htmlSubData = "<table><tr>";
		
		if (this.ItemData.Items[this.selectedItem].ParentIndexNumber !== undefined) {
			if (this.ItemData.Items[this.selectedItem].ParentIndexNumber == 0) {
				htmlSubData += "<td class='MetadataItemSmall'>" + "Specials";
				+ "</td>";
			} else {
				htmlSubData += "<td class='MetadataItemSmall'>" + "Season " + this.ItemData.Items[this.selectedItem].ParentIndexNumber; 
				+ "</td>";
			}
			
		}
		
		var stars = this.ItemData.Items[this.selectedItem].CommunityRating;
		var starsImage = "";
		if (stars){
	    	if (stars <3.1){
	    		starsImage = "images/star_empty-46x40.png"; 
	    	} else if (stars >=3.1 && stars < 6.5) {
	    		starsImage = "images/star_half-46x40.png";
	    	} else {
	    		starsImage = "images/star_full-46x40.png";
	    	}
	    	htmlSubData += "<td class=MetadataItemIcon style=background-image:url("+starsImage+")></td>";
	    	htmlSubData += "<td class=MetadataItemVSmall>" + stars + "</td>";
		}
		if (this.ItemData.Items[this.selectedItem].PremiereDate !== undefined) {
			htmlSubData += "<td class='MetadataItemSmall'>" + Support.AirDate(this.ItemData.Items[this.selectedItem].PremiereDate, this.ItemData.Items[this.selectedItem].Type) 
				+ "</td>";
		}

		if (this.ItemData.Items[this.selectedItem].RunTimeTicks !== undefined) {
			htmlSubData += "<td class='MetadataItemSmall'>" + Support.convertTicksToMinutes(this.ItemData.Items[this.selectedItem].RunTimeTicks/10000) 
				+ "</td>";
		}
		
		if (this.ItemData.Items[this.selectedItem].HasSubtitles) {
			htmlSubData += "<td class=MetadataItemIcon style=background-image:url(images/cc-50x40.png)></td>";
		}
		
		htmlSubData += "</tr></table>";
									
		htmlForOverview = "";
		if (this.ItemData.Items[this.selectedItem].Overview !== undefined) {
			htmlForOverview = this.ItemData.Items[this.selectedItem].Overview;
		}
		
		//var currentEpTitle = Support.getNameFormat("", this.ItemData.Items[this.selectedItem].ParentIndexNumber, this.ItemData.Items[this.selectedItem].Name, this.ItemData.Items[this.selectedItem].IndexNumber);
		var currentEpTitle = this.ItemData.Items[this.selectedItem].IndexNumber + " - " + this.ItemData.Items[this.selectedItem].Name;

		document.getElementById("SeriesTitle").innerHTML = currentEpTitle;
		document.getElementById("SeriesSubData").innerHTML = htmlSubData;
		document.getElementById("SeriesOverview").innerHTML = htmlForOverview;
		
		//Height fix for overview based on height of title - Numbers will need to change if styling is changed!
		var titleHeight = $('#SeriesTitle').height();
		if (titleHeight >= 78) {
			document.getElementById("SeriesOverview").style.height = "218px";
		} else if (titleHeight >= 52) {
			document.getElementById("SeriesOverview").style.height = "1270px";
		} else {
			document.getElementById("SeriesOverview").style.height = "322px";
		}
					
		Support.scrollingText("SeriesOverview");
			
		//Background Image
		//Blocking code to skip getting data for items where the user has just gone past it
		var currentSelectedItem = this.selectedItem;
		setTimeout(function(){	
			if (GuiDisplay_Episodes.selectedItem == currentSelectedItem) {
				//Set Background
				if (GuiDisplay_Episodes.ItemData.Items[currentSelectedItem].BackdropImageTags.length > 0) {
					var imgsrc = Server.getBackgroundImageURL(GuiDisplay_Episodes.ItemData.Items[currentSelectedItem].Id,"Backdrop",Main.backdropWidth,Main.backdropHeight,0,false,0,GuiDisplay_Episodes.ItemData.Items[currentSelectedItem].BackdropImageTags.length);
					Support.fadeImage(imgsrc);
				}
			}
		}, 500);
	}	
}


GuiDisplay_Episodes.updateSelectedBannerItems = function() {
	for (var index = 0; index < 2; index++) {	
		if (this.selectedItem == -1) {
			if (this.selectedBannerItem == index) {
				document.getElementById("bannerItem"+index).className = "button highlight"+Main.highlightColour+"Background";
			} else {
				document.getElementById("bannerItem"+index).className = "button";
			}		
		} else {
			document.getElementById("bannerItem"+index).className = "button";
		}
	}
}

GuiDisplay_Episodes.keyDown = function() {
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
		case tvKey.KEY_UP:
			alert("UP");
			this.processUpKey();
			break;	
		case tvKey.KEY_DOWN:
			alert("DOWN");
			this.processDownKey();
			break;	
		case tvKey.KEY_LEFT:
			alert("LEFT");
			this.processLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			this.processRightKey();
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
			if (this.selectedItem > -1) {
				if (this.ItemData.Items[this.selectedItem].MediaType == "Video") {
					if (this.ItemData.Items[this.selectedItem].UserData.Played == true) {
						Server.deleteWatchedStatus(this.ItemData.Items[this.selectedItem].Id);
						this.ItemData.Items[this.selectedItem].UserData.Played = false
					} else {
						Server.setWatchedStatus(this.ItemData.Items[this.selectedItem].Id);
						this.ItemData.Items[this.selectedItem].UserData.Played = true
					}
					this.updateDisplayedItems();
					this.updateSelectedItems();
				}
			}
			break;
		case tvKey.KEY_RED:	
			if (this.selectedItem > -1) {
				if (this.ItemData.Items[this.selectedItem].UserData.IsFavorite == true) {
					Server.deleteFavourite(this.ItemData.Items[this.selectedItem].Id);
					this.ItemData.Items[this.selectedItem].UserData.IsFavorite = false;
				} else {
					Server.setFavourite(this.ItemData.Items[this.selectedItem].Id);
					Server.setFavourite(this.ItemData.Items[this.selectedItem].Id);
					this.ItemData.Items[this.selectedItem].UserData.IsFavorite = true;
				}
				this.updateDisplayedItems();
				this.updateSelectedItems();
			}
			break;		
		case tvKey.KEY_BLUE:
			if (this.selectedItem == -1) {		
				GuiMusicPlayer.showMusicPlayer("GuiDisplay_Episodes","bannerItem"+this.selectedBannerItem,"button highlight"+Main.highlightColour+"Background");
			} else {
				GuiMusicPlayer.showMusicPlayer("GuiDisplay_Episodes",this.ItemData.Items[this.selectedItem].Id,document.getElementById(this.ItemData.Items[this.selectedItem].Id).className);
			}
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

GuiDisplay_Episodes.processSelectedItem = function() {
	if (this.selectedItem == -1) {
		//Fix for return!
		Support.updateURLHistory("GuiDisplay_Episodes",this.startParams[0],this.startParams[1],null,null,0,this.topLeftItem,null);
	} else {
		Support.updateURLHistory("GuiDisplay_Episodes",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
	}
	
	if (this.selectedItem == -1) {
		if (this.selectedBannerItem == 0) {
			//Play All Episodes in Show
			var urlToPlay= Server.getChildItemsURL(this.ItemData.Items[0].SeasonId,"&ExcludeLocationTypes=Virtual&IncludeItemTypes=Episode&Recursive=true&SortBy=SortName&SortOrder=Ascending&Fields=ParentId,SortName,MediaSources")
			GuiPlayer.start("PlayAll",urlToPlay,0,"GuiDisplay_Episodes");	
		} else if (this.selectedBannerItem == 1) {
			//Shuffle All Episodes in Show
			var urlToPlay= Server.getChildItemsURL(this.ItemData.Items[0].SeasonId,"&ExcludeLocationTypes=Virtual&IncludeItemTypes=Episode&Recursive=true&SortBy=Random&SortOrder=Ascending&Fields=ParentId,SortName,MediaSources")
			GuiPlayer.start("PlayAll",urlToPlay,0,"GuiDisplay_Episodes");	
		}
	} else {
		var url = Server.getItemInfoURL(this.ItemData.Items[this.selectedItem].Id,null);
		GuiPage_ItemDetails.start(this.ItemData.Items[this.selectedItem].Name,url,0);
	}	
}

GuiDisplay_Episodes.playSelectedItem = function () {
	Support.playSelectedItem("GuiDisplay_Episodes",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null);
}

GuiDisplay_Episodes.processUpKey = function() {
	this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT;
	if (this.selectedItem < -1) {
		this.selectedItem = -1;
	} if (this.selectedItem == -1) {
		this.updateSelectedBannerItems();
		this.updateSelectedItems();
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

GuiDisplay_Episodes.processDownKey = function() {
	this.selectedItem = this.selectedItem + this.MAXCOLUMNCOUNT;
		
	//If now 0, was -1, update banner selection
	if (this.selectedItem == 0) { this.selectedBannerItem = 0; this.updateSelectedBannerItems(); }

	if (this.selectedItem >= this.ItemData.Items.length) {
		this.selectedItem = (this.ItemData.Items.length-1);
	} else if (this.selectedItem >= (this.topLeftItem  + this.getMaxDisplay())) {
			this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
			this.updateDisplayedItems();
			this.updateSelectedItems();
	} else {
		if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
			this.topLeftItem = this.topLeftItem + this.MAXCOLUMNCOUNT;
			this.updateDisplayedItems();
			
		}
		this.updateSelectedItems();
	}
}



GuiDisplay_Episodes.processChannelUpKey = function() {
	if (this.selectedItem > -1) {
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
}

GuiDisplay_Episodes.openMenu = function() {
	Support.updateURLHistory("GuiDisplay_Episodes",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
	if (this.selectedItem == -1) {
		if (this.selectedBannerItem == -1) {
			this.selectedBannerItem = 0;
			document.getElementById("bannerItem"+this.selectedBannerItem).className = "button";
		}
		GuiMainMenu.requested("GuiDisplay_Episodes","bannerItem"+this.selectedBannerItem,"button highlight"+Main.highlightColour+"Background");
	} else {
		GuiMainMenu.requested("GuiDisplay_Episodes",this.ItemData.Items[this.selectedItem].Id,"EpisodeListSingle highlight"+Main.highlightColour+"Background");
	}
}

GuiDisplay_Episodes.processLeftKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem--;
		this.updateSelectedBannerItems();
		if (this.selectedBannerItem == -1) {
			this.openMenu(); //Going left from the Play All / Shuffle All menu.
		}
	} else {
		this.openMenu(); //There's no left/right in the list of episodes, always open the menu.
	}	
}

GuiDisplay_Episodes.processRightKey = function() {
	if (this.selectedItem == -1) {
		if (this.selectedBannerItem == 0) {
			this.selectedBannerItem = 1;
			this.updateSelectedBannerItems();
		}
	}
}


GuiDisplay_Episodes.processChannelDownKey = function() {
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

GuiDisplay_Episodes.processIndexing = function() {
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

GuiDisplay_Episodes.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}