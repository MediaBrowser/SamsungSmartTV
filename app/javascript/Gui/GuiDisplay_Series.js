var GuiDisplay_Series = {
		ItemData : null,
		ItemIndexData : null,
		
		totalRecordCount : null,
		
		currentView : "",
		currentMediaType : "",
		
		selectedItem : 0,
		selectedBannerItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 9, //Default TV
		MAXROWCOUNT : 3,
		
		bannerItems : [],
		tvBannerItems : ["All","Unwatched","Latest","Upcoming", "Genre", "A-Z"],
		movieBannerItems : ["All","Unwatched","Latest","Genre", "A-Z"],
		musicBannerItems : ["Recent","Frequent","Album","Album Artist", "Artist"],
		
		indexSeekPos : -1,
		indexTimeout : null,
		isResume : false,
		genreType : "",
		
		isAllorFolder : 0,
		isTvOrMovies : 0,
		
		startParams : [],
		isLatest : false
}

GuiDisplay_Series.onFocus = function() {
	switch (this.currentMediaType) {
	case "Movies":
		GuiHelper.setControlButtons("Favourite","Watched","Next Index",GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	break;
	default:
		GuiHelper.setControlButtons("Favourite",null,"Next Index",GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	}
}

GuiDisplay_Series.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiDisplay_Series.start = function(title,url,selectedItem,topLeftItem) {	
	alert("Page Enter : GuiDisplay_Series");
	
	//Save Start Params	
	Support.pageLoadTimes("GuiDisplay_Series","Start",true);
	this.startParams = [title,url];
	
	//Reset Values
	this.indexSeekPos = -1;
	this.selectedItem = selectedItem;
	this.topLeftItem = topLeftItem;
	this.genreType = null;
	this.isLatest = false;
	this.bannerItems = [];
	this.totalRecordCount = 0;
	
	//Set Display Size from User settings
	this.MAXCOLUMNCOUNT = (File.getUserProperty("LargerView") == true) ? 7 : 9;
	this.MAXROWCOUNT = (File.getUserProperty("LargerView") == true) ? 2 : 3;

	//On show all items pages, there is no limit - For music there is due to speed!
	if (title == "Latest Music" || title == "Recent Music" || title == "Frequent Music") {
		this.ItemData = Server.getContent(url);
		this.totalRecordCount = 21;
	} else {
		this.ItemData = Server.getContent(url + "&Limit="+File.getTVProperty("ItemPaging"));
	}
	
	if (this.ItemData == null) { return; }
	this.totalRecordCount = (this.totalRecordCount == 0) ? this.ItemData.TotalRecordCount : this.totalRecordCount;
	Support.pageLoadTimes("GuiDisplay_Series","RetrievedServerData",false);
	
	//Update Padding on pageContent
	document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div><div id=Center class='SeriesCenter'><div id=Content></div></div>" +
	"<div id=SeriesContent class='SeriesContent'><div id='SeriesTitle' style='position:relative; height:40px; font-size:1.6em;'></div>" +
	"<div id='SeriesSubData' style='padding-top:2px;color:#2ad;font-size:1.8em;'></div>" +
	"<div id='SeriesOverview' style='margin-top:6px;padding-right:10px;font-size:1.1em;max-height:150px;overflow-y:hidden;'></div>" +
	"</div>";
	
	//Split Name - 1st Element = View, 2nd = Type (Collections being the odd one out!)
	var titleArray = title.split(" ");
	this.currentView = titleArray[0];
	this.currentMediaType = titleArray[1];
	
	switch (this.currentMediaType) {
	case "TV":
		this.isTvOrMovies = 0;
		this.bannerItems = this.tvBannerItems;
		if (File.getUserProperty("LargerView") == true) {
			document.getElementById("SeriesContent").style.top="830px";
			document.getElementById("SeriesOverview").style.height="250px";
		}
	break;
	case "Movies":
		this.isTvOrMovies = 1;
		this.bannerItems = this.movieBannerItems;
		if (File.getUserProperty("LargerView") == true) {
			document.getElementById("SeriesContent").style.top="830px";
			document.getElementById("SeriesOverview").style.height="250px";
		}
	break;
	case "Collections":
		this.isTvOrMovies = -1;
		if (File.getUserProperty("LargerView") == true) {
			document.getElementById("SeriesContent").style.top="830px";
			document.getElementById("SeriesOverview").style.height="250px";
		}
		break;
	case "Music":
	default:
		this.MAXCOLUMNCOUNT = 7;
		this.MAXROWCOUNT = 3;
		this.isTvOrMovies = 2;
		this.bannerItems = this.musicBannerItems;
		document.getElementById("SeriesContent").style.top="880px";
		document.getElementById("SeriesOverview").style.height="0px";	
	}
	
	switch (titleArray[0]) {
	case "Genre":
		this.genreType = (titleArray[1] == "TV") ? "Series" : "Movie";
		break;
	case "Latest":
		this.isLatest = true;
		this.ItemData.Items = this.ItemData;
		break;
	}

	//Determine if display is for all tv / movies or just a folder
	if ((url.split("ParentId").length - 1) == 2 || title == "Collections") {
		alert ("Media Folder");
		this.isAllorFolder = 1;
		this.bannerItems = []; //NEEDED HERE! 
		document.getElementById("bannerSelection").style.paddingTop="25px";
		document.getElementById("bannerSelection").style.paddingBottom="10px";
	} else {
		alert ("All TV or Movies");
		this.isAllorFolder = 0;
		document.getElementById("bannerSelection").style.paddingTop="25px";
		document.getElementById("bannerSelection").style.paddingBottom="5px";
	}
	
	if (this.ItemData.Items.length > 0) {		
		//Determine if extra top padding is needed for items <= MaxRow
		if (this.MAXROWCOUNT > 2) {
			if (this.ItemData.Items.length <= this.MAXCOLUMNCOUNT * 2) {
				if (this.ItemData.Items.length <= this.MAXCOLUMNCOUNT) {
					document.getElementById("Center").style.top = "200px";
				} else {
					document.getElementById("Center").style.top = "120px";
				}		
			}
		} else {
			if (this.ItemData.Items.length <= this.MAXCOLUMNCOUNT) {
				document.getElementById("Center").style.top = "220px";
			}
		}
		
		//Create banner headers only if all tv or all movies is selected
		if (this.isAllorFolder == 0) {
			for (var index = 0; index < this.bannerItems.length; index++) {
				if (index != this.bannerItems.length-1) {
					document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";			
				} else {
					document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";					
				}
			}
		}
	
		//Indexing Algorithm
		this.ItemIndexData = Support.processIndexing(this.ItemData.Items); 
	
		//Display first XX series
		this.updateDisplayedItems();
			
		//Update Selected Collection CSS
		this.updateSelectedItems();	
		
		this.selectedBannerItem = -1;
		this.updateSelectedBannerItems();
		this.selectedBannerItem = 0;

		//Set Focus for Key Events
		document.getElementById("GuiDisplay_Series").focus();
		Support.pageLoadTimes("GuiDisplay_Series","UserControl",false);
	} else {
		//Set message to user
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("Content").style.fontSize="40px";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid<br>Press return to get back to the previous screen";
		
		document.getElementById("NoItems").focus();
	}	
}

GuiDisplay_Series.updateDisplayedItems = function() {
	if (this.topLeftItem + this.getMaxDisplay() > this.ItemData.Items.length) {
		if (this.totalRecordCount > this.ItemData.Items.length) {
			this.loadMoreItems();
		}
	}
	
	Support.updateDisplayedItems(this.ItemData.Items,this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Content","",this.isResume,this.genreType);
}

GuiDisplay_Series.updateOneDisplayedItem = function() {
	Support.updateOneDisplayedItem(this.ItemData.Items[this.selectedItem],"",this.isResume,this.genreTypefalse,"GuiDisplay_Series",false);
}

//Function sets CSS Properties so show which user is selected
GuiDisplay_Series.updateSelectedItems = function () {
	if (this.isTvOrMovies == 2) {
		//Music - Use different styles
		Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
				Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Music Selected","Music","",false,this.totalRecordCount);
	} else {
		if (File.getUserProperty("LargerView") == true) {
			Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
					Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"SeriesPortraitLarge Selected","SeriesPortraitLarge","",false,this.totalRecordCount);
		} else {
			Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
					Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"SeriesPortrait Selected","SeriesPortrait","",false,this.totalRecordCount);
		}
		
	}
			
	var htmlForTitle = this.ItemData.Items[this.selectedItem].Name + "<div style='display:inline-block; position:absolute;'><table style='padding-left:20px;'><tr>";
	
	var toms = this.ItemData.Items[this.selectedItem].CriticRating;
	var stars = this.ItemData.Items[this.selectedItem].CommunityRating;
	var tomsImage = "";
	var starsImage = "";
	if (toms){
		if (toms > 59){
			tomsImage = "images/fresh-40x40.png";
		} else {
			tomsImage = "images/rotten-40x40.png";
		}
		htmlForTitle += "<td class=MetadataItemVSmall style=background-image:url("+tomsImage+")></td>";
		htmlForTitle += "<td class=MetadataItemVSmall )>" + toms + "%</td>";
	}
	if (stars){
    	if (stars <3.1){
    		starsImage = "images/star_empty-46x40.png"; 
    	} else if (stars >=3.1 && stars < 6.5) {
    		starsImage = "images/star_half-46x40.png";
    	} else {
    		starsImage = "images/star_full-46x40.png";
    	}
    	htmlForTitle += "<td class=MetadataItemVSmall style=background-image:url("+starsImage+")></td>";
    	htmlForTitle += "<td class=MetadataItemVSmall>" + stars + "</td>";
	}
	
	if (this.ItemData.Items[this.selectedItem].Type !== undefined
			&& this.ItemData.Items[this.selectedItem].ProductionYear !== undefined) {
		//"" is required to ensure type string is stored!
		text =  "" + Support.SeriesRun(this.ItemData.Items[this.selectedItem].Type, this.ItemData.Items[this.selectedItem].ProductionYear, this.ItemData.Items[this.selectedItem].Status, this.ItemData.Items[this.selectedItem].EndDate);

		if (text.indexOf("Present") > -1) {
			htmlForTitle += "<td class='MetadataItemSmallLong'>" + text + "</td>";
		} else {
			htmlForTitle += "<td class='MetadataItemSmall'>" + text + "</td>";
		}
	}
	
	if (this.ItemData.Items[this.selectedItem].OfficialRating !== undefined) {
		htmlForTitle +="<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].OfficialRating + "</td>";
	}
	if (this.ItemData.Items[this.selectedItem].RecursiveItemCount !== undefined) {
		if (this.isAllorFolder == 1) {
			htmlForTitle += "<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].RecursiveItemCount + " Items</td>";	
			if (this.ItemData.Items[this.selectedItem].RecursiveItemCount == 1){
				htmlForTitle += "<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].RecursiveItemCount + " Item</td>";	
			}
		}
		if (this.isTvOrMovies == 2) {
			htmlForTitle += "<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].RecursiveItemCount + " Songs</td>";	
			if (this.ItemData.Items[this.selectedItem].RecursiveItemCount == 1){
				htmlForTitle += "<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].RecursiveItemCount + " Song</td>";	
			}
		} else {
			if (this.ItemData.Items[this.selectedItem].SeasonCount !== undefined) {
				if (this.ItemData.Items[this.selectedItem].SeasonCount == 1){
					htmlForTitle += "<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].SeasonCount + " Season</td>";					
				} else {
					htmlForTitle += "<td class='MetadataItemSmall'>" + this.ItemData.Items[this.selectedItem].SeasonCount + " Seasons</td>";
				}
			}		
		}	
	}
	
	if (this.ItemData.Items[this.selectedItem].RunTimeTicks !== undefined) {
		htmlForTitle += "<td class='MetadataItemSmall'>" + Support.convertTicksToMinutes(this.ItemData.Items[this.selectedItem].RunTimeTicks/10000) + "</td>";
	}
	
	if (this.ItemData.Items[this.selectedItem].HasSubtitles) {
		htmlForTitle += "<td class=MetadataItemVSmall style=background-image:url(images/cc-50x40.png)></td>";
	}

	htmlForTitle += "</tr></table></div>";
			
	htmlForSubData = "";
	if (this.ItemData.Items[this.selectedItem].Genres !== undefined) {
		htmlForSubData = this.ItemData.Items[this.selectedItem].Genres.join(" / ");
	}
				
	htmlForOverview = "";
	if (this.ItemData.Items[this.selectedItem].Overview !== undefined) {
		htmlForOverview = this.ItemData.Items[this.selectedItem].Overview;
	}
	if (this.isTvOrMovies == 2) {
		document.getElementById("SeriesTitle").innerHTML = htmlForTitle;
		document.getElementById("SeriesSubData").innerHTML = htmlForSubData;
		document.getElementById("SeriesOverview").innerHTML = htmlForOverview;
		Support.scrollingText("SeriesOverview");
	} else {
		if (File.getUserProperty("LargerView") == true){
			document.getElementById("SeriesTitle").innerHTML = htmlForTitle;
			document.getElementById("SeriesOverview").innerHTML = htmlForOverview;
			Support.scrollingText("SeriesOverview");
		} else {
			document.getElementById("SeriesContent").style.top = "960px";
			document.getElementById("SeriesTitle").innerHTML = htmlForTitle;
		}
	}
		
	//Background Image
	//Blocking code to skip getting data for items where the user has just gone past it
	var currentSelectedItem = this.selectedItem;
	setTimeout(function(){	
		if (GuiDisplay_Series.selectedItem == currentSelectedItem) {
			//Set Background
			if (GuiDisplay_Series.ItemData.Items[currentSelectedItem].BackdropImageTags.length > 0) {
				var imgsrc = Server.getBackgroundImageURL(GuiDisplay_Series.ItemData.Items[currentSelectedItem].Id,"Backdrop",Main.width,Main.height,0,false,0,GuiDisplay_Series.ItemData.Items[currentSelectedItem].BackdropImageTags.length);
				Support.fadeImage(imgsrc);
			}
			else if (GuiDisplay_Series.ItemData.Items[currentSelectedItem].ParentBackdropImageTags) {
				var imgsrc = Server.getBackgroundImageURL(GuiDisplay_Series.ItemData.Items[currentSelectedItem].ParentBackdropItemId,"Backdrop",Main.width,Main.height,0,false,0,GuiDisplay_Series.ItemData.Items[currentSelectedItem].ParentBackdropImageTags.length);
				Support.fadeImage(imgsrc);
			}
		}
	}, 1000);
}

GuiDisplay_Series.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.bannerItems.length; index++) {	
		if (index == this.selectedBannerItem) {
			if (index != this.bannerItems.length-1) {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding red";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem red";
			}		
		} else {
			if (index != this.bannerItems.length-1) {
				if (this.bannerItems[index] == this.currentView) {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
				}
			} else {
				if (this.bannerItems[index] == this.currentView) {
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

GuiDisplay_Series.keyDown = function() {
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	if (document.getElementById("Notifications").style.visibility == "") {
		document.getElementById("Notifications").style.visibility = "hidden";
		document.getElementById("NotificationText").innerHTML = "";
		widgetAPI.blockNavigation(event);
		//Change keycode so it does nothing!
		keyCode = "VOID";
	}
	
	//Clear Indexing Letter Display timeout & Hide
	clearTimeout(this.indexTimeout);
	document.getElementById("guiDisplay_SeriesIndexing").style.visibility = "hidden";
	
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
			this.toggleWatchedStatus();
			break;
		case tvKey.KEY_RED:	
			if (this.selectedItem > -1) {
				if (this.ItemData.Items[this.selectedItem].UserData.IsFavorite == true) {
					Server.deleteFavourite(this.ItemData.Items[this.selectedItem].Id);
					this.ItemData.Items[this.selectedItem].UserData.IsFavorite = false;
				} else {
					Server.setFavourite(this.ItemData.Items[this.selectedItem].Id);
					this.ItemData.Items[this.selectedItem].UserData.IsFavorite = true;
				}
				Support.updateOneDisplayedItem(this.ItemData.Items[this.selectedItem],"",this.isResume,this.genreTypefalse,"GuiDisplay_Series",false);
			}
			break;
		case tvKey.KEY_YELLOW:
			GuiDisplay_Series.processIndexing();
			break;
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiDisplay_Series");
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

GuiDisplay_Series.processSelectedItem = function() {
	if (this.selectedItem == -1) {
		switch (this.bannerItems[this.selectedBannerItem]) {
		case "All":		
			if (this.isTvOrMovies == 1) {	
				var url = Server.getItemTypeURL("&IncludeItemTypes=Movie&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
				GuiDisplay_Series.start("All Movies",url,0,0);
			} else {
				var url = Server.getItemTypeURL("&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
				GuiDisplay_Series.start("All TV",url,0,0);
			}
		break;
		case "Unwatched":
			if (this.isTvOrMovies == 1) {	
				var url = Server.getItemTypeURL("&IncludeItemTypes=Movie&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true&Filters=IsUnPlayed");
				GuiDisplay_Series.start("Unwatched Movies",url,0,0);
			}	else {
				var url = Server.getItemTypeURL("&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&isPlayed=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
				GuiDisplay_Series.start("Unwatched TV",url,0,0);
			}
		break;
		case "Upcoming":
			GuiTV_Upcoming.start();
		break;
		case "Latest":		
			if (this.isTvOrMovies == 1) {
				var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Movie&isPlayed=false&IsFolder=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
				GuiDisplay_Series.start("Latest Movies",url,0,0);
			} else if (this.isTvOrMovies == 0){
				var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Episode&isPlayed=false&IsFolder=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
				GuiDisplay_Series.start("Latest TV",url,0,0);
			} else {
				var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Audio&Limit=21&fields=SortName,Genres");
				GuiDisplay_Series.start("Latest Music",url,0,0);
			}			
		break;
		case "Genre":
			if (this.isTvOrMovies == 1) {	
				var url1 = Server.getCustomURL("/Genres?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Movie&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,ItemCounts&userId=" + Server.getUserID());
				GuiDisplay_Series.start("Genre Movies",url1,0,0);
			} else {
				var url1 = Server.getCustomURL("/Genres?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Series&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,ItemCounts&userId=" + Server.getUserID());
				GuiDisplay_Series.start("Genre TV",url1,0,0);
			}		
		break;
		case "Album":	
		case "Album Artist":	
		case "Artist":	
			GuiPage_MusicAZ.start(this.bannerItems[this.selectedBannerItem]);		
		break;
		case"A-Z":
			if (this.isTvOrMovies == 1) {
				GuiPage_MusicAZ.start("Movies");
			} else {
				GuiPage_MusicAZ.start("TV");
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
		Support.processSelectedItem("GuiDisplay_Series",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null,this.genreType,this.isLatest); 	
	}
}

GuiDisplay_Series.toggleWatchedStatus = function () {
	if (this.selectedItem > -1) {
		var titleArray = this.startParams[0].split(" ");
		switch (titleArray[1]) {
		case "Movies":
			if (this.ItemData.Items[this.selectedItem].UserData.Played == true) {
				Server.deleteWatchedStatus(this.ItemData.Items[this.selectedItem].Id);
				this.ItemData.Items[this.selectedItem].UserData.Played = false;
			} else {
				Server.setWatchedStatus(this.ItemData.Items[this.selectedItem].Id);
				this.ItemData.Items[this.selectedItem].UserData.Played = true;
			}
			setTimeout(function(){
				GuiDisplay_Series.updateDisplayedItems();
				GuiDisplay_Series.updateSelectedItems();
			}, 250);
			break;
	/*	case "TV": //Mark all episodes of all seasons as watched (disabled)
			if (this.ItemData.Items[this.selectedItem].UserData.Played == true) {
				var urlSeasons = Server.getChildItemsURL(this.ItemData.Items[this.selectedItem].Id,"&IncludeItemTypes=Season&fields=SortName");
				var seasons = Server.getContent(urlSeasons);
				for (var s = 0; s < seasons.Items.length; s++){
					var urlEpisodes = Server.getChildItemsURL(seasons.Items[s].Id,"&IncludeItemTypes=Episode&fields=SortName,Overview");
					var episodes = Server.getContent(urlEpisodes);
					for (var e = 0; e < episodes.Items.length; e++){
						Server.deleteWatchedStatus(episodes.Items[e].Id);
					}
				}
			} else {
				var urlSeasons = Server.getChildItemsURL(this.ItemData.Items[this.selectedItem].Id,"&IncludeItemTypes=Season&fields=SortName");
				var seasons = Server.getContent(urlSeasons);
				for (var s = 0; s < seasons.Items.length; s++){
					var urlEpisodes = Server.getChildItemsURL(seasons.Items[s].Id,"&IncludeItemTypes=Episode&fields=SortName,Overview");
					var episodes = Server.getContent(urlEpisodes);
					for (var e = 0; e < episodes.Items.length; e++){
						Server.setWatchedStatus(episodes.Items[e].Id);
					}
				}
			}
			setTimeout(function(){
				GuiDisplay_Series.updateDisplayedItems();
				GuiDisplay_Series.updateSelectedItems();
			}, 750);
			break;*/
		}
	}	
}

GuiDisplay_Series.playSelectedItem = function () {
	Support.playSelectedItem("GuiDisplay_Series",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null);
}

GuiDisplay_Series.openMenu = function() {
	if (this.selectedItem == -1) {
		if (this.currentView == "All") {
			document.getElementById("bannerItem0").class = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
			GuiMainMenu.requested("GuiDisplay_Series","bannerItem0","guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding green");
		} else {
			document.getElementById("bannerItem0").class = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
			GuiMainMenu.requested("GuiDisplay_Series","bannerItem0","guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding green");
		}
	} else {
		Support.updateURLHistory("GuiDisplay_Series",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
		GuiMainMenu.requested("GuiDisplay_Series",this.ItemData.Items[this.selectedItem].Id,(File.getUserProperty("LargerView") == true) ? "SeriesPortraitLarge Selected" : "SeriesPortrait Selected");
	}
}

GuiDisplay_Series.processLeftKey = function() {
	if (this.selectedItem == -1) {
		this.selectedBannerItem--;
		this.updateSelectedBannerItems();
		if (this.selectedBannerItem == -1) { //Going left from the end of the top menu.
			this.selectedBannerItem = 0;
			this.openMenu();
		}
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

GuiDisplay_Series.processRightKey = function() {
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
				this.selectedItem = this.selectedItem - 1;
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

GuiDisplay_Series.processUpKey = function() {
	this.selectedItem = this.selectedItem - this.MAXCOLUMNCOUNT;
	if (this.selectedItem < 0) {
		if (this.isAllorFolder == 0 && this.startParams[0] != "All Collections" ) {
			this.selectedBannerItem = 0;
			this.selectedItem = -1;
			//Hide red - If Music use different styles
			if (this.isTvOrMovies == 2) {
				//Music - Use different styles
				Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
						Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"Music Selected","Music","");
			} else {
				if (File.getUserProperty("LargerView") == true) {
					Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
							Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"SeriesPortraitLarge Selected","SeriesPortraitLarge","");
				} else {
					Support.updateSelectedNEW(this.ItemData.Items,this.selectedItem,this.topLeftItem,
							Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length),"SeriesPortrait Selected","SeriesPortrait","");
				}
				
			}
			//update selected banner item
			this.updateSelectedBannerItems();
		} else {
			this.selectedItem = 0;
			//update selected item
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

GuiDisplay_Series.processDownKey = function() {
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

GuiDisplay_Series.processChannelUpKey = function() {
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

GuiDisplay_Series.processChannelDownKey = function() {
	if (this.selectedItem > -1) {
		this.selectedItem = this.selectedItem + this.getMaxDisplay();
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
			this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
			this.updateDisplayedItems();
		}
		this.updateSelectedItems();
	}
}

GuiDisplay_Series.processIndexing = function() {
	if (this.selectedItem > -1) {
		var indexLetter = this.ItemIndexData[0]
		var indexPos = this.ItemIndexData[1];
		
		this.indexSeekPos++;
		if (this.indexSeekPos >= indexPos.length) {
			//Check if more items, if so load next batch
			if (this.totalRecordCount > this.ItemData.Items.length) {
				this.loadMoreItems();				
			} else {
				this.indexSeekPos = 0;
				this.topLeftItem = 0;
			}
		}
		
		this.selectedItem = indexPos[this.indexSeekPos];
		this.topLeftItem = this.selectedItem; //safety net
		
		for (var i = this.selectedItem; i > this.selectedItem-this.MAXCOLUMNCOUNT; i--) {		
			if (i % this.MAXCOLUMNCOUNT == 0) {
				this.topLeftItem = i;
				break;
			}
		}
		
		document.getElementById("guiDisplay_SeriesIndexing").innerHTML = indexLetter[this.indexSeekPos].toUpperCase();
		document.getElementById("guiDisplay_SeriesIndexing").style.visibility = "";
		
		this.indexTimeout = setTimeout(function(){
			document.getElementById("guiDisplay_SeriesIndexing").style.visibility = "hidden";
		}, 1000);
		
		this.updateDisplayedItems();
		this.updateSelectedItems();
	}
}

GuiDisplay_Series.loadMoreItems = function() {
	if (this.totalRecordCount > this.ItemData.Items.length) {
		Support.pageLoadTimes("GuiDisplay_Series","GetRemainingItems",true);
		
		//Show Loading Div
		document.getElementById("guiPlayer_Loading").style.visibility = "";
		
		//Remove User Control
		document.getElementById("NoKeyInput").focus();
		
		//Load Data
		var originalLength = this.ItemData.Items.length
		var ItemDataRemaining = Server.getContent(this.startParams[1] + "&Limit="+File.getTVProperty("ItemPaging") + "&StartIndex=" + originalLength);
		if (ItemDataRemaining == null) { return; }
		Support.pageLoadTimes("GuiDisplay_Series","GotRemainingItems",false);
		
		for (var index = 0; index < ItemDataRemaining.Items.length; index++) {
			this.ItemData.Items[index+originalLength] = ItemDataRemaining.Items[index];
		}
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + this.ItemData.Items.length;
		
		//Reprocess Indexing Algorithm
		this.ItemIndexData = Support.processIndexing(this.ItemData.Items); 
		
		//Hide Loading Div
		document.getElementById("guiPlayer_Loading").style.visibility = "hidden";
		
		//Pass back Control
		document.getElementById("GuiDisplay_Series").focus();
		
		Support.pageLoadTimes("GuiDisplay_Series","AddedRemainingItems",false);
	}
}

GuiDisplay_Series.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}