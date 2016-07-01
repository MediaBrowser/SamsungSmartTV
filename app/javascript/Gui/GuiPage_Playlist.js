var GuiPage_Playlist = {				
		AlbumData : null,
		
		selectedItem : 0, //the current row (-1 is the menu row).
		topLeftItem : 0,
		
		selectedItem2 : 0, //the current column.
		
		MAXCOLUMNCOUNT : 1,
		MAXROWCOUNT : 12, //Max = 12, causes graphical jump due to large html element, couldn't find issue,
		
		startParams : [],
		
		topMenuItems : ["PlayAll","ShuffleAll","Delete"],
		playItems : ["PlayFrom_","Play_","View_","Remove_"]

}

GuiPage_Playlist.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

//------------------------------------------------------------
//      Episode Functions
//------------------------------------------------------------

GuiPage_Playlist.start = function(title,url,type,playlistId) { //Type is either Audio or Video
	alert("Page Enter : GuiPage_Playlist");
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	
	//Save Start Params
	this.startParams = [title,url,type,playlistId];
	
	//Reset Vars
	this.topLeftItem = 0;
	this.selectedItem = -1;
	this.selectedItem2 = 0;
	
	//Load Data	
	this.AlbumData = Server.getContent(url);
	if (this.AlbumData == null) { return; }
	
	if (this.AlbumData.Items.length > 0) {
		//Set PageContent
		document.getElementById("pageContent").className = "";
		document.getElementById("pageContent").innerHTML = "<div id='playlistTitle' class='playlistTitle'></div> \
			   <div id='playlistSubtitle' class='playlistSubtitle'></div> \
			   <div id='playlist' class='playlist'> \
			   <div id='playlistGlobals' class='playlistGlobals'> \
			   <div id='PlayAll' class='guiMusic_Global'>Play All</div> \
			   <div id='ShuffleAll' class='guiMusic_Global'>Shuffle</div> \
			   <div id='Delete' class='guiMusic_Global'>Delete</div></div> \
			<div id='playlistOptions' class='playlistOptions'></div></div>";
		document.getElementById("Counter").innerHTML = "1/" + this.topMenuItems.length;	
				
		//Set Page Title
		document.getElementById("playlistTitle").innerHTML = title;	
		document.getElementById("playlistSubtitle").innerHTML = type + " Playlist";	
		
		//Get Page Items
		this.updateDisplayedItems();
		
		//Update Selected Item
		this.updateSelectedItems();
			
		//Set Focus for Key Events
		document.getElementById("GuiPage_Playlist").focus();
	} else {
		//No items in playlist
		//Set PageContent
		document.getElementById("pageContent").className = "";
		document.getElementById("pageContent").innerHTML = "<div id='playlistTitle' class='playlistTitle'></div> \
			   <div id='playlistSubtitle' class='playlistSubtitle'></div> \
			   <div id='playlist' class='playlist'> \
			   <div id='playlistGlobals' class='playlistGlobals'> \
			   <div id='PlayAll' class='guiMusic_Global'>Play All</div> \
			   <div id='ShuffleAll' class='guiMusic_Global'>Shuffle</div> \
			   <div id='Delete' class='guiMusic_Global'>Delete</div></div> \
			<div id='playlistOptions' class='playlistOptions'>There are no items in this playlist</div></div>";
		document.getElementById("Counter").innerHTML = "0/0";	
				
		//Set Page Title
		document.getElementById("playlistTitle").innerHTML = title;	
		document.getElementById("playlistSubtitle").innerHTML = type + " Playlist";	

		//Update Selected Item
		this.updateSelectedItems();
		
		//Set Focus for Key Events
		document.getElementById("GuiPage_Playlist").focus();	
	}
};

GuiPage_Playlist.updateDisplayedItems = function() {
	var htmlToAdd = "";
	if (this.startParams[2] == "Audio") {
		htmlToAdd = "<table><th style='width:200px'></th><th style='width:66px'></th><th style='width:72px'></th><th style='width:120px'></th><th style='width:66px'></th><th style='width:500px'></th><th style='width:130px'></th>";
		for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.AlbumData.Items.length); index++){			
			if (this.AlbumData.Items[index].ParentIndexNumber && this.AlbumData.Items[index].IndexNumber) {
				TrackDetails = this.AlbumData.Items[index].ParentIndexNumber+"." + this.AlbumData.Items[index].IndexNumber;
			} else if (this.AlbumData.Items[index].IndexNumber) {
				TrackDetails = this.AlbumData.Items[index].IndexNumber;
			} else {
				TrackDetails = "?";
			}
		
			htmlToAdd += "<tr><td id=PlayFrom_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Play From Here</td><td id=Play_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Play</td><td id=View_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>View</td><td id=Remove_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Remove</td>" +
					"<td class='guiMusic_TableTd'>"+TrackDetails+ "</td><td id="+ this.AlbumData.Items[index].Id +" class='guiMusic_TableTd'>" + this.AlbumData.Items[index].Name + "</td>" +
							"<td class='guiMusic_TableTd'>"+Support.convertTicksToTimeSingle(this.AlbumData.Items[index].RunTimeTicks/10000,true)+"</td></tr>";	
		}
	} else {
		htmlToAdd = "<table><th style='width:200px'></th><th style='width:66px'></th><th style='width:72px'></th><th style='width:120px'></th><th style='width:300px'></th><th style='width:100px'></th><th style='width:500px'></th><th style='width:130px'></th>";
		for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.AlbumData.Items.length); index++){	
			
			if (this.AlbumData.Items[index].Type == "Episode") {
				var epNo = Support.getNameFormat(null,this.AlbumData.Items[index].ParentIndexNumber,null,this.AlbumData.Items[index].IndexNumber);
				var seriesName = (this.AlbumData.Items[index].SeriesName !== undefined)? this.AlbumData.Items[index].SeriesName : "Unknown";
				
				htmlToAdd += "<tr><td id=PlayFrom_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Play From Here</td><td id=Play_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Play</td><td id=View_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>View</td><td id=Remove_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Remove</td>" +
						"<td id="+ this.AlbumData.Items[index].Id +" class='guiMusic_TableTd'>" + seriesName + "</td><td id=epNo_"+ this.AlbumData.Items[index].Id +" class='guiMusic_TableTd'>" + epNo + "</td><td id=epName_"+ this.AlbumData.Items[index].Id +" class='guiMusic_TableTd'>" + this.AlbumData.Items[index].Name + "</td>" +
								"<td class='guiMusic_TableTd'>"+Support.convertTicksToTimeSingle(this.AlbumData.Items[index].RunTimeTicks/10000,true)+"</td></tr>";		
			} else {		
				htmlToAdd += "<tr><td id=PlayFrom_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Play From Here</td><td id=Play_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Play</td><td id=View_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>View</td><td id=Remove_"+this.AlbumData.Items[index].Id+" class='guiMusic_TableTd'>Remove</td>" +
						"<td id="+ this.AlbumData.Items[index].Id +" class='guiMusic_TableTd'colspan=3 >" + this.AlbumData.Items[index].Name + "</td>" +
								"<td class='guiMusic_TableTd'>"+Support.convertTicksToTimeSingle(this.AlbumData.Items[index].RunTimeTicks/10000,true)+"</td></tr>";		
			}
		}
	}
	document.getElementById("playlistOptions").innerHTML = htmlToAdd + "</table>";
}

//Function sets CSS Properties so show which user is selected
GuiPage_Playlist.updateSelectedItems = function () {
	if (this.selectedItem == -1) {		
		//Highlight the selected global item (PlayAll, Shuffle etc.)
		for (var index = 0; index < this.topMenuItems.length; index++) {
			if (index == this.selectedItem2) {
				document.getElementById(this.topMenuItems[index]).className = "guiMusic_Global buttonSelected";
			} else {
				document.getElementById(this.topMenuItems[index]).className = "guiMusic_Global";
			}
		}		
	} else {
		//Reset the global items.
		for (var index = 0; index < this.topMenuItems.length; index++) {
			document.getElementById(this.topMenuItems[index]).className = "guiMusic_Global";
		}
		
		//Highlight the selected list item.
		for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.AlbumData.Items.length); index++){	
			if (index == this.selectedItem) {
				for (var index2 = 0; index2 < this.playItems.length; index2++) {
					if (index2 == this.selectedItem2) {
						document.getElementById(this.playItems[index2]+this.AlbumData.Items[index].Id).className = "guiMusic_TableTd buttonSelected";
					} else {
						document.getElementById(this.playItems[index2]+this.AlbumData.Items[index].Id).className = "guiMusic_TableTd";
					}
				}
			} else {
				document.getElementById(this.AlbumData.Items[index].Id).className = "guiMusic_TableTd";
				for (var index2 = 0; index2 < this.playItems.length; index2++) {
					document.getElementById(this.playItems[index2]+this.AlbumData.Items[index].Id).className = "guiMusic_TableTd";
				}
			}
		}
	}
	
	//Set Counter to be album count or x/3 for top part
	if (this.selectedItem == -1) {
		document.getElementById("Counter").innerHTML = (this.selectedItem2 + 1) + "/" + this.topMenuItems.length;
	} else {
		document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + this.AlbumData.Items.length;
	}
	
}

GuiPage_Playlist.keyDown = function() {
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
			this.processLeftKey();
			break;
		case tvKey.KEY_RIGHT:
			this.processRightKey();
			break;	
		case tvKey.KEY_UP:
			if (this.AlbumData.Items.length > 0) {
				this.processUpKey();
			}
		break;
		case tvKey.KEY_DOWN:
			if (this.AlbumData.Items.length > 0) {
				this.processDownKey();
			}
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
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			this.openMenu();
			break;	
		case tvKey.KEY_YELLOW:	
			//Favourites - May not be needed on this page
			break;			
		case tvKey.KEY_BLUE:	
			if (this.selectedItem == -1) {
				GuiMusicPlayer.showMusicPlayer("GuiPage_Playlist",this.topMenuItems[this.selectedItem2],"guiMusic_Global buttonSelected");
			} else {
				GuiMusicPlayer.showMusicPlayer("GuiPage_Playlist",this.playItems[this.selectedItem2]+this.AlbumData.Items[this.selectedItem].Id,"guiMusic_TableTd buttonSelected");
			}
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}

GuiPage_Playlist.openMenu = function() {
	Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,true);
	
	if (this.selectedItem == -1) {
		GuiMainMenu.requested("GuiPage_Playlist",this.topMenuItems[this.selectedItem],"guiMusic_Global green");
	} else {
		GuiMainMenu.requested("GuiPage_Playlist",this.playItems[this.selectedItem2]+this.AlbumData.Items[this.selectedItem].Id,"guiMusic_TableTd buttonSelected");
	}
}

GuiPage_Playlist.processUpKey = function() {
	this.selectedItem--;
	if (this.selectedItem < -1) { //When would this even happen?
		this.selectedItem = -1;
	} else {
		if (this.selectedItem == -1) {
			this.selectedItem2 = 0; //Always start from Play All so that Delete can only be highlighted by the user.
			document.getElementById(this.AlbumData.Items[0].Id).style.color = "white";
			for (var index = 0; index < this.playItems.length; index++) {
				document.getElementById(this.playItems[index]+this.AlbumData.Items[0].Id).className = "guiMusic_TableTd";
			}
		}
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

GuiPage_Playlist.processDownKey = function() {
	this.selectedItem++;
	if (this.selectedItem == 0) {
		this.selectedItem2 = 0;
	}
	if (this.selectedItem >= this.AlbumData.Items.length) {
		this.selectedItem--;
		if (this.selectedItem >= (this.topLeftItem  + this.getMaxDisplay())) {
			this.topLeftItem = this.topLeftItem + this.getMaxDisplay();
			this.updateDisplayedItems();
		}
	} else {
		if (this.selectedItem >= (this.topLeftItem + this.getMaxDisplay())) {
			this.topLeftItem++;
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiPage_Playlist.processLeftKey = function() {
	this.selectedItem2--;
	if (this.selectedItem2 == -1) {
		this.selectedItem2 = 0;
		this.openMenu();
	} else {
		this.updateSelectedItems();
	}
}

GuiPage_Playlist.processRightKey = function() {
	this.selectedItem2++;
	if (this.selectedItem == -1) {
		if (this.selectedItem2 > this.topMenuItems.length-1) {
			this.selectedItem2--;
		} else {
			this.updateSelectedItems();
		}
	} else {
		if (this.selectedItem2 > this.playItems.length-1) {
			this.selectedItem2--;
		} else {
			this.updateSelectedItems();
		}
	}
}

GuiPage_Playlist.processSelectedItem = function() {
	alert("List item = " + this.selectedItem + " : Menu item = " + this.selectedItem2);
	if (this.selectedItem == -1) {
		//Is Top Menu Bar
		switch (this.selectedItem2) {
		case 0:	
			if (this.AlbumData.Items.length > 0) {
				var url = Server.getCustomURL("/Playlists/"+this.startParams[3]+"/Items?userId="+Server.getUserID()+"&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,MediaSources&format=json");
				if (this.startParams[2] == "Video") {
					Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,null);
					GuiPlayer.start("PlayAll",url,0,"GuiPage_Playlist");
				} else if (this.startParams[2] == "Audio") {
					GuiMusicPlayer.start("Album",url,"GuiPage_Playlist",false);
				}				
			}		
			break;
		case 1:	
			if (this.AlbumData.Items.length > 0) {
				var url = Server.getCustomURL("/Users/"+Server.getUserID()+"/Items?userId="+Server.getUserID()+"&Fields=MediaSources,Chapters&Limit=100&Filters=IsNotFolder&Recursive=true&SortBy=Random&ParentId="+this.startParams[3]+"&ExcludeLocationTypes=Virtual&format=json");
				if (this.startParams[2] == "Video") {
					Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,null);
					GuiPlayer.start("PlayAll",url,0,"GuiPage_Playlist");
				} else if (this.startParams[2] == "Audio") {
					GuiMusicPlayer.start("Album",url,"GuiPage_Playlist",false);
				}				
			}		
			break;
		case 2:
			this.deletePlaylist(this.startParams[3]);
			break;	
		}
	} else {
		switch (this.selectedItem2) {
		case 0:
			var url = Server.getCustomURL("/Playlists/"+this.startParams[3]+"/Items?userId="+Server.getUserID()+"&StartIndex="+this.selectedItem+"&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,MediaSources&format=json");
			if (this.startParams[2] == "Video") {
				Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],0,0,null);
				GuiPlayer.start("PlayAll",url,0,"GuiPage_Playlist");
			} else if (this.startParams[2] == "Audio") {
				GuiMusicPlayer.start("Album",url,"GuiPage_Playlist",false);
			}	
			break;
		case 1:
			var url = Server.getItemInfoURL(this.AlbumData.Items[this.selectedItem].Id);
			if (this.startParams[2] == "Video") {
				Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],this.selectedItem,this.topLeftItem,null);
				GuiPlayer.start("PLAY",url,0,"GuiPage_Playlist");
			} else if (this.startParams[2] == "Audio"){
				GuiMusicPlayer.start("Song",url,"GuiPage_Playlist",false);
			}

			break;
		case 2:
			Support.updateURLHistory("GuiPage_Playlist",this.startParams[0],this.startParams[1],this.startParams[2],this.startParams[3],this.selectedItem,this.topLeftItem,null);
			if (this.startParams[2] == "Video") {
				var url = Server.getItemInfoURL(this.AlbumData.Items[this.selectedItem].Id);
				GuiPage_ItemDetails.start(this.AlbumData.Items[this.selectedItem].Name,url,0);
			} else if (this.startParams[2] == "Audio"){
				var url = Server.getChildItemsURL(this.AlbumData.Items[this.selectedItem].AlbumId,"&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Audio&Recursive=true&CollapseBoxSetItems=false");
				alert (url);
				GuiPage_Music.start(this.AlbumData.Items[this.selectedItem].Name,url,"MusicAlbum");
			}
			
			break;
		case 3:
			Server.removeFromPlaylist(this.startParams[3],this.AlbumData.Items[this.selectedItem].PlaylistItemId);
			//Timeout required to allow for action on the server!
			setTimeout(function(){
				GuiPage_Playlist.start(GuiPage_Playlist.startParams[0],GuiPage_Playlist.startParams[1],GuiPage_Playlist.startParams[2],GuiPage_Playlist.startParams[3]);
				},250);
			break;	
		}
	}
}

GuiPage_Playlist.deletePlaylist = function (playlistId) {
	var ids = "";
	for(var index = 0; index < this.AlbumData.Items.length; index++) {
		alert (this.AlbumData.Items[index].PlaylistItemId);
		ids += this.AlbumData.Items[index].PlaylistItemId + ",";
	}
	ids = ids.substring(0, ids.length-1);
	
	//Remove latest history to stop issues
	Support.removeLatestURL();
	
	//Remove all items from playlist
	Server.removeFromPlaylist(playlistId,ids);
	
	//Give the server half a sec to finish removing the items before we delete the playlist and request an updates list.
	setTimeout(function(){
		Server.deletePlaylist(playlistId);
	}, 250);

	setTimeout(function(){
		var url = Server.getItemTypeURL("SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Playlist&Recursive=true&Fields=SortName");	
		GuiDisplayOneItem.start("Playlists",url,0,0);
	}, 450);
}