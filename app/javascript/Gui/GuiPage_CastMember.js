var GuiPage_CastMember = {
		CastData : null,
		ItemData : null,
		
		selectedItem : 0,
		topLeftItem : 0,
		MAXCOLUMNCOUNT : 9,
		MAXROWCOUNT : 1,
}

GuiPage_CastMember.getMaxDisplay = function() {
	return this.MAXCOLUMNCOUNT * this.MAXROWCOUNT;
}

GuiPage_CastMember.start = function(title,url,selectedItem,topLeftItem) {	
	alert("Page Enter : GuiPage_CastMember");
	GuiHelper.setControlButtons(null,null,null,GuiMusicPlayer.Status == "PLAYING" || GuiMusicPlayer.Status == "PAUSED" ? "Music" : null,"Return");
	
	//Save Start Params
	this.startParams = [title,url];
	
	//Reset Values
	this.selectedItem = selectedItem;
	this.topLeftItem = topLeftItem;
	
	//Load Data
	this.CastData = Server.getContent(url);
	if (this.CastData == null) { return; }
	var Itemurl = Server.getItemTypeURL("&SortBy=SortName&SortOrder=Ascending&Recursive=true&Limit=100&ExcludeLocationTypes=Virtual&fields=ParentId&Person=" + this.CastData.Name.replace(/ /g, '+'));
	this.ItemData = Server.getContent(Itemurl);
	if (this.ItemData == null) { return; }
	
	document.getElementById("pageContent").className = "";	
	document.getElementById("pageContent").innerHTML = "<div id='GuiPage_CastMember_Name' class='GuiPage_CastMember_Name'></div> \
		<div id='GuiPage_CastMember_Details' class='GuiPage_CastMember_Details'></div> \
		<div id='GuiPage_CastMember_Poster' class='GuiPage_CastMember_Poster'></div> \
		<div id='GuiPage_CastMember_Bio' class='GuiPage_CastMember_Bio'></div> \
		<div id='GuiPage_CastMember_List' class='GuiPage_CastMember_List'></div>";
	document.getElementById("Counter").innerHTML = "1/1";	
	
	//Add cast member name and image.
	document.getElementById("GuiPage_CastMember_Name").innerHTML = this.CastData.Name;
	var imgsrc = Server.getImageURL(this.CastData.Id,"Primary",350,480,0,false,0);
	document.getElementById("GuiPage_CastMember_Poster").style.backgroundImage = "url("+imgsrc +")";
	
	var detailsHtml = "";
	if (this.CastData.PremiereDate && Main.getModelYear() != "D"){
		var birthday = new Date(this.CastData.PremiereDate);
		detailsHtml += "Born: "+birthday.toDateString() + "</br></br>";
	}
	if (this.CastData.ProductionLocations){
		var birthPlace = this.CastData.ProductionLocations;
		if (birthPlace != ""){
			detailsHtml += "Born in "+this.CastData.ProductionLocations + "</br></br>";
		}
	}
	if (this.CastData.EndDate && Main.getModelYear() != "D"){
		var deathday = new Date(this.CastData.EndDate);
		detailsHtml += "Died: "+deathday.toDateString() + "</br></br>";
	}
	document.getElementById("GuiPage_CastMember_Details").innerHTML = detailsHtml;
	
	//Person bio
	var bio = "";
	if (this.CastData.Overview){
		bio += this.CastData.Overview;
	}
	document.getElementById("GuiPage_CastMember_Bio").innerHTML = bio;
	
	//Set Overview Scroller
	Support.scrollingText("GuiPage_CastMember_Bio");
	
	if (this.ItemData.Items.length > 0) {	
		//Display first 12 series
		this.updateDisplayedItems();
			
		//Update Selected Collection CSS
		this.updateSelectedItems();	
			
		//Set Focus for Key Events
		document.getElementById("GuiPage_CastMember").focus();
	} else {
		//Cannot happen as link can only be generated from a Cast member - thus at minimum it will return 1 result (itself)
		document.getElementById("GuiPage_CastMember").focus();
	}
}

GuiPage_CastMember.updateDisplayedItems = function() {
	var htmlToAdd = "";
	var htmlToAdd2 ="";
	for (var index = this.topLeftItem;index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length); index++) {
		var imgsrc = "images/menu/Play-46x37.png";
		if (this.ItemData.Items[index].Type == "Episode"){
			if (this.ItemData.Items[index].ImageTags.Primary) {
				imgsrc = Server.getImageURL(this.ItemData.Items[index].Id,"Primary",180,100,null,null,null,index);
			} 
		} else {
			if (this.ItemData.Items[index].ImageTags.Thumb) {
				imgsrc = Server.getImageURL(this.ItemData.Items[index].Id,"Thumb",180,100,null,null,null,index);
			} else if (this.ItemData.Items[index].ImageTags.Primary) {
				imgsrc = Server.getImageURL(this.ItemData.Items[index].Id,"Primary",180,100,null,null,null,index);
			}
		}
		htmlToAdd += "<div id="+this.ItemData.Items[index].Id+" class='GuiPage_CastMember_ListSingle'><div class='GuiPage_CastMember_ListSingleImage' style=background-image:url(" +imgsrc+ ")></div><div class='GuiPage_CastMember_ListSingleTitle'>"+this.ItemData.Items[index].Name+"</div></div>";
	}
	document.getElementById("GuiPage_CastMember_List").innerHTML = htmlToAdd;
}

//Function sets CSS Properties so show which user is selected
GuiPage_CastMember.updateSelectedItems = function () {
	for (var index = this.topLeftItem; index < Math.min(this.topLeftItem + this.getMaxDisplay(),this.ItemData.Items.length); index++){	
		if (index == this.selectedItem) {
			document.getElementById(this.ItemData.Items[index].Id).className = "GuiPage_CastMember_ListSingle highlightBackground";
			//Set Background based on Type:
			switch (this.ItemData.Items[index].Type) {
			case "Episode":
				if (this.ItemData.Items[index].ParentBackdropItemId) {
					var imgsrc = Server.getBackgroundImageURL(this.ItemData.Items[index].ParentBackdropItemId,"Backdrop",Main.backdropWidth,Main.backdropHeight,0,false,0,this.ItemData.Items[index].ParentBackdropImageTags.length);
					Support.fadeImage(imgsrc);
				}
				break;
			case "Movie":	
			case "Series":
				if (this.ItemData.Items[index].BackdropImageTags.length > 0) {
					var imgsrc = Server.getBackgroundImageURL(this.ItemData.Items[index].Id,"Backdrop",Main.backdropWidth,Main.backdropHeight,0,false,0,this.ItemData.Items[index].BackdropImageTags.length);
					Support.fadeImage(imgsrc);
				}
				break;
			case "Photo":
				if (this.ItemData.Items[index].ImageTags.Primary.length > 0) {
					var imgsrc = Server.getImageURL(this.ItemData.Items[index].Id,"Primary",Main.backdropWidth,Main.backdropHeight,0,false,0);
					Support.fadeImage(imgsrc);
				}
				break;
			default:
				break;
			}
			
		} else {	
			document.getElementById(this.ItemData.Items[index].Id).className = "GuiPage_CastMember_ListSingle";		
		}		
	} 
	document.getElementById("Counter").innerHTML = (this.selectedItem + 1) + "/" + this.ItemData.Items.length;
}

GuiPage_CastMember.keyDown = function()
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
			alert("LEFT");
			this.openMenu();
			break;
		case tvKey.KEY_UP:
			alert("UP");	
			this.processUpKey();
			break;
		case tvKey.KEY_DOWN:
			alert("RIGHT");	
			this.processDownKey();
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
		case tvKey.KEY_YELLOW:	
			//Favourites
			break;	
		case tvKey.KEY_BLUE:
			GuiMusicPlayer.showMusicPlayer("GuiPage_CastMember",this.ItemData.Items[this.selectedItem].Id,document.getElementById(this.ItemData.Items[this.selectedItem].Id).className);
			break;	
		case tvKey.KEY_TOOLS:
			widgetAPI.blockNavigation(event);
			Support.updateURLHistory("GuiPage_CastMember",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
			document.getElementById(this.ItemData.Items[this.selectedItem].Id).className = "SeasonTitle";
			GuiMainMenu.requested("GuiPage_CastMember",this.ItemData.Items[this.selectedItem].Id,"EpisodeListSingle highlightBackground");
			break;	
		case tvKey.KEY_EXIT:
			alert ("EXIT KEY");
			widgetAPI.sendExitEvent(); 
			break;
	}
}

GuiPage_CastMember.openMenu = function() {
	Support.updateURLHistory("GuiPage_CastMember",null,null,null,null,null,null,null);
	GuiMainMenu.requested("GuiPage_CastMember",null);
}

GuiPage_CastMember.processSelectedItem = function() {	
	Support.processSelectedItem("GuiPage_CastMember",this.ItemData,this.startParams,this.selectedItem,this.topLeftItem,null,null)
}

GuiPage_CastMember.playSelectedItem = function () {
	if (this.ItemData.Items[this.selectedItem].MediaType == "Video") {
		Support.updateURLHistory("GuiPage_CastMember",this.startParams[0],this.startParams[1],null,null,this.selectedItem,this.topLeftItem,null);
		var url = Server.getItemInfoURL(this.ItemData.Items[this.selectedItem].Id);
		GuiPlayer.start("PLAY",url,this.ItemData.Items[this.selectedItem].UserData.PlaybackPositionTicks / 10000);	
	}
}

GuiPage_CastMember.processUpKey = function() {
	this.selectedItem--;
	if (this.selectedItem < 0) {
		this.selectedItem = 0;
	} else {
		if (this.selectedItem < this.topLeftItem) {
			this.topLeftItem = this.selectedItem;
			if (this.topLeftItem < 0) {
				this.topLeftItem = 0;
			}
			this.updateDisplayedItems();
		}
		this.updateSelectedItems();
	}
	
}

GuiPage_CastMember.processDownKey = function() {
	this.selectedItem++;
	if (this.selectedItem >= this.ItemData.Items.length) {
		this.selectedItem--;
	} else {
		if (this.selectedItem >= this.topLeftItem+this.getMaxDisplay() ) {
			this.topLeftItem++;
			this.updateDisplayedItems();
		}
	}
	this.updateSelectedItems();
}

GuiPage_CastMember.returnFromMusicPlayer = function() {
	this.selectedItem = 0;
	this.updateDisplayedItems();
	this.updateSelectedItems();
}