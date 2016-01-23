var GuiTV_Upcoming = {	
		upcomingData : [],
		dateArray : [],
		topDayItem : 0,
		selectedDayItem : 0,
		
		selectedItem : 0,
		topLeftItem : 0,
		
		bannerItems : ["All","Unwatched","Latest","Upcoming","Genre"],
		selectedBannerItem : 0,
		
		MAXCOLUMNCOUNT : 3,
		MAXROWCOUNT : 1,
		
		divprepend1 : "",
		divprepend2 : "bottom_",

		backdropTimeout : null
}

GuiTV_Upcoming.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiTV_Upcoming.getMaxDisplayBottom = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiTV_Upcoming.start = function() {
	alert("Page Enter : GuiTV_Upcoming");
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	
	//Load Data
	var url = Server.getCustomURL("/Shows/Upcoming?format=json&Limit=40&UserId=" + Server.getUserID());
	var ItemData = Server.getContent(url);
	if (ItemData == null) { return; }
	
	//Reset Vars
	this.selectedItem = 0;
	this.selectedItem2 = -1; //Prevents any item being shown as selected! 
	this.topLeftItem = 0;
	this.topLeftItem2 = 0;
	this.topDayItem = 0;
	this.selectedDayItem = 0;
	
	var sameDayCount = 0;
	var seperateDayCount = 0;

	//Split into arrays on a per day basis
	this.upcomingData[seperateDayCount] = new Array();
	this.upcomingData[seperateDayCount][sameDayCount] = ItemData.Items[0];
	var currentdate = ItemData.Items[0].PremiereDate.substring(0, 10);
	this.dateArray[0] = Support.AirDate(currentdate,"Episode");
	for (var index = 1; index < ItemData.Items.length; index++) {
		//Compare release date 
		if (ItemData.Items[index].PremiereDate.substring(0, 10) == currentdate) {
			sameDayCount++;
		} else {
			currentdate = ItemData.Items[index].PremiereDate.substring(0, 10);
			seperateDayCount++;
			this.dateArray[seperateDayCount] = Support.AirDate(currentdate,"Episode");;
			this.upcomingData[seperateDayCount] = new Array();
			sameDayCount = 0;
		}
		this.upcomingData[seperateDayCount][sameDayCount] = ItemData.Items[index];
	}

	//Set PageContent
	document.getElementById("pageContent").innerHTML = "<div id=bannerSelection class='guiDisplay_Series-Banner'></div>" +
			"<div id=Center class='HomeOneCenter'>" + 
			"<p id='title1' style='font-size:1.2em;padding-left:22px;'></p><div id='TopRow' style='margin-bottom:60px'><div id=Content></div></div>" +
			"<p id='title2' style='font-size:1.2em;padding-left:22px;'></p><div id='BottomRow'><div id=Content2></div></div>" +
			"</div>";
	
	
	//If to determine positioning of content
	document.getElementById("Center").style.top = "140px";
	document.getElementById("Center").style.left = "200px";
	document.getElementById("Center").style.width = "1520px";
	
	if (ItemData.Items.length > 0) {		
		//Generate Banner display
		for (var index = 0; index < this.bannerItems.length; index++) {
			if (index != this.bannerItems.length-1) {
				document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";			
			} else {
				document.getElementById("bannerSelection").innerHTML += "<div id='bannerItem" + index + "' class='guiDisplay_Series-BannerItem'>"+this.bannerItems[index].replace(/-/g, ' ').toUpperCase()+"</div>";					
			}
		}
		
		//Display first XX series
		this.updateDisplayedItems();
		
		//Update Selected Collection CSS
		this.updateSelectedItems();	

		//Display first XX series
		this.updateDisplayedItems2();
			
		//Update Selected Collection CSS 
		this.updateSelectedItems2();
		
		//Update Titles
		this.updateTitles();
		
		//Update Banner
		this.selectedBannerItem = -1;
		this.updateSelectedBannerItems();
		this.selectedBannerItem = 0;
		
		//Update Counter
		this.updateCounter();
		
		document.getElementById("GuiTV_Upcoming").focus();	
	} else  {
		//Set message to user
		document.getElementById("Counter").innerHTML = "";
		document.getElementById("Content").style.fontSize="1.3em";
		document.getElementById("Content").innerHTML = "Huh.. Looks like I have no content to show you in this view I'm afraid<br>Press return to get back to the previous screen";
		
		document.getElementById("NoItems").focus();
	}
}

//---------------------------------------------------------------------------------------------------
//      TITLE + COUNTER SETTER
//---------------------------------------------------------------------------------------------------
GuiTV_Upcoming.updateTitles = function() {
	document.getElementById("title1").innerHTML = this.dateArray[this.topDayItem];
	document.getElementById("title2").innerHTML = this.dateArray[this.topDayItem+1];
}

GuiTV_Upcoming.updateCounter = function(isBottom) {
	if (this.selectedItem == -2) {
		document.getElementById("Counter").innerHTML = (this.selectedBannerItem+1) + "/" + this.bannerItems.length
	} else if (isBottom){
		document.getElementById("Counter").innerHTML = (this.selectedDayItem+1) + "/" + this.upcomingData.length + " - " + (this.selectedItem2+1) + "/" + this.upcomingData[this.selectedDayItem].length
	} else {
		document.getElementById("Counter").innerHTML = (this.selectedDayItem+1) + "/" + this.upcomingData.length + " - " + (this.selectedItem+1) + "/" + this.upcomingData[this.selectedDayItem].length
	}
}

//---------------------------------------------------------------------------------------------------
//      TOP ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------
GuiTV_Upcoming.updateDisplayedItems = function() {
	Support.updateDisplayedItems(this.upcomingData[this.topDayItem],this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.upcomingData[this.topDayItem].length),"Content",this.divprepend1,false,null,true);
}

//Function sets CSS Properties so show which user is selected
GuiTV_Upcoming.updateSelectedItems = function () {
	Support.updateSelectedNEW(this.upcomingData[this.topDayItem],this.selectedItem,this.topLeftItem,
			Math.min(this.topLeftItem + this.getMaxDisplay(),this.upcomingData[this.topDayItem].length),"Series Collection Selected","Series Collection",this.divprepend1,true);
}

GuiTV_Upcoming.updateSelectedBannerItems = function() {
	for (var index = 0; index < this.bannerItems.length; index++) {	
		if (index == this.selectedBannerItem) {
			if (index != this.bannerItems.length-1) {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding red";
			} else {
				document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem red";
			}		
		} else {
			if (index != this.bannerItems.length-1) {
				if (this.bannerItems[index] == "Upcoming") {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
				}
			} else {
				if (this.bannerItems[index] == "Upcoming") {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem blue";
				} else {
					document.getElementById("bannerItem"+index).className = "guiDisplay_Series-BannerItem";
				}
			}
		}
	}
}

GuiTV_Upcoming.keyDown = function()
{
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
	
	switch(keyCode)
	{
	case tvKey.KEY_LEFT:	
		if (this.selectedItem == -2) {
			this.selectedBannerItem--;
			if (this.selectedBannerItem < 0) {
				this.selectedBannerItem = 0;
			}
			this.updateSelectedBannerItems();	
			this.updateCounter();
		} else {
			this.selectedItem--;
			if (this.selectedItem < 0) {
				this.selectedItem++;
			} else {
				if (this.selectedItem < this.topLeftItem) {
					this.topLeftItem--;
					if (this.topLeftItem < 0) {
						this.topLeftItem = 0;
					}
					this.updateDisplayedItems();
				}
				this.updateCounter();
			}
			this.updateSelectedItems();
		}
			break;
		case tvKey.KEY_RIGHT:
			if (this.selectedItem == -2) {
				this.selectedBannerItem++;
				if (this.selectedBannerItem >= this.bannerItems.length) {
					this.selectedBannerItem--;
				}
				this.updateSelectedBannerItems();
				this.updateCounter();
			} else {
				this.selectedItem++;
				if (this.selectedItem >= this.upcomingData[this.selectedDayItem].length) {
					this.selectedItem--;
				} else {
					if (this.selectedItem >= this.topLeftItem+this.getMaxDisplayBottom() ) {
						this.topLeftItem++;
						this.updateDisplayedItems();
					}	
					this.updateSelectedItems();
					this.updateCounter();
				}
			}
		break;
		case tvKey.KEY_UP:	
			if (this.selectedDayItem > 0 ) {
				this.topLeftItem = 0;
				this.topLeftItem2 = 0;
									
				//Tracks which day is selected (array pos of upcomingData)
				this.topDayItem--;
				this.selectedDayItem--;
				
				this.updateTitles();

				//Update Selected 
				this.selectedItem  = 0;
				this.selectedItem2 = -1;
				this.updateDisplayedItems();
				this.updateSelectedItems();
				this.updateDisplayedItems2();
				this.updateSelectedItems2();
				this.selectedItem2 = 0;
				this.updateCounter();
			} else {
				this.selectedBannerItem = 0;
				this.selectedItem = -2;
				if (this.topLeftItem != 0) {
					this.topLeftItem = 0;
					if (this.ItemData.Items.length > 0) {
						this.updateDisplayedItems();
					}
				}	
				this.updateSelectedItems();	
				this.updateSelectedBannerItems();
				this.updateCounter();
			}
			break;	
		case tvKey.KEY_DOWN:
			if (this.selectedItem == -2) {
				this.selectedItem = 0;
				this.selectedBannerItem = -1;
				this.updateSelectedBannerItems();
				this.updateSelectedItems();	
				this.updateCounter();
			} else {
				//1st row to 2nd row items
				if (this.selectedDayItem < this.upcomingData.length) {
					//Set to 0 and reset display, then set to -1 and update selected so none are selected, then reset to 0
					if (this.topLeftItem != 0) {
						this.topLeftItem = 0;
						//Only update if there are items to show!!!
						if (this.ItemData.Items.length > 0) {
							this.updateDisplayedItems();
						}
					}
					
					//Tracks which day is selected (array pos of upcomingData)
					this.selectedDayItem++;
					
					this.selectedItem = -1;
					this.updateSelectedItems(true);		
					this.selectedItem = 0;
					
					//Set Focus
					document.getElementById("GuiTV_UpcomingBottom").focus();
					//Update Selected 
					this.selectedItem2 = 0;
					this.updateSelectedItems2();
					this.updateCounter(true);
				}
			}
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			this.processSelectedItem(false);
			break;	
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);	
			//Return added here - deleted in MainMenu if user does return
			if (this.selectedItem == -2) {		
				if (this.selectedBannerItem != this.bannerItems.length-1) {
					document.getElementById("bannerItem"+this.selectedBannerItem).className = "guiDisplay_Series-BannerItem guiDisplay_Series-BannerItemPadding";
				} else {
					document.getElementById("bannerItem"+this.selectedBannerItem).className = "guiDisplay_Series-BannerItem";
				}
				this.selectedItem = 0;
				this.topLeftItem = 0;
			}
			Support.updateURLHistory("GuiTV_Upcoming",null,null,null,null,this.selectedItem,this.topLeftItem,true);
			GuiMainMenu.requested("GuiTV_Upcoming",this.divprepend1 + this.upcomingData[this.selectedDayItem][this.selectedItem].Id);
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiTV_Upcoming");
			break;
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent();
			break;
	}
}


//---------------------------------------------------------------------------------------------------
//      BOTTOM ITEMS HANDLERS
//---------------------------------------------------------------------------------------------------

GuiTV_Upcoming.updateDisplayedItems2 = function() {
	var item = this.topDayItem+1;
	Support.updateDisplayedItems(this.upcomingData[item],this.selectedItem2,this.topLeftItem2,
			Math.min(this.topLeftItem2 + this.getMaxDisplayBottom(),this.upcomingData[item].length),"Content2",this.divprepend2,false,null,true);
}

//Function sets CSS Properties so show which user is selected
GuiTV_Upcoming.updateSelectedItems2 = function () {
	var item = this.topDayItem+1;
	Support.updateSelectedNEW(this.upcomingData[item],this.selectedItem2,this.topLeftItem2,
			Math.min(this.topLeftItem2 + this.getMaxDisplayBottom(),this.upcomingData[item].length),"Series Collection Selected","Series Collection",this.divprepend2,true);
}


GuiTV_Upcoming.bottomKeyDown = function()
{
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
	
	switch(keyCode)
	{
		case tvKey.KEY_LEFT:
			alert("LEFT BOTTOM");	
			this.selectedItem2--;
			if (this.selectedItem2 < 0) {
				this.selectedItem2++;
			} else {
				if (this.selectedItem2 < this.topLeftItem2) {
					this.topLeftItem2--;
					if (this.topLeftItem2 < 0) {
						this.topLeftItem2 = 0;
					}
					this.updateDisplayedItems2();
				}	
				this.updateSelectedItems2();
				this.updateCounter(true);
			}
			break;
		case tvKey.KEY_RIGHT:
			this.selectedItem2++;
			if (this.selectedItem2 >= this.upcomingData[this.selectedDayItem].length) {
				this.selectedItem2--;
			} else {
				if (this.selectedItem2 >= this.topLeftItem2+this.getMaxDisplayBottom() ) {
					this.topLeftItem2++;
					this.updateDisplayedItems2();
				}	
				this.updateSelectedItems2();
				this.updateCounter(true);
			}
			break;
		case tvKey.KEY_UP:
			if (this.topLeftItem2 != 0) {
				this.topLeftItem2 = 0;
				this.updateDisplayedItems2();
			}
				
			this.selectedItem2 = -1;
			this.updateSelectedItems2(true);		
			this.selectedItem2 = 0;
			
			this.selectedDayItem--;

			//Set Focus
			document.getElementById("GuiTV_Upcoming").focus();
			//Update Selected 
			this.selectedItem = 0;
			this.updateSelectedItems();
			this.updateCounter();
			break;
		case tvKey.KEY_DOWN:
			if (this.selectedDayItem < this.upcomingData.length-1) {
				this.topLeftItem = 0;
				this.topLeftItem2 = 0;
									
				//Tracks which day is selected (array pos of upcomingData)
				this.topDayItem++;
				this.selectedDayItem++;
				
				this.updateTitles();

				//Update Selected 
				this.selectedItem  = -1;
				this.selectedItem2 = 0;
				this.updateDisplayedItems();
				this.updateSelectedItems();
				this.selectedItem  = 0;
				this.updateDisplayedItems2();
				this.updateSelectedItems2();
				this.updateCounter(true);
			}
			break;	
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER BOTTOM");
			this.processSelectedItem(true);
			break;	
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			Support.updateURLHistory("GuiTV_Upcoming",null,null,null,null,this.selectedItem2,this.topLeftItem2,false);				
			GuiMainMenu.requested("GuiTV_UpcomingBottom",this.divprepend2 + this.upcomingData[this.selectedDayItem][this.selectedItem2].Id);
			break;
		case tvKey.KEY_RETURN:
			alert("RETURN BOTTOM");
			widgetAPI.blockNavigation(event);
			Support.processReturnURLHistory();
			break;	
		case tvKey.KEY_BLUE:	
			GuiMusicPlayer.showMusicPlayer("GuiTV_Upcoming");
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY BOTTOM");
			widgetAPI.sendExitEvent();
			break;
	}
}

//--------------------------------------------------------------------------------------------------------

GuiTV_Upcoming.processSelectedItem = function (isBottom) {
	clearTimeout(this.backdropTimeout);
	if (this.selectedItem == -2) {
		switch (this.bannerItems[this.selectedBannerItem]) {
		case "All":		
			var url = Server.getItemTypeURL("&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
			GuiDisplay_Series.start("All TV",url,0,0);
		break;
		case "Unwatched":
			var url = Server.getItemTypeURL("&IncludeItemTypes=Series&SortBy=SortName&SortOrder=Ascending&isPlayed=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks&recursive=true");
			GuiDisplay_Series.start("Unwatched TV",url,0,0);
		break;
		case "Latest":		
			var url = Server.getCustomURL("/Users/" + Server.getUserID() + "/Items/Latest?format=json&IncludeItemTypes=Episode&isPlayed=false&IsFolder=false&fields=ParentId,SortName,Overview,Genres,RunTimeTicks");
			GuiDisplay_Series.start("Latest TV",url,0,0);
					
		break;
		case "Genre":
			var url1 = Server.getCustomURL("/Genres?format=json&SortBy=SortName&SortOrder=Ascending&IncludeItemTypes=Series&Recursive=true&ExcludeLocationTypes=Virtual&Fields=ParentId,SortName,ItemCounts&userId=" + Server.getUserID());
			GuiDisplay_Series.start("Genre TV",url1,0,0);	
		break;
		}
	} else {
		var selectedItem = (isBottom) ? this.selectedItem2 : this.selectedItem;
		Support.updateURLHistory("GuiTV_Upcoming",null,null,null,null,null,null,null);
		
		var url = Server.getItemInfoURL(this.upcomingData[this.selectedDayItem][selectedItem].Id,null);
		GuiPage_ItemDetails.start(this.upcomingData[this.selectedDayItem][selectedItem].Name,url,0);
	}
}